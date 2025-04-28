import { create } from 'zustand';

interface Props {
  /** 拖拽节点数据 */
  drageNodeData?: any;
  /** 拖拽节点数据事件 */
  onDrageNodeData?: (data: any) => void;
  /** 显示弹框id */
  modalId?: string;
  /** 显示/隐藏弹框切换事件 */
  onChangeModalId?: (id: string) => void;
}

/** 节点配置 */
const useNodeConfig = create<Props>((set) => ({
  modalId: '',
  onChangeModalId: (id) => {
    set(() => ({ modalId: id }));
  },
  drageNodeData: null,
  onDrageNodeData: (nodeData) => {
    set(() => ({ drageNodeData: nodeData }));
  },
}));

export default useNodeConfig;
