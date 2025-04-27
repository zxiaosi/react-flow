import { create } from 'zustand';

interface Props {
  /** 拖拽节点数据 */
  drageNodeData?: any;
  /** 拖拽节点数据事件 */
  onDrageNodeData?: (data: any) => void;
  /** 是否显示弹框 */
  showModal?: boolean;
  /** 显示/隐藏弹框切换事件 */
  onChangeShowModal?: (show: boolean) => void;
}

/** 节点配置 */
const useNodeConfig = create<Props>((set) => ({
  showModal: false,
  onChangeShowModal: (show) => {
    set(() => ({ showModal: show }));
  },
  drageNodeData: null,
  onDrageNodeData: (nodeData) => {
    set(() => ({ drageNodeData: nodeData }));
  },
}));

export default useNodeConfig;
