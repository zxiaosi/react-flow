import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProps,
  ReactFlowProvider,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css'; // 引入样式
import { CustomMenu } from './components';

/**
 * 老版本谷歌浏览器的兼容性问题
 * - 遇到 fitView() 方法不生效问题, 可以选择降版本处理, 可以试试v12.4.4版本
 */
function App(props: ReactFlowProps) {
  return (
    <div className="h-full w-full">
      <ReactFlow proOptions={{ hideAttribution: true }} {...props}>
        {/* 背景 */}
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

        {/* 自定义菜单 */}
        <CustomMenu />
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
