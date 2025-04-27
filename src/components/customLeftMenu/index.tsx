import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useNodeConfig from '@/hooks/useNodeConfig';
import useProjectConfig from '@/hooks/useProjectConfig';
import { Panel, useReactFlow } from '@xyflow/react';
import { useShallow } from 'zustand/shallow';

/** 自定义左侧菜单 */
const CustomLeftMenu = () => {
  /** react-flow 实例方法 */
  const { fitView, getEdges, getNodes } = useReactFlow();

  /** 项目配置 */
  const { showBg, onChangeShowBg, theme, onChangeTheme } = useProjectConfig(
    useShallow((state) => ({
      showBg: state.showBg,
      onChangeShowBg: state.onChangeShowBg,
      theme: state.theme,
      onChangeTheme: state.onChangeTheme,
    })),
  );

  /** 节点配置 */
  const { onDrageNodeData } = useNodeConfig(
    useShallow((state) => ({ onDrageNodeData: state.onDrageNodeData })),
  );

  /** 菜单数据 */
  const menuItems = [
    {
      name: 'project',
      label: '项目',
      children: [
        {
          name: 'theme',
          label: '主题',
          icon: theme === 'light' ? '&#xe611;' : '&#xe634;',
        },
        { name: 'background', label: '背景', icon: '&#xe661;' },
        { name: 'fitView', label: '铺满', icon: '&#xe6f0;' },
        { name: 'export', label: '导出', icon: '&#xe60f;' },
      ],
    },
    {
      name: 'layput',
      label: '布局',
      children: [
        {
          name: 'algorithm',
          type: 'select',
          options: [
            { label: 'Dagre', value: 'dagre' },
            { label: 'Elkjs', value: 'elkjs' },
          ],
        },
        { name: 'horizontal', label: '水平', icon: '&#xe601;' },
        { name: 'vertical', label: '垂直', icon: '&#xe602;' },
      ],
    },
    {
      name: 'node',
      label: '节点',
      children: [
        { name: 'default', label: '默认', icon: '&#xe652;' },
        { name: 'group', label: '组', icon: '&#xe9b3;' },
        { name: 'square', label: '正方形', icon: '&#xe600;' },
        { name: 'lozenge', label: '菱形', icon: '&#xe636;' },
      ],
    },
  ];

  /** 菜单点击事件 */
  const handleClick = (item) => {
    if (item.name === 'node') return;

    switch (item.name) {
      case 'theme':
        onChangeTheme?.();
        break;
      case 'background':
        onChangeShowBg?.();
        break;
      case 'fitView':
        fitView();
        break;
      case 'export': {
        const nodes = getNodes();
        const edges = getEdges();
        console.log(nodes, edges);
        break;
      }
      case 'horizontal':
        console.log('horizontal');
        break;
      case 'vertical':
        console.log('vertical');
        break;
      case 'default':
        break;
    }
  };

  /** 菜单拖拽开始事件 */
  const handleDragStart = (e, item, child) => {
    if (item.name !== 'node') return;
    onDrageNodeData?.(child);
  };

  return (
    <Panel position="top-left">
      <div className="grid w-[200px] gap-4 rounded border-1 border-gray-200 bg-white p-3 shadow">
        {menuItems.map((item) => (
          <div key={item.name}>
            <div className="mb-2 text-sm font-bold">{item.label}</div>
            <div className="flex flex-wrap gap-2">
              {item.children.map((child) => {
                return child?.type === 'select' ? (
                  <Select
                    key={child.name}
                    defaultValue={child?.options?.[0]?.value}
                  >
                    <SelectTrigger className="w-[86px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {child.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div
                    key={child.name}
                    className={`h-[36px] w-[36px] rounded bg-gray-100 text-gray-600 caret-transparent hover:bg-gray-200 ${item.name === 'node' ? 'cursor-move' : 'cursor-pointer'} `}
                    draggable={item.name === 'node'}
                    onClick={() => handleClick(child)}
                    onDragStart={(e) => handleDragStart(e, item, child)}
                  >
                    <span
                      title={child.label}
                      className={`iconfont flex h-full w-full items-center justify-center ${!showBg && child.name === 'background' ? 'text-gray-300' : ''}`}
                      dangerouslySetInnerHTML={{ __html: child.icon }}
                    ></span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};
export default CustomLeftMenu;
