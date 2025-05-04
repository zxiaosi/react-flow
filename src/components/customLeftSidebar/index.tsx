import useNodeConfig from '@/hooks/useNodeConfig';
import { Panel } from '@xyflow/react';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import CustomEdgeMenu from './CustomEdgeMenu';
import CustomLayoutMenu from './CustomLayoutMenu';
import CustomNodeMenu from './CustomNodeMenu';
import CustomProjectMenu from './CustomProjectMenu';

/** 自定义左侧侧边栏 */
const customLeftSidebar = ({ onClick }) => {
  /** 节点配置 */
  const { onChangeModalId } = useNodeConfig(
    useShallow((state) => ({
      onChangeModalId: state.onChangeModalId,
    })),
  );

  /** 点击事件 */
  const handleClick = (item: any) => {
    onChangeModalId?.(''); // 清空弹框id
    onClick?.();
  };

  return (
    <>
      <Panel position="top-left">
        <div
          className="border-1 grid w-[180px] gap-4 rounded border-gray-200 bg-white p-3 shadow"
          onClick={handleClick}
        >
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
    </>
  );
};
export default memo(customLeftSidebar);
