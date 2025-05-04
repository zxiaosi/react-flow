import useEdgeConfig from '@/hooks/useEdgeConfig';
import { useReactFlow } from '@xyflow/react';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';

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
];

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
  const handleClick = (item) => {
    switch (item.name) {
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
          return edges?.map((edge) => ({ ...edge, type: item.name }));
        });
        onChangeEdgeType?.(item.name);
        break;
      default:
        break;
    }
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
                  className={`h-[33px] w-[33px] cursor-pointer rounded bg-gray-100 caret-transparent hover:bg-gray-200`}
                  draggable={item.name === 'node'}
                  onClick={() => handleClick(child)}
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

export default memo(CustomEdgeMenu);
