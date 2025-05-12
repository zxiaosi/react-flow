import { NODE_HEIGHT, NODE_RESIZE_COLOR, NODE_WIDTH } from '@/global';
import { Handle, Node, NodeProps, NodeResizer, Position } from '@xyflow/react';
import './index.less';

interface CustomHandleProps {
  /** 节点方向 */
  direction?: HandleType['position'];
  /** 所有连接桩数据 */
  allHandles?: HandleType[];
}

/** 自定义连接桩 */
const CustomHandle = (props: CustomHandleProps) => {
  const { direction = 'Left', allHandles = [] } = props;
  const handles = allHandles.filter((_) => _.position === direction) || [];
  if (!handles || handles?.length === 0) return null;

  return handles.map((handle: HandleType, idx: number) => {
    const { id, type } = handle;

    let style = {};
    const percent = `${((idx + 1) / (handles.length + 1)) * 100}%`;
    if (['Left', 'Right'].includes(direction)) style = { top: percent };
    if (['Top', 'Bottom'].includes(direction)) style = { left: percent };

    const position = Position[direction];

    return (
      <Handle key={id} id={id} type={type} position={position} style={style} />
    );
  });
};

/** 自定义节点 */
const CustomNode = (props: NodeProps<Node<NodeDataType>>) => {
  const { data, selected } = props;
  const allHandles = data?.handles || [];

  return (
    <>
      <div
        className={`custom-node ${selected ? 'custom-node-selectable' : ''}`}
      >
        {data?.label || ''}
      </div>

      <NodeResizer
        color={NODE_RESIZE_COLOR}
        isVisible={selected}
        minWidth={NODE_WIDTH}
        minHeight={NODE_HEIGHT}
      />

      {['Top', 'Bottom', 'Left', 'Right'].map((direction: any) => (
        <CustomHandle
          key={direction}
          direction={direction}
          allHandles={allHandles}
        />
      ))}
    </>
  );
};

export default CustomNode;
