import { Panel } from '@xyflow/react';
import { memo } from 'react';
import CustomEdgeMenu from './CustomEdgeMenu';
import CustomLayoutMenu from './CustomLayoutMenu';
import CustomNodeMenu from './CustomNodeMenu';
import CustomProjectMenu from './CustomProjectMenu';
import './index.less';

interface Props {
  /** 点击事件 */
  onClick: () => void;
}

/** 自定义左侧侧边栏 */
const CustomLeftSidebar = ({ onClick }: Props) => {
  return (
    <Panel position="top-left">
      <div className="custom-left-sidebar" onClick={onClick}>
        {/* 项目菜单 */}
        <CustomProjectMenu />

        {/* 布局菜单 */}
        <CustomLayoutMenu />

        {/* 连接线菜单 */}
        <CustomEdgeMenu />

        {/* 节点菜单 */}
        <CustomNodeMenu />
      </div>
    </Panel>
  );
};
export default memo(CustomLeftSidebar);
