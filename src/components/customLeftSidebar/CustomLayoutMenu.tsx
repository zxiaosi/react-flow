import { ALGORITHM_TYPE } from '@/global';
import useLayoutConfig from '@/hooks/useLayoutConfig';
import { getLayoutedElementsUtil } from '@/utils';
import { useReactFlow } from '@xyflow/react';
import { InputNumber, Select } from 'antd';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import './index.less';

/** 左侧菜单-布局 */
const CustomLayoutMenu = () => {
  const { fitView, setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const {
    algorithm,
    onChangeAlgorithm,
    rankdir,
    onChangeRankDir,
    ranksep,
    onChangeRanksep,
    nodesep,
    onChangeNodesep,
  } = useLayoutConfig(
    useShallow((state) => ({
      algorithm: state.algorithm,
      onChangeAlgorithm: state.onChangeAlgorithm,
      rankdir: state.rankdir,
      onChangeRankDir: state.onChangeRankDir,
      ranksep: state.ranksep,
      onChangeRanksep: state.onChangeRanksep,
      nodesep: state.nodesep,
      onChangeNodesep: state.onChangeNodesep,
    })),
  );

  /** 菜单数据 */
  const menuItems = [
    {
      name: 'layput',
      label: '布局',
      children: [
        {
          name: 'algorithm',
          type: 'select',
          options: ALGORITHM_TYPE,
          value: ALGORITHM_TYPE[0].value,
        },
        { name: 'horizontal', label: '水平', icon: '&#xe601;' },
        { name: 'vertical', label: '垂直', icon: '&#xe602;' },
        { name: 'ranksep', label: '层级间距', type: 'number', value: ranksep },
        { name: 'nodesep', label: '节点间距', type: 'number', value: nodesep },
      ],
    },
  ] satisfies MenuItems[];

  /** 重新布局方法 */
  const handleReLayout = ({ rankdir, ranksep, nodesep }: any) => {
    const nodes = getNodes();
    const edges = getEdges();

    const { nodes: layoutNodes, edges: layoutEdges } = getLayoutedElementsUtil(
      nodes,
      edges,
      rankdir,
      ranksep,
      nodesep,
    );

    setNodes(layoutNodes);
    setEdges(layoutEdges);
    fitView();
  };

  /** 点击事件 */
  const handleClick = (item: MenuItems) => {
    const { name } = item;

    switch (name) {
      case 'horizontal':
      case 'vertical': {
        const newRankdir = name === 'horizontal' ? 'LR' : 'TB';
        handleReLayout({ rankdir: newRankdir, ranksep, nodesep });
        onChangeRankDir?.(newRankdir);
        break;
      }
      case 'default':
        break;
    }
  };

  /** 改变事件 */
  const handleChange = (value: any, item: MenuItems) => {
    switch (item.name) {
      case 'algorithm':
        onChangeAlgorithm?.(value);
        onChangeRankDir?.(undefined);
        break;
      case 'ranksep':
        onChangeRanksep?.(value);
        handleReLayout({ rankdir, ranksep: value, nodesep });
        break;
      case 'nodesep':
        onChangeNodesep?.(value);
        handleReLayout({ rankdir, ranksep, nodesep: value });
        break;
    }
  };

  return (
    <div className="custom-layout-menu">
      {menuItems.map((item) => (
        <div key={item.name}>
          <div className="custom-left-menu-title">{item.label}</div>
          <div className="custom-left-menu-content">
            {item.children.map((child: MenuItems) => {
              const {
                name,
                label,
                value,
                icon,
                type = '',
                options = [],
              } = child;

              switch (type) {
                case 'select':
                  return (
                    <Select
                      key={name}
                      options={options}
                      value={value}
                      onChange={(e) => handleChange(e, child)}
                      className="custom-left-menu-content-select"
                    />
                  );
                case 'number':
                  return (
                    <div key={name} className="custom-left-menu-content-number">
                      <span>{label}</span>
                      <InputNumber
                        value={value}
                        changeOnWheel={true}
                        onChange={(e) => handleChange(e, child)}
                      />
                    </div>
                  );
                default:
                  return (
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
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(CustomLayoutMenu);
