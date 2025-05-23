import { create } from 'zustand';

interface Record {
  /** 类型 */
  type: 'node' | 'edge';
  /** 节点/连接线id */
  id: string | number;
}

interface Props {
  /** 侧边栏展示数据 */
  record?: Record | undefined;
  /** 侧边栏展示数据改变事件 */
  onChangeRecord?: (record?: Record) => void;
}

/** 右侧侧边栏配置 */
const useRightSideBarConfig = create<Props>((set) => ({
  record: undefined,
  onChangeRecord: (record) => set(() => ({ record })),
}));

export default useRightSideBarConfig;
