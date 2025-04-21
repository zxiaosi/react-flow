import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProps,
  ReactFlowProvider,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css'; // 引入样式
import { CustomMenu } from './components';

function App(props: ReactFlowProps) {
  return (
    <div className="h-full w-full">
      <ReactFlow proOptions={{ hideAttribution: true }} {...props}>
        {/* 控制按钮 */}
        <Controls />

        {/* 小地图 */}
        <MiniMap />

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
