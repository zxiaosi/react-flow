import useNodeConfig from '@/hooks/useNodeConfig';
import { useShallow } from 'zustand/shallow';

const menuItem = [
  { key: 'detail', label: '详情' },
  { key: 'delete', label: '删除' },
];

/** 自定义右键菜单 */
const CustomContextMenu = ({ id, top, left, right, bottom, ...props }: any) => {
  /** 节点配置 */
  const { onChangeShowModal } = useNodeConfig(
    useShallow((state) => ({
      onChangeShowModal: state.onChangeShowModal,
    })),
  );

  /** 详情事件 */
  const handleClick = (e: React.MouseEvent) => {
    onChangeShowModal?.(true); // 显示弹框
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
            onClick={handleClick}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

export default CustomContextMenu;
