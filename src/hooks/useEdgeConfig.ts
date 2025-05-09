import { create } from 'zustand';

interface Props {
  /** 是否开启动画 */
  animated?: boolean;
  /** 切换开启动画事件 */
  onChangeAnimated?: () => void;
  /** 连接线类型 */
  edgeType?: string;
  /** 切换连接线类型事件 */
  onChangeEdgeType: (edgeType: string) => void;
}

/** 连接线配置 */
const useEdgeConfig = create<Props>((set) => ({
  animated: false,
  onChangeAnimated: () => set((state) => ({ animated: !state.animated })),
  edgeType: 'default',
  onChangeEdgeType: (edgeType) => set(() => ({ edgeType })),
}));

export default useEdgeConfig;
