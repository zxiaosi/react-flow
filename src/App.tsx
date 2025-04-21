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

function App(props: ReactFlowProps) {
  return (
    <div className="h-full w-full">
      <ReactFlow proOptions={{ hideAttribution: true }} {...props}>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
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
