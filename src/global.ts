import { CustomEdge } from '@/components/customTypesEdge';
import { CustomGroupNode, CustomNode } from '@/components/customTypesNode';

/** 节点组数组 */
export const GROUP_NAMES = ['group', 'customGroupNode'];

/** 自定义节点类型 */
export const NODE_TYPES = {
  customNode: CustomNode,
  customGroupNode: CustomGroupNode,
};

/** 自定义边类型 */
export const EDGE_TYPES = {
  customEdge: CustomEdge,
};

/** 节点宽度 */
export const NODE_WIDTH = 2;
/** 节点高度 */
export const NODE_HEIGHT = 2;

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

/** 粘贴时偏移量 */
export const OFFSET = 50;

/** 节点调节器颜色 */
export const NODE_RESIZE_COLOR = '#ff0071';

/** 导出图片的宽度 */
export const IMAGE_WIDTH = 1920;

/** 导出图片的高度 */
export const IMAGE_HEIGHT = 1080;
