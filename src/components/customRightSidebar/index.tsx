import useRightSideBarConfig from '@/hooks/useRightSideBarConfig';
import { Panel } from '@xyflow/react';
import { useShallow } from 'zustand/shallow';
import CustomEdgeDetail from './CustomEdgeDetail';
import CustomNodeDetail from './CustomNodeDetail';
import './index.less';

interface Props {
  /** 点击事件 */
  onClick: () => void;
}

/** 自定义右侧侧边栏 */
const CustomRightSidebar = ({ onClick }: Props) => {
  const { record } = useRightSideBarConfig(
    useShallow((state) => ({
      record: state.record,
    })),
  );

  if (!record) return null;

  const { id, type } = record;

  // const { getNode, updateNode } = useReactFlow();

  // const node = getNode(nodeId); // 获取节点数据
  // if (!node?.style) node!.style = { ...node?.measured };

  // console.log('node', node);

  // /** 节点数据变化事件 */
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>, item) => {
  //   const value = e.target.value;
  //   const { name, type } = item;
  //   const realValue = type === 'number' ? Number(value) : value; // 转换为数字类型
  //   const newNodes = setValueByPathUtil(node || {}, name, realValue); // 设置节点数据
  //   updateNode(nodeId, newNodes || {}); // 更新节点数据
  // };

  return (
    <Panel position="top-right">
      <div className="custom-right-sidebar" onClick={onClick}>
        {/* {items.map((item) => {
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
        })} */}

        {type === 'node' && <CustomNodeDetail id={id} />}

        {type === 'edge' && <CustomEdgeDetail id={id} />}
      </div>
    </Panel>
  );
};

export default CustomRightSidebar;
