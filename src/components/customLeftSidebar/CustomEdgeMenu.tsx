import useEdgeConfig from '@/hooks/useEdgeConfig';
import { useReactFlow } from '@xyflow/react';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import './index.less';

/** 菜单数据 */
const menuItems = [
  {
    name: 'edge',
    label: '连接线',
    children: [
      { name: 'animation', label: '动画', icon: '&#xe831;' },
      { name: 'default', label: '贝塞尔线', icon: '&#xe6a9;' },
      { name: 'straight', label: '直线', icon: '&#xe6bb;' },
      { name: 'step', label: '折线', icon: '&#xe66d;' },
      { name: 'smoothstep', label: '平滑折线', icon: '&#xec36;' },
      { name: 'customEdge', label: '自定义', icon: '&#xe604;' },
    ],
  },
] satisfies MenuItems[];

/** 左侧菜单-连接线 */
const CustomEdgeMenu = () => {
  const { setEdges } = useReactFlow();

  /** 连接线配置 */
  const { animated, onChangeAnimated, edgeType, onChangeEdgeType } =
    useEdgeConfig(
      useShallow((state) => ({
        animated: state.animated,
        onChangeAnimated: state.onChangeAnimated,
        edgeType: state.edgeType,
        onChangeEdgeType: state.onChangeEdgeType,
      })),
    );

  /** 点击事件 */
  const handleClick = (item: MenuItems) => {
    const { name } = item;

    switch (name) {
      case 'animation':
        setEdges((edges) => {
          return edges?.map((edge) => ({ ...edge, animated: !animated }));
        });
        onChangeAnimated?.();
        break;
      case 'default':
      case 'straight':
      case 'step':
      case 'smoothstep':
      case 'customEdge':
        setEdges((edges) => {
          return edges?.map((edge) => ({ ...edge, type: name }));
        });
        onChangeEdgeType?.(name);
        break;
      default:
        break;
    }
  };

  return (
    <div className="custom-edge-menu">
      {menuItems.map((item) => (
        <div key={item.name}>
          <div className="custom-left-menu-title">{item.label}</div>
          <div className="custom-left-menu-content">
            {item.children.map((child: MenuItems) => {
              const { name, label, icon } = child;
              return (
                <div
                  key={name}
                  className={`custom-left-menu-content-item`}
                  style={{
                    opacity:
                      name === 'animation' || edgeType === name ? 1 : 0.5,
                  }}
                  onClick={() => handleClick(child)}
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

export default memo(CustomEdgeMenu);
