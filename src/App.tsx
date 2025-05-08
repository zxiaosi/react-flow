import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProps,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import {
  CustomContextMenu,
  CustomLeftSidebar,
  CustomRightSidebar,
} from '@/components';

import useEdgeConfig from '@/hooks/useEdgeConfig';
import useNodeConfig from '@/hooks/useNodeConfig';
import useRightSideBarConfig from '@/hooks/useRightSideBarConfig';

import { EDGE_TYPES, NODE_TYPES } from '@/global';
import { getNodeIdUtil } from '@/utils';

import '@xyflow/react/dist/style.css'; // 引入样式

/**
 * 自定义拓扑
 * - nodes节点数据 中必须含有 宽 和 高, 否则 dagrejs 无法布局
 * - dagrejs/dagre v1.1.4 在老版浏览器(eg: chromev89.0.4389.90) 会报 Object.hasOwn is not a function 错误
 * - dagrejs/dagre v1.1.3 版本 可以解决上面问题
 */
function App(props: ReactFlowProps) {
  const { screenToFlowPosition, getNodes } = useReactFlow();

  /** 节点配置 */
  const { drageNodeData } = useNodeConfig(
    useShallow((state) => ({
      drageNodeData: state.drageNodeData,
    })),
  );

  /** 连接线配置 */
  const { edgeType, animated } = useEdgeConfig(
    useShallow((state) => ({
      animated: state.animated,
      edgeType: state.edgeType,
    })),
  );

  /** 右侧侧边栏配置 */
  const { record, onChangeRecord } = useRightSideBarConfig(
    useShallow((state) => ({
      record: state.record,
      onChangeRecord: state.onChangeRecord,
    })),
  );

  const ref = useRef<HTMLDivElement>(null); // 画布ref

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]); // 节点
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]); // 边
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null); // 右键菜单

  /** 节点连线事件 */
  const handleConnect = (params: Connection) => {
    console.log('handleConnect', params);

    onChangeRecord?.(undefined); // 关闭右侧侧边栏

    const { source, sourceHandle, target, targetHandle } = params;
    const id = [source, sourceHandle, target, targetHandle]
      .filter(Boolean)
      .join('_');
    const newEdge = { ...params, id, type: edgeType, animated };
    return setEdges((eds) => addEdge(newEdge, eds));
  };

  /** 节点拖拽中事件 */
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // 一定要写, 否则onDrop事件不会触发
  };

  /** 节点拖拽事件 */
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const classList = event.target?.classList || [];

    if (!classList?.contains('react-flow__pane') || !drageNodeData) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const id = getNodeIdUtil(getNodes);
    const type = drageNodeData?.name;
    const newNode = { id, type, position, data: { label: `${type} ${id}` } };

    setNodes((nds) => nds.concat(newNode));
  };

  /** 节点/连接线右键事件 */
  const handleContextMenu = (event: React.MouseEvent, nodeOrEdge: any) => {
    event.preventDefault();

    const { clientX, clientY } = event;
    const { id, measured } = nodeOrEdge as Node & Edge;

    const pane = ref.current?.getBoundingClientRect?.(); // 获取画布的宽高
    const { width, height } = pane || { width: 0, height: 0 };
    setContextMenu({
      id: id,
      type: measured ? 'node' : 'edge', // 节点或边
      top: clientY < height - 200 && clientY,
      left: clientX < width - 200 && clientX,
      right: clientX >= width - 200 && width - clientX,
      bottom: clientY >= height - 200 && height - clientY,
    });
  };

  /** 节点/连接线右键关闭事件 */
  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  /** 节点/连接线点击事件 */
  const handleNodeEdgeClick = useCallback(
    (event: React.MouseEvent, nodeOrEdge: Node | Edge) => {
      console.log('handleNodeEdgeClick', nodeOrEdge);

      handleContextMenuClose(); // 关闭右键菜单
      const type = nodeOrEdge?.measured ? 'node' : 'edge';
      if (record) onChangeRecord?.({ ...record, id: nodeOrEdge.id, type }); // 切换右侧侧边栏
    },
    [handleContextMenuClose, record, onChangeRecord],
  );

  /** 面板点击事件 */
  const handlePaneClick = useCallback(() => {
    console.log('handlePaneClick');
    handleContextMenuClose(); // 关闭右键菜单
    onChangeRecord?.(undefined); // 关闭右侧侧边栏
  }, [handleContextMenuClose, onChangeRecord]);

  return (
    <div className="app">
      <ReactFlow
        ref={ref}
        edgeTypes={EDGE_TYPES}
        nodeTypes={NODE_TYPES}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onPaneClick={handlePaneClick}
        onNodeClick={handleNodeEdgeClick}
        onNodeContextMenu={handleContextMenu}
        onEdgeClick={handleNodeEdgeClick}
        onEdgeContextMenu={handleContextMenu}
        proOptions={{ hideAttribution: true }}
        {...props}
      >
        {/* 背景 */}
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

        {/* 自定义左侧侧边栏 */}
        <CustomLeftSidebar onClick={handlePaneClick} />

        {/* 自定义右侧侧边栏 */}
        <CustomRightSidebar onClick={handleContextMenuClose} />

        {/* 自定义右键菜单 */}
        {contextMenu && (
          <CustomContextMenu
            onClick={handleContextMenuClose}
            {...contextMenu}
          />
        )}
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
