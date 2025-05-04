import { ALGORITHM_TYPE } from '@/global';
import useLayoutConfig from '@/hooks/useLayoutConfig';
import { getLayoutedElementsUtil } from '@/utils';
import { useReactFlow } from '@xyflow/react';
import { Select } from 'antd';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import './index.less';

/** 菜单数据 */
const menuItems = [
  {
    name: 'layput',
    label: '布局',
    children: [
      { name: 'algorithm', type: 'select', options: ALGORITHM_TYPE },
      { name: 'horizontal', label: '水平', icon: '&#xe601;' },
      { name: 'vertical', label: '垂直', icon: '&#xe602;' },
    ],
  },
];

/** 左侧菜单-布局 */
const CustomLayoutMenu = () => {
  const { fitView, setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const { algorithm, onChangeAlgorithm, onChangeDirection } = useLayoutConfig(
    useShallow((state) => ({
      algorithm: state.algorithm,
      onChangeAlgorithm: state.onChangeAlgorithm,
      onChangeDirection: state.onChangeDirection,
    })),
  );

  /** 算法选择事件 */
  const handleChangeAlgorithm = (value: string) => {
    onChangeAlgorithm?.(value);
    onChangeDirection?.(undefined);
  };

  /** 方向点击事件 */
  const handleClick = (item) => {
    switch (item.name) {
      case 'horizontal':
      case 'vertical': {
        const nodes = getNodes();
        const edges = getEdges();
        const direction = item.name === 'horizontal' ? 'LR' : 'TB';

        const { nodes: layoutNodes, edges: layoutEdges } =
          getLayoutedElementsUtil(nodes, edges, direction);

        setNodes(layoutNodes);
        setEdges(layoutEdges);
        fitView();
        onChangeDirection?.(direction);
        break;
      }
      case 'default':
        break;
    }
  };

  return (
    <div className="custom-layout-menu">
      {menuItems.map((item) => (
        <div key={item.name}>
          <div className="custom-left-menu-title">{item.label}</div>
          <div className="custom-left-menu-content">
            {item.children.map((child: any) => {
              const { name, label, icon, type = '', options = [] } = child;
              return type === 'select' ? (
                <Select
                  key={name}
                  options={options}
                  value={algorithm}
                  onChange={handleChangeAlgorithm}
                  className="custom-left-menu-content-select"
                />
              ) : (
                <div
                  key={name}
                  className={`custom-left-menu-content-item`}
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

export default memo(CustomLayoutMenu);
