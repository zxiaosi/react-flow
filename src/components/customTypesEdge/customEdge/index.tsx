import { extractVerticesFromPathUtil } from '@/utils';
import {
  BaseEdge,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from '@xyflow/react';
import { useEffect } from 'react';

/** 自定义边 */
const CustomEdge = (props: EdgeProps) => {
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

  const { setEdges } = useReactFlow();

  let edgePath = '';

  const vertices = data?.vertices as VerticesType;

  if (vertices?.length > 0) {
    // 组合所有路径点（起点 + 拐点 + 终点）
    const points = [
      { x: sourceX, y: sourceY },
      ...(vertices || []), // 拐点
      { x: targetX, y: targetY },
    ];

    // 生成直角路径指令
    edgePath = points.reduce((path, point, i) => {
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

    edgePath = path;
  }

  useEffect(() => {
    // 初始化的时候执行

    if (!edgePath || vertices?.length > 0) return;

    // 解析路径，获取拐点坐标
    const newVertices = extractVerticesFromPathUtil(edgePath);

    // 设置边的拐点坐标;
    setEdges((eds: any[]) => {
      const newEds = eds.map((edge) => {
        if (edge?.id === id)
          return { ...edge, data: { ...edge.data, vertices: newVertices } };
        else return edge;
      });
      return newEds;
    });
  }, [edgePath, vertices]);

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
    </>
  );
};

export default CustomEdge;
