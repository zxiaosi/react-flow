import useNodeConfig from '@/hooks/useNodeConfig';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import './index.less';

/** 菜单数据 */
const menuItems = [
  {
    name: 'node',
    label: '节点',
    children: [
      { name: 'default', label: '默认节点', icon: '&#xe652;' },
      { name: 'group', label: '默认节点组', icon: '&#xe631;' },
      { name: 'customNode', label: '自定义节点', icon: '&#xe603;' },
      { name: 'customGroupNode', label: '自定义节点组', icon: '&#xe9b3;' },
    ],
  },
] satisfies MenuItems[];

/** 左侧菜单-节点 */
const CustomNodeMenu = () => {
  /** 节点配置 */
  const { onDrageNodeData } = useNodeConfig(
    useShallow((state) => ({
      onDrageNodeData: state.onDrageNodeData,
    })),
  );

  /** 节点拖拽开始事件 */
  const handleDragStart = (event: React.DragEvent, child: MenuItems) => {
    onDrageNodeData?.(child);
  };

  return (
    <div className="custom-node-menu">
      {menuItems.map((item) => (
        <div key={item.name}>
          <div className="custom-left-menu-title">{item.label}</div>
          <div className="custom-left-menu-content">
            {item.children.map((child: MenuItems) => {
              const { name, label, icon } = child;
              return (
                <div
                  key={name}
                  draggable
                  className={`custom-left-menu-content-item`}
                  onDragStart={(e) => handleDragStart(e, child)}
                >
                  <span
                    title={label}
                    className={`iconfont`}
                    dangerouslySetInnerHTML={{ __html: icon || '' }}
                  ></span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(CustomNodeMenu);
