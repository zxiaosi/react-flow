import {
  addEdge,
  Background,
  BackgroundVariant,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProps,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';

import { CustomLeftMenu, CustomRightConfig } from '@/components';
import useNodeConfig from '@/hooks/useNodeConfig';
import useProjectConfig from '@/hooks/useProjectConfig';
import { useShallow } from 'zustand/shallow';

import '@xyflow/react/dist/style.css'; // 引入样式
import { useCallback } from 'react';

let id = 0;
const getId = () => `node_${id++}`;

/**
 * 老版本谷歌浏览器的兼容性问题
 * - 遇到 fitView() 方法不生效问题, 可以选择降版本处理, 可以试试v12.4.4版本
 */
function App(props: ReactFlowProps) {
  /** react-flow 实例方法 */
  const { screenToFlowPosition } = useReactFlow();

  /** 项目配置 */
  const { showBg } = useProjectConfig(
    useShallow((state) => ({
      showBg: state.showBg,
    })),
  );

  /** 节点配置 */
  const { drageNodeData, showModal } = useNodeConfig(
    useShallow((state) => ({
      drageNodeData: state.drageNodeData,
      showModal: state.showModal,
    })),
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]); // 节点
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]); // 边

  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds)); // 连接线

  /** 节点拖拽中事件 */
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault(); // 一定要写, 否则onDrop事件不会触发
  }, []);

  /** 节点拖拽事件 */
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!drageNodeData) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const id = getId();
      const type = drageNodeData?.name;
      const newNode = { id, type, position, data: { label: `${type} ${id} ` } };

      setNodes((nds) => nds.concat(newNode));
    },
    [drageNodeData],
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        proOptions={{ hideAttribution: true }}
        {...props}
      >
        {/* 背景 */}
        {showBg && (
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        )}

        {/* 自定义左侧菜单 */}
        <CustomLeftMenu />

        {/* 自定义右侧配置 */}
        {showModal && <CustomRightConfig />}
      </ReactFlow>
    </div>
  );
}

/** App Provider */
const AppProvider = (props: ReactFlowProps) => {
  return (
    <ReactFlowProvider>
      <App {...props} />
    </ReactFlowProvider>
  );
};

export default AppProvider;
