import { create } from 'zustand';

interface Props {
  /** 拖拽节点数据 */
  drageNodeData?: any;
  /** 拖拽节点数据事件 */
  onDrageNodeData?: (data: any) => void;
}

/** 节点配置 */
const useNodeConfig = create<Props>((set) => ({
  drageNodeData: null,
  onDrageNodeData: (nodeData) => set(() => ({ drageNodeData: nodeData })),
}));

export default useNodeConfig;
