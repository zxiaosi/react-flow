/// <reference types="vite/client" />

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

interface DetailColumns {
  /** 字段类型 */
  type: string;
  /** 字段名 */
  name: string | number | (string | number)[];
  /** 标签的文本 */
  label?: string;
  /** 是否禁用 */
  disabled?: boolean;
}
