import { useReactFlow } from '@xyflow/react';
import { Input, InputNumber } from 'antd';
import { get, set } from 'lodash';
import './index.less';

/** 配置 */
const columns = [
  { type: 'text', name: 'id', label: '唯一ID - id', disabled: true },
  {
    type: 'text',
    name: ['data', 'label'],
    label: '文案 - data.label',
    disabled: false,
  },
  {
    type: 'number',
    name: 'width',
    label: '宽 - style.width',
    disabled: false,
  },
  {
    type: 'number',
    name: 'height',
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
const CustomNodeDetail = ({ nodeId }: { nodeId: string }) => {
  const { getNode, updateNode } = useReactFlow();

  const node = getNode(nodeId); // 获取节点数据
  if (!node?.width) node!.width = node?.measured?.width;
  if (!node?.height) node!.height = node?.measured?.height;

  /** 节点数据变化事件 */
  const handleChange = (value: any, item: DetailColumns) => {
    const { name } = item;
    set(node || {}, name, value); // 设置节点数据
    updateNode(nodeId, node || {}); // 更新节点数据
  };

  return (
    <>
      {columns.map((item) => {
        const { type, name, label, disabled } = item;
        const value = get(node || {}, name);

        return (
          <div key={label} className="custom-right-sidebar-item">
            <div className="custom-right-sidebar-item-label">{label}</div>
            {type === 'text' && (
              <Input
                disabled={disabled}
                value={value}
                onChange={(e) => handleChange(e.target.value, item)}
              />
            )}

            {type === 'number' && (
              <InputNumber
                changeOnWheel={true}
                disabled={disabled}
                value={value}
                onChange={(e) => handleChange(e, item)}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default CustomNodeDetail;
