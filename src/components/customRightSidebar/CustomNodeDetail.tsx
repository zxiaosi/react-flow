/** 弹框配置 */
const items = [
  { type: 'text', name: 'id', label: '唯一ID - id', disabled: true },
  {
    type: 'text',
    name: ['data', 'label'],
    label: '文案 - data.label',
    disabled: false,
  },
  {
    type: 'number',
    name: ['style', 'width'],
    label: '宽 - style.width',
    disabled: false,
  },
  {
    type: 'number',
    name: ['style', 'height'],
    label: '高 - style.height',
    disabled: false,
  },
  {
    type: 'number',
    name: ['position', 'x'],
    label: 'X坐标 - position.x',
    disabled: false,
  },
  {
    type: 'number',
    name: ['position', 'y'],
    label: 'Y坐标 - position.y',
    disabled: false,
  },
] satisfies DetailColumns[];

/** 右侧侧边栏-节点详情 */
const CustomNodeDetail = ({ id }: { id: string | number }) => {
  return <div>{id}</div>;
};

export default CustomNodeDetail;
