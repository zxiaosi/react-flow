import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  OnSelectionChangeParams,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useKeyPress,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import {
  CustomContextMenu,
  CustomLeftSidebar,
  CustomRightSidebar,
  CustomTopNavigation,
} from '@/components';

import useEdgeConfig from '@/hooks/useEdgeConfig';
import useNodeConfig from '@/hooks/useNodeConfig';
import useRightSideBarConfig from '@/hooks/useRightSideBarConfig';

import { EDGE_TYPES, NODE_TYPES } from '@/global';
import { calculateNodeDeviationUtil, getNodeIdUtil } from '@/utils';

import '@xyflow/react/dist/style.css'; // 引入样式
import useSelectNodeEdge from './hooks/useSelectNodeEdge';

/**
 * 自定义拓扑
 * - nodes节点数据 中必须含有 宽 和 高, 否则 dagrejs 无法布局
 * - dagrejs/dagre v1.1.4 在老版浏览器(eg: chromev89.0.4389.90) 会报 Object.hasOwn is not a function 错误
 * - dagrejs/dagre v1.1.3 版本 可以解决上面问题
 */
function App() {
  const { screenToFlowPosition, getNodes } = useReactFlow();

  /** 方向键位 */
  const arrowPress = useKeyPress([
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ]);

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

  /** 节点/连接线选择事件 */
  const {
    selectedNodes,
    onChangeSelectedNodes,
    selectedEdges,
    onChangeSelectedEdges,
  } = useSelectNodeEdge(
    useShallow((state) => ({
      selectedNodes: state.selectedNodes,
      onChangeSelectedNodes: state.onChangeSelectedNodes,
      selectedEdges: state.selectedEdges,
      onChangeSelectedEdges: state.onChangeSelectedEdges,
    })),
  );

  const ref = useRef<HTMLDivElement>(null); // 画布ref
  const selectedRef = useRef<Node[]>([]); // 选中连线

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]); // 节点
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]); // 边
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null); // 右键菜单

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);

  /** 节点连线事件 */
  const handleConnect = useCallback(
    (params: Connection) => {
      onChangeRecord?.(undefined); // 关闭右侧侧边栏

      const { source, sourceHandle, target, targetHandle } = params;
      const id = [source, sourceHandle, target, targetHandle]
        .filter(Boolean)
        .join('->');
      const newEdge = { ...params, id, type: 'customEdge', animated };
      return setEdges((eds) => addEdge(newEdge, eds));
    },
    [onChangeRecord, edgeType, animated, setEdges],
  );

  /** 节点拖拽中事件 */
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault(); // 一定要写, 否则onDrop事件不会触发
  }, []);

  /** 节点拖拽事件 */
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const className = event.target.parentNode?.className as string;

      // 如果拖动到非画布节点时, 不执行拖拽事件
      if (
        !(
          className?.includes('react-flow__renderer') ||
          className?.includes('react-flow__node')
        ) ||
        !drageNodeData
      )
        return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = getNodeIdUtil(getNodes);
      const type = drageNodeData?.name;
      const newNode = { id, type, position, data: { label: `${type} ${id}` } };

      setNodes((nds) => nds.concat(newNode));
    },
    [drageNodeData, screenToFlowPosition, setNodes],
  );

  /** 节点/连接线右键事件 */
  const handleContextMenu = (event: React.MouseEvent, nodeOrEdge: any) => {
    event.preventDefault();

    const { clientX, clientY } = event;
    const { id, type, measured } = nodeOrEdge as Node & Edge;

    const pane = ref.current?.getBoundingClientRect?.(); // 获取画布的宽高
    const { width, height } = pane || { width: 0, height: 0 };
    setContextMenu({
      id,
      type: type!,
      nodeOrEdge: measured ? 'node' : 'edge', // 节点或边
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

  /** 节点/连接线选择事件 */
  const handleSelectionChange = useCallback(
    (nodeEdgeObj: OnSelectionChangeParams) => {
      onChangeSelectedNodes(nodeEdgeObj.nodes);
      onChangeSelectedEdges(nodeEdgeObj.edges);
      selectedRef.current = nodeEdgeObj.nodes;
    },
    [onChangeSelectedEdges, onChangeSelectedNodes],
  );

  /** 调整自定义连接线拐点方法 */
  const handleEdgesVertices = (nodes?: Node[]) => {
    let realNodes = [] as Node[];
    if (!nodes) {
      const allNodes = getNodes();
      if (allNodes.length === 0) return;
      const selectedNodeIds = selectedNodes.map((node) => node.id);
      const realSelectedNodes = allNodes.filter((node) => {
        return selectedNodeIds.includes(node.id);
      });
      realNodes = realSelectedNodes;
    } else {
      realNodes = nodes;
    }

    const selectedEdgeIds = selectedEdges.map((edge) => edge.id);
    const offset = calculateNodeDeviationUtil(selectedRef.current, realNodes);
    console.log('offset', offset, realNodes);
    setEdges((preEdges) => {
      return preEdges.map((edge) => {
        const { data, id } = edge;
        if (selectedEdgeIds.includes(id) && data?.vertices) {
          const newVertices = data?.vertices?.map((item) => {
            return {
              ...item,
              x: item.x + offset.x,
              y: item.y + offset.y,
            };
          });
          return { ...edge, data: { ...data, vertices: newVertices } };
        } else {
          return edge;
        }
      });
    });
    selectedRef.current = realNodes;
  };

  /** 节点/连接线选中之后拖拽事件 */
  const handleSelectionDrag = (event: React.MouseEvent, nodes: Node[]) => {
    handleEdgesVertices(nodes);
  };

  useEffect(() => {
    console.log('KeyPress', arrowPress);
    handleEdgesVertices();
  }, [arrowPress]);

  // 导出的时候用
  // console.log('rfInstance', rfInstance?.toObject());

  return (
    <div className="app">
      <ReactFlow
        ref={ref}
        onInit={setRfInstance}
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
        onSelectionChange={handleSelectionChange}
        onSelectionDrag={handleSelectionDrag}
        // selectionKeyCode={'Shift'} // 选中一片
        // multiSelectionKeyCode={['Ctrl', 'Meta']} // 多选
        // deleteKeyCode={'Backspace'} // 删除选中节点
        proOptions={{ hideAttribution: true }}
      >
        {/* 背景 */}
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

        {/* 自定义左侧侧边栏 */}
        <CustomLeftSidebar onClick={handlePaneClick} />

        {/* 自定义右侧侧边栏 */}
        <CustomRightSidebar onClick={handleContextMenuClose} />

        {/* 自定义顶部导航栏 */}
        <CustomTopNavigation />

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
const AppProvider = () => {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
};

export default AppProvider;
