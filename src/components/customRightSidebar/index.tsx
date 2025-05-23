import useRightSideBarConfig from '@/hooks/useRightSideBarConfig';
import { Panel } from '@xyflow/react';
import { useShallow } from 'zustand/shallow';
import CustomEdgeDetail from './CustomEdgeDetail';
import CustomNodeDetail from './CustomNodeDetail';
import './index.less';

interface Props {
  /** 点击事件 */
  onClick: () => void;
}

/** 自定义右侧侧边栏 */
const CustomRightSidebar = ({ onClick }: Props) => {
  const { record } = useRightSideBarConfig(
    useShallow((state) => ({
      record: state.record,
    })),
  );

  if (!record) return null;

  const { id, type } = record;

  return (
    <Panel position="top-right">
      <div className="custom-right-sidebar" onClick={onClick}>
        <div className="custom-right-sidebar-title">
          {type === 'node' ? '节点' : '连接线'}
        </div>

        {type === 'node' && <CustomNodeDetail nodeId={id + ''} />}

        {type === 'edge' && <CustomEdgeDetail edgeId={id + ''} />}
      </div>
    </Panel>
  );
};

export default CustomRightSidebar;
