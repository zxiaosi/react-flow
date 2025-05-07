/** 节点宽度 */
export const NODE_WIDTH = 150;
/** 节点高度 */
export const NODE_HEIGHT = 39;

/** 主题类型 */
export const THEME_TYPE = [
  { value: 'light', icon: '&#xe611;' },
  { value: 'dark', icon: '&#xe634;' },
];

/** 算法类型 */
export const ALGORITHM_TYPE = [
  { label: 'Dagre', value: 'dagre' },
  { label: 'Elkjs', value: 'elkjs', disabled: true },
];

/** 连接桩类型 */
export const HANDLE_TYPES = [
  { label: 'Source', value: 'source' },
  { label: 'Target', value: 'target' },
];

/** 连接桩方向 */
export const HANDLE_POSITIONS = [
  { label: 'Top', value: 'Top' },
  { label: 'Right', value: 'Right' },
  { label: 'Bottom', value: 'Bottom' },
  { label: 'Left', value: 'Left' },
];
