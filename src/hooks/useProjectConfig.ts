import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface Props {
  /** 是否显示背景 */
  showBg?: boolean;
  /** 显示/隐藏背景切换事件 */
  onChangeShowBg?: () => void;
  /** 主题 */
  theme?: Theme;
  /** 主题切换事件 */
  onChangeTheme?: () => void;
}

/** 项目配置 */
const useProjectConfig = create<Props>((set) => ({
  showBg: true,
  onChangeShowBg: () => {
    set((state) => ({ showBg: !state.showBg }));
  },
  theme: 'light',
  onChangeTheme: () => {
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  },
}));

export default useProjectConfig;
