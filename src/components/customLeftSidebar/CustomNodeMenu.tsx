import useNodeConfig from '@/hooks/useNodeConfig';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';

/** 菜单数据 */
const menuItems = [
  {
    name: 'node',
    label: '节点',
    children: [
      { name: 'default', label: '默认节点', icon: '&#xe652;' },
      { name: 'group', label: '默认节点组', icon: '&#xe631;' },
      { name: 'customNode', label: '自定义节点', icon: '&#xe603;' },
      { name: 'customGroup', label: '自定义节点组', icon: '&#xe9b3;' },
    ],
  },
];

/** 左侧菜单-节点 */
const CustomNodeMenu = () => {
  /** 节点配置 */
  const { onDrageNodeData } = useNodeConfig(
    useShallow((state) => ({
      onDrageNodeData: state.onDrageNodeData,
    })),
  );

  /** 菜单拖拽开始事件 */
  const handleDragStart = (e, child) => {
    onDrageNodeData?.(child);
  };

  return (
    <>
      {menuItems.map((item) => (
        <div key={item.name}>
          <div className="mb-2 text-center text-sm font-bold">{item.label}</div>
          <div className="flex flex-wrap gap-2">
            {item.children.map((child: any) => {
              const { name, label, icon } = child;
              return (
                <div
                  key={name}
                  className={`h-[33px] w-[33px] cursor-move rounded bg-gray-100 caret-transparent hover:bg-gray-200`}
                  draggable={item.name === 'node'}
                  onDragStart={(e) => handleDragStart(e, child)}
                >
                  <span
                    title={label}
                    className={`iconfont flex h-full w-full items-center justify-center`}
                    dangerouslySetInnerHTML={{ __html: icon || '' }}
                  ></span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default memo(CustomNodeMenu);
