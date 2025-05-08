import useRightSideBarConfig from '@/hooks/useRightSideBarConfig';
import { useReactFlow } from '@xyflow/react';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import './index.less';

type Props = ContextMenu & { onClick: () => void };

/** 右键菜单配置 */
const menuItemsMap = {
  node: [
    { key: 'node-detail', label: '详情' },
    { key: 'node-delete', label: '删除' },
  ],
  edge: [
    { key: 'edge-detail', label: '详情' },
    { key: 'edge-delete', label: '删除' },
  ],
};

/** 自定义右键菜单 */
const CustomContextMenu = (props: Props) => {
  const { id, type, top, left, right, bottom, onClick } = props;

  const { setNodes, setEdges } = useReactFlow();

  /** 节点配置 */
  const { onChangeRecord } = useRightSideBarConfig(
    useShallow((state) => ({
      onChangeRecord: state.onChangeRecord,
    })),
  );

  /** 详情事件 */
  const handleClick = (key: string) => {
    switch (key) {
      case 'node-detail':
      case 'edge-detail':
        onChangeRecord?.({ id, type }); // 显示弹框
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
      {menuItemsMap[type]?.map((item) => {
        return (
          <div
            key={item.key}
            className="custom-context-menu-item"
            onClick={() => handleClick(item.key)}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

export default memo(CustomContextMenu);
