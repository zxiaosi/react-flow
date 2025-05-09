import { GROUP_NAMES } from '@/global';
import useRightSideBarConfig from '@/hooks/useRightSideBarConfig';
import { useReactFlow } from '@xyflow/react';
import { Button } from 'antd';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import './index.less';

type Props = ContextMenu & { onClick: () => void };

/** 自定义右键菜单 */
const CustomContextMenu = (props: Props) => {
  const { id, type, top, left, right, bottom, nodeOrEdge, onClick } = props;

  console.log('props', props);

  const { setNodes, setEdges } = useReactFlow();

  /** 节点配置 */
  const { onChangeRecord } = useRightSideBarConfig(
    useShallow((state) => ({
      onChangeRecord: state.onChangeRecord,
    })),
  );

  /** 右键菜单配置 */
  const menuItemsMap = {
    node: [
      { key: 'node-detail', label: '详情', disabled: false },
      {
        key: 'node-delete',
        label: '删除',
        disabled: GROUP_NAMES.includes(type),
      },
    ],
    edge: [
      { key: 'edge-detail', label: '详情', disabled: false },
      { key: 'edge-delete', label: '删除', disabled: false },
    ],
  };

  /** 详情事件 */
  const handleClick = (key: string) => {
    switch (key) {
      case 'node-detail':
      case 'edge-detail':
        onChangeRecord?.({ id, type: nodeOrEdge }); // 显示弹框
        break;
      case 'node-delete': {
        setNodes((nds) => nds.filter((node) => node.id !== id)); // 删除节点

        setEdges((eds) =>
          eds.filter(
            ({ source, target, sourceHandle, targetHandle }) =>
              ![source, target, sourceHandle, targetHandle].includes(id),
          ),
        ); // 删除边

        onChangeRecord?.(undefined); // 隐藏弹框
        break;
      }
      case 'edge-delete':
        setEdges((eds) => eds.filter((edge) => edge.id !== id)); // 删除边

        onChangeRecord?.(undefined); // 隐藏弹框
        break;
      default:
        break;
    }
  };

  return (
    <div
      style={{ top, left, right, bottom }}
      className="custom-context-menu"
      onClick={onClick}
    >
      {menuItemsMap[nodeOrEdge]?.map((item) => {
        return (
          <Button
            key={item.key}
            type="text"
            className="custom-context-menu-item"
            onClick={() => handleClick(item.key)}
            disabled={item.disabled}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};

export default memo(CustomContextMenu);
