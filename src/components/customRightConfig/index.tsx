import { Input } from '@/components/ui/input';
import { getValueByPathUtil, setValueByPathUtil } from '@/utils';
import { Panel, useReactFlow } from '@xyflow/react';

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
];

/** 自定义弹框组件 */
const CustomModal = ({ nodeId }: { nodeId: string }) => {
  /** react-flow 实例方法 */
  const { getNode, updateNode } = useReactFlow();

  const node = getNode(nodeId); // 获取节点数据
  if (!node?.style) node!.style = { ...node?.measured };

  console.log('node', node);

  /** 节点数据变化事件 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, item) => {
    const value = e.target.value;
    const { name, type } = item;
    const realValue = type === 'number' ? Number(value) : value; // 转换为数字类型
    const newNodes = setValueByPathUtil(node || {}, name, realValue); // 设置节点数据
    updateNode(nodeId, newNodes || {}); // 更新节点数据
  };

  return (
    <Panel position="top-right">
      <div className="grid w-[200px] gap-y-3 rounded bg-white p-3 shadow">
        {items.map((item) => {
          const { type, name, label, disabled } = item;

          return (
            <div key={label} className="w-full">
              <div className="mb-2 text-sm text-gray-500">{label}</div>
              <Input
                type={type}
                disabled={disabled}
                value={getValueByPathUtil(node || {}, name)}
                onChange={(e) => handleChange(e, item)}
              />
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export default CustomModal;
