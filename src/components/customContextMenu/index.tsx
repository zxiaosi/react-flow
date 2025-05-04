import useRightSideBarConfig from '@/hooks/useRightSideBarConfig';
import { useReactFlow } from '@xyflow/react';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import './index.less';

const menuItem = [
  { key: 'detail', label: '详情' },
  { key: 'delete', label: '删除' },
];

/** 自定义右键菜单 */
const CustomContextMenu = ({ id, top, left, right, bottom, ...props }: any) => {
  /** react-flow 实例方法 */
  const { setNodes, setEdges } = useReactFlow();

  /** 节点配置 */
  const { onChangeRecord } = useRightSideBarConfig(
    useShallow((state) => ({
      onChangeRecord: state.onChangeRecord,
    })),
  );

  /** 详情事件 */
  const handleClick = (item) => {
    switch (item.key) {
      case 'detail':
        onChangeRecord?.(id); // 显示弹框
        break;
      case 'delete':
        // 删除节点
        setNodes((nds) => nds.filter((node) => node.id !== id));
        // 删除边
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== id && edge.target !== id),
        );
        onChangeRecord?.(undefined); // 隐藏弹框
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ top, left }} className="custom-context-menu" {...props}>
      {menuItem.map((item) => {
        return (
          <div
            key={item.key}
            className="custom-context-menu-item"
            onClick={() => handleClick(item)}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

export default memo(CustomContextMenu);
