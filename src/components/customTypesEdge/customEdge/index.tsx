import { extractVerticesFromPathUtil } from '@/utils';
import {
  BaseEdge,
  Edge,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from '@xyflow/react';
import { useRef } from 'react';

/** 自定义边 */
const CustomEdge = (props: EdgeProps<Edge<EdgeDataType>>) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  } = props;

  const { getEdge, updateEdge } = useReactFlow();

  const edgePathRef = useRef(''); // 连接线路径

  if (data?.vertices) {
    // 组合所有路径点（起点 + 拐点 + 终点）
    const points = [
      { x: sourceX, y: sourceY },
      ...(data?.vertices || []), // 拐点
      { x: targetX, y: targetY },
    ];

    // 生成直角路径指令
    edgePathRef.current = points.reduce((path, point, i) => {
      return i === 0
        ? `M ${point.x},${point.y}`
        : `${path} L ${point.x},${point.y}`;
    }, '');
  } else {
    // 获取路径
    const [path] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 0, // 圆角还是直角
    });

    edgePathRef.current = path;

    // 解析路径，获取拐点坐标
    const vertices = extractVerticesFromPathUtil(edgePathRef.current) || [];

    // 设置边的拐点坐标
    const edge = getEdge(id);
    updateEdge(id, { ...edge, data: { ...edge?.data, vertices: vertices } });
  }

  return (
    <>
      <BaseEdge id={id} path={edgePathRef.current} />
    </>
  );
};

export default CustomEdge;
