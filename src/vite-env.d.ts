/// <reference types="vite/client" />

/** 节点data配置 */
interface NodeDataType {
  label?: string;
  handles?: HandleType[];
  [key: string]: unknown; // 添加索引签名
}

/** 连接线data配置 */
interface EdgeDataType {
  label?: string;
  vertices?: VerticesType[];
  [key: string]: unknown; // 添加索引签名
}

/** 菜单项 */
interface MenuItems {
  /** 菜单key */
  name?: string;
  /** 菜单名称 */
  label?: string;
  /** 图标icon */
  icon?: string;
  /** 子菜单 */
  children?: MenuItems[];
  /** 类型 */
  type?: string;
  /** 配置项 */
  options?: any[];
}

/** 右键菜单 */
interface ContextMenu {
  /** 节点/连接线id */
  id: string | number;
  /** 节点 或者 连接线 */
  type: 'node' | 'edge';
  /** 上间距 */
  top: any;
  /** 左间距 */
  left: any;
  /** 右间距 */
  right: any;
  /** 下间距 */
  bottom: any;
}

/** 节点/连接线详情项 */
interface DetailColumns {
  /** 字段类型 */
  type: string;
  /** 字段名 */
  name: string | number | (string | number)[];
  /** 标签的文本 */
  label?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 配置项 */
  options?: any[];
}

/** 连接线拐点类型 */
type VerticesType = { x: number; y: number };

/** 连接桩类型 */
interface HandleType {
  /** 唯一标识 */
  id: string;
  /** 类型 */
  type: 'source' | 'target';
  /** 显示的位置 */
  position: 'Left' | 'Right' | 'Top' | 'Bottom';
}
