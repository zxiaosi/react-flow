import { create } from 'zustand';

type Direction = 'TB' | 'LR' | undefined;

interface Props {
  /** 算法 */
  algorithm?: string;
  /** 切换算法事件 */
  onChangeAlgorithm?: (algorithm: string) => void;
  /** 方向 */
  direction?: Direction;
  /** 切换方向事件 */
  onChangeDirection?: (direction: Direction) => void;
}

/** 布局配置 */
const useLayoutConfig = create<Props>((set) => ({
  algorithm: 'dagre',
  onChangeAlgorithm: (algorithm: string) => {
    set(() => ({ algorithm }));
  },
  direction: undefined,
  onChangeDirection: (direction: Direction) => {
    set(() => ({ direction }));
  },
}));

export default useLayoutConfig;
