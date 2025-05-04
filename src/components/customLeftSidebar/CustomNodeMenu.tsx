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
    <div className="custom-node-menu">
      {menuItems.map((item) => (
        <div key={item.name}>
          <div className="custom-left-menu-title">{item.label}</div>
          <div className="custom-left-menu-content">
            {item.children.map((child: any) => {
              const { name, label, icon } = child;
              return (
                <div
                  draggable
                  key={name}
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
