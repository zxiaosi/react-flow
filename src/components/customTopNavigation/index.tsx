import { GROUP_NAMES, OFFSET } from '@/global';
import useSelectNodeEdge from '@/hooks/useSelectNodeEdge';
import {
  calculateGroupBoundsUtil,
  compareArraysUtil,
  getNodeIdUtil,
} from '@/utils';
import { Node, Panel, useReactFlow } from '@xyflow/react';
import { Button, Space } from 'antd';
import { first } from 'lodash';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';

/** 自定义顶部导航栏组件 */
const CustomTopNavigation = () => {
  const { setNodes, getNodes, setEdges } = useReactFlow();

  /** 节点/连接线选择事件 */
  const { selectedNodes, onChangeSelectedNodes, selectedEdges } =
    useSelectNodeEdge(
      useShallow((state) => ({
        selectedNodes: state.selectedNodes,
        onChangeSelectedNodes: state.onChangeSelectedNodes,
        selectedEdges: state.selectedEdges,
      })),
    );

  /** 创建自动组事件 */
  const handleCreateGroup = () => {
    if (selectedNodes.length < 2) return;

    const nodeIds = selectedNodes.map((node) => node.id);

    // 获取所有节点
    const nodes = getNodes();
    const isExists = nodes.some((node) => {
      return (
        GROUP_NAMES.includes(node.type!) &&
        compareArraysUtil(nodeIds, node.id.split('->'))
      );
    });
    if (isExists) return;

    const groupId = nodeIds.join('->');
    const selectedNodeIds = selectedNodes.map((node) => node.id);

    // 获取所有节点的最大/最小坐标
    const { minX, minY, maxX, maxY } = calculateGroupBoundsUtil(selectedNodes);

    // 创建组节点
    const groupNode = {
      id: groupId,
      type: 'customGroupNode',
      data: {},
      position: { x: minX, y: minY },
      width: Math.abs(maxX - minX),
      height: Math.abs(maxY - minY),
    };

    // 更新节点
    const updatedNodes: Node[] = nodes.map((node) => {
      if (selectedNodeIds.includes(node.id)) {
        const x = node.position.x - Math.abs(minX);
        const y = node.position.y - Math.abs(minY);
        return {
          ...node,
          parentId: groupId,
          extent: 'parent',
          position: { x, y },
          selected: false,
        };
      }
      return node;
    });

    setNodes([groupNode, ...updatedNodes]); // groupNode 必须放在前面, 否则会导致 extent: 'parent' 不生效
    onChangeSelectedNodes([]);
  };

  /** 删除自动组事件 */
  const handleRemoveGroup = () => {
    if (
      selectedNodes.length !== 1 ||
      !GROUP_NAMES.includes(first(selectedNodes)!.type!)
    )
      return;

    const groupId = selectedNodes[0].id;

    setNodes((nodes) =>
      nodes
        .map((node) => {
          if (node.parentId === groupId) {
            const x = node.position.x + selectedNodes[0].position.x;
            const y = node.position.y + selectedNodes[0].position.y;
            return {
              ...node,
              parentId: undefined,
              extent: undefined,
              position: { x, y },
            };
          }
          return node;
        })
        .filter((node) => node.id !== groupId),
    );
    onChangeSelectedNodes([]);
  };

  /** 粘贴事件 */
  const handlePaste = () => {
    // 如果没有选中任何元素，直接返回
    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      return;
    }

    // 获取当前所有节点用于生成新ID
    const currentNodes = getNodes();

    // 创建旧节点ID到新节点ID的映射
    const nodeIdMap = selectedNodes.reduce(
      (acc, node, index) => {
        acc[node.id] = getNodeIdUtil(() => currentNodes, index);
        return acc;
      },
      {} as Record<string, string>,
    );

    // 生成新节点
    const newNodes = selectedNodes.map((node) => ({
      ...node,
      id: nodeIdMap[node.id],
      position: {
        x: node.position.x + OFFSET,
        y: node.position.y + OFFSET,
      },
      selected: true,
    }));

    // 生成新边
    const newEdges = selectedEdges.map((edge) => {
      const { source, target, sourceHandle, targetHandle, data } = edge;
      const newSource = nodeIdMap[source];
      const newTarget = nodeIdMap[target];
      const id = [newSource, sourceHandle, newTarget, targetHandle]
        .filter(Boolean)
        .join('->');

      let newVertices = undefined;
      if (data?.vertices) {
        newVertices = data?.vertices?.map((vertex) => ({
          x: vertex.x + OFFSET,
          y: vertex.y + OFFSET,
        }));
      }

      return {
        ...edge,
        id,
        source: newSource || source,
        target: newTarget || target,
        sourceHandle,
        targetHandle,
        selected: true,
        data: { ...data, vertices: newVertices },
      };
    });

    // 更新状态（单次批量更新）
    setNodes((prevNodes) => [
      ...prevNodes.map((node) =>
        selectedNodes.some((n) => n.id === node.id)
          ? { ...node, selected: false }
          : node,
      ),
      ...newNodes,
    ]);

    setEdges((prevEdges) => [
      ...prevEdges.map((edge) =>
        selectedEdges.some((e) => e.id === edge.id)
          ? { ...edge, selected: false }
          : edge,
      ),
      ...newEdges,
    ]);
  };

  /** 导航栏按钮配置 */
  const navItems = [
    {
      key: 'create-group',
      label: '创建组',
      disabled: selectedNodes.length < 2,
      onClick: handleCreateGroup,
    },
    {
      key: 'remove-group',
      label: '删除组',
      disabled:
        selectedNodes.length !== 1 ||
        !GROUP_NAMES.includes(first(selectedNodes)!.type!),
      onClick: handleRemoveGroup,
    },
    {
      key: 'paste',
      label: '粘贴',
      disabled: selectedNodes.length === 0,
      onClick: handlePaste,
    },
  ];

  return (
    <Panel position="top-center">
      <Space>
        {navItems?.map((item) => {
          const { key, label, disabled, onClick } = item;
          return (
            <Button
              key={key}
              type="primary"
              disabled={disabled}
              onClick={onClick}
            >
              {label}
            </Button>
          );
        })}
      </Space>
    </Panel>
  );
};

export default memo(CustomTopNavigation);
