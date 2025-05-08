import { CustomEdge } from '@/components/customTypesEdge';
import { CustomNode } from '@/components/customTypesNode';

/** 自定义节点类型 */
export const NODE_TYPES = {
  customNode: CustomNode,
};

/** 自定义边类型 */
export const EDGE_TYPES = {
  customEdge: CustomEdge,
};

/** 节点宽度 */
export const NODE_WIDTH = 150;
/** 节点高度 */
export const NODE_HEIGHT = 39;

/** 层级间距 */
export const RANK_SEP = 50;
/** 节点间距 */
export const NODE_SEP = 50;

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

/** 连接线的类型 */
export const EDGE_TYPES_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Straight', value: 'straight' },
  { label: 'Step', value: 'step' },
  { label: 'Smoothstep', value: 'smoothstep' },
  { label: 'CustomEdge', value: 'customEdge' },
];
