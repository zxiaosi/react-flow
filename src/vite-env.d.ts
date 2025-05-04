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
}
