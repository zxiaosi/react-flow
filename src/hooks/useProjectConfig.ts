import { create } from 'zustand';

interface Props {
  /** 是否显示背景 */
  showBg?: boolean;
  /** 显示/隐藏背景切换事件 */
  onChangeShowBg?: () => void;
  /** 主题索引 */
  themeIdx?: number;
  /** 主题索引切换事件 */
  onChangeThemeIdx?: (idx: number) => void;
  /** 线类型索引 */
  lineTypeIdx?: number;
  /** 线类型索引切换事件 */
  onChangeLineTypeIdx?: (idx: number) => void;
  /** 线动画 */
  lineAnimated?: boolean;
  /** 线动画切换事件 */
  onChangeLineAnimated?: () => void;
}

/** 项目配置 */
const useProjectConfig = create<Props>((set) => ({
  showBg: true,
  onChangeShowBg: () => {
    set((state) => ({ showBg: !state.showBg }));
  },
  themeIdx: 0,
  onChangeThemeIdx: (idx: number) => {
    set(() => ({ themeIdx: idx }));
  },
  lineTypeIdx: 3,
  onChangeLineTypeIdx: (idx: number) => {
    set(() => ({ lineTypeIdx: idx }));
  },
  lineAnimated: false,
  onChangeLineAnimated: () => {
    set((state) => ({ lineAnimated: !state.lineAnimated }));
  },
}));

export default useProjectConfig;
