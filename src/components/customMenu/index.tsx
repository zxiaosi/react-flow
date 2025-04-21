import { Panel } from '@xyflow/react';

/** 自定义菜单组件 */
const CustomMenu = () => {
  return (
    <Panel position="top-right">
      <div className="w-[200px] rounded bg-white p-3 shadow">
        <h1>Custom Menu</h1>
      </div>
    </Panel>
  );
};
export default CustomMenu;
