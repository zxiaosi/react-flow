import { NODE_HEIGHT, NODE_RESIZE_COLOR, NODE_WIDTH } from '@/global';
import { Node, NodeProps, NodeResizer } from '@xyflow/react';
import './index.less';

/** 自定义节点组 */
const CustomGroupNode = (props: NodeProps<Node<NodeDataType>>) => {
  const { data, selected } = props;

  return (
    <>
      <div
        className={`custom-group-node ${selected ? 'custom-group-node-selectable' : ''}`}
      >
        {data?.label || ''}
      </div>

      <NodeResizer
        color={NODE_RESIZE_COLOR}
        isVisible={selected}
        minWidth={NODE_WIDTH}
        minHeight={NODE_HEIGHT}
      />
    </>
  );
};

export default CustomGroupNode;
