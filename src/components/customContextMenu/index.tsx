import useNodeConfig from '@/hooks/useNodeConfig';
import { useReactFlow } from '@xyflow/react';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';

const menuItem = [
  { key: 'detail', label: '详情' },
  { key: 'delete', label: '删除' },
];

/** 自定义右键菜单 */
const CustomContextMenu = ({ id, top, left, right, bottom, ...props }: any) => {
  /** react-flow 实例方法 */
  const { setNodes, setEdges } = useReactFlow();

  /** 节点配置 */
  const { onChangeModalId } = useNodeConfig(
    useShallow((state) => ({
      onChangeModalId: state.onChangeModalId,
    })),
  );

  /** 详情事件 */
  const handleClick = (item) => {
    switch (item.key) {
      case 'detail':
        onChangeModalId?.(id); // 显示弹框
        break;
      case 'delete':
        // 删除节点
        setNodes((nds) => nds.filter((node) => node.id !== id));
        // 删除边
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== id && edge.target !== id),
        );
        onChangeModalId?.(''); // 隐藏弹框
        break;
      default:
        break;
    }
  };

  return (
    <div
      style={{ top, left }}
      className="absolute z-10 rounded border-1 bg-white text-sm shadow"
      {...props}
    >
      {menuItem.map((item) => {
        return (
          <div
            key={item.key}
            className="cursor-pointer px-2 py-1 hover:bg-gray-100"
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
