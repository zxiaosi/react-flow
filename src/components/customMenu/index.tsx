import { Panel } from '@xyflow/react';

/** 菜单数据 */
const menuItems = [
  {
    name: 'project',
    label: '项目',
    children: [
      { name: 'theme', label: '主题' },
      { name: 'background', label: '背景' },
      { name: 'fitView', label: '铺满' },
      { name: 'export', label: '导出' },
    ],
  },
  {
    name: 'layput',
    label: '布局',
    children: [
      { name: 'horizontal layout', label: '水平布局' },
      { name: 'vertical layout', label: '垂直布局' },
      { name: 'layoutType', label: '布局类型' },
    ],
  },
  {
    name: 'node',
    label: '节点',
  },
];

/** 自定义菜单组件 */
const CustomMenu = () => {
  return (
    <Panel position="top-left">
      <div className="w-[200px] rounded bg-white p-3 shadow">
        <h1>Custom Menu</h1>
      </div>
    </Panel>
  );
};
export default CustomMenu;
