import { GROUP_NAMES } from '@/global';
import useSelectNodeEdge from '@/hooks/useSelectNodeEdge';
import { calculateGroupBoundsUtil, compareArraysUtil } from '@/utils';
import { Node, Panel, useReactFlow } from '@xyflow/react';
import { Button, Space } from 'antd';
import { first } from 'lodash';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';

/** 自定义顶部导航栏组件 */
const CustomTopNavigation = () => {
  const { setNodes, getNodes } = useReactFlow();

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
