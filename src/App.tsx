import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProps,
  ReactFlowProvider,
} from '@xyflow/react';

import { CustomLeftMenu, CustomRightConfig } from '@/components';
import useNodeConfig from '@/hooks/useNodeConfig';
import useProjectConfig from '@/hooks/useProjectConfig';
import { useShallow } from 'zustand/shallow';

import '@xyflow/react/dist/style.css'; // 引入样式

/**
 * 老版本谷歌浏览器的兼容性问题
 * - 遇到 fitView() 方法不生效问题, 可以选择降版本处理, 可以试试v12.4.4版本
 */
function App(props: ReactFlowProps) {
  const { showBg } = useProjectConfig(
    useShallow((state) => ({
      showBg: state.showBg,
    })),
  );

  const { drageNodeData, showModal } = useNodeConfig(
    useShallow((state) => ({
      drageNodeData: state.drageNodeData,
      showModal: state.showModal,
    })),
  );

  return (
    <div className="h-full w-full">
      <ReactFlow proOptions={{ hideAttribution: true }} {...props}>
        {/* 背景 */}
        {showBg && (
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        )}

        {/* 自定义左侧菜单 */}
        <CustomLeftMenu />

        {/* 自定义右侧配置 */}
        {showModal && <CustomRightConfig />}
      </ReactFlow>
    </div>
  );
}

/** App Provider */
const AppProvider = (props: ReactFlowProps) => {
  return (
    <ReactFlowProvider>
      <App {...props} />
    </ReactFlowProvider>
  );
};

export default AppProvider;
