import { NODE_SEP, RANK_SEP } from '@/global';
import { create } from 'zustand';

type Direction = 'TB' | 'BT' | 'LR' | 'RL' | undefined;

interface Props {
  /** 算法 */
  algorithm?: string;
  /** 切换算法事件 */
  onChangeAlgorithm?: (algorithm: string) => void;
  /** 方向 */
  rankdir?: Direction;
  /** 切换方向事件 */
  onChangeRankDir?: (direction: Direction) => void;
  /** 图的各个层次之间的间距 */
  ranksep?: number;
  /** 图的各个层次之间的间距切换事件 */
  onChangeRanksep?: (ranksep: number) => void;
  /** 同层各个节点之间的间距 */
  nodesep?: number;
  /** 同层各个节点之间的间距切换事件 */
  onChangeNodesep?: (nodesep: number) => void;
}

/** 布局配置 */
const useLayoutConfig = create<Props>((set) => ({
  algorithm: 'dagre',
  onChangeAlgorithm: (algorithm) => set(() => ({ algorithm })),
  direction: undefined,
  onChangeRankDir: (rankdir) => set(() => ({ rankdir })),
  ranksep: RANK_SEP,
  onChangeRanksep: (ranksep) => set(() => ({ ranksep })),
  nodesep: NODE_SEP,
  onChangeNodesep: (nodesep) => set(() => ({ nodesep })),
}));

export default useLayoutConfig;
