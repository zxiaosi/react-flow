import useRightSideBarConfig from '@/hooks/useRightSideBarConfig';
import { Panel } from '@xyflow/react';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import CustomEdgeMenu from './CustomEdgeMenu';
import CustomLayoutMenu from './CustomLayoutMenu';
import CustomNodeMenu from './CustomNodeMenu';
import CustomProjectMenu from './CustomProjectMenu';
import './index.less';

/** 自定义左侧侧边栏 */
const CustomLeftSidebar = ({ onClick }) => {
  /** 节点配置 */
  const { onChangeRecord } = useRightSideBarConfig(
    useShallow((state) => ({
      onChangeRecord: state.onChangeRecord,
    })),
  );

  /** 点击事件 */
  const handleClick = (item: any) => {
    onChangeRecord?.(undefined); // 清空弹框id
    onClick?.();
  };

  return (
    <Panel position="top-left">
      <div className="custom-left-sidebar" onClick={handleClick}>
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
