import {
  BaseEdge,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from '@xyflow/react';
import { memo, useEffect, useState } from 'react';

type VerticesType = { x: number; y: number }[];

type CustomEdgeProps = EdgeProps & { vertices?: VerticesType };

function extractVerticesFromPath(path: string): VerticesType {
  const vertices = [] as VerticesType;
  const commands = path.split(/(?=[A-Z])/); // 分割 SVG 命令

  let currentX = 0,
    currentY = 0;

  commands.forEach((cmd) => {
    const [type, ...coords] = cmd.trim().split(/[\s,]+/);
    const nums = coords.map(Number);

    // 只提取直线指令（M/L/H/V）
    if (type === 'M' || type === 'L') {
      currentX = nums[0];
      currentY = nums[1];
      vertices.push({ x: currentX, y: currentY });
    } else if (type === 'H') {
      currentX = nums[0];
      vertices.push({ x: currentX, y: currentY });
    } else if (type === 'V') {
      currentY = nums[0];
      vertices.push({ x: currentX, y: currentY });
    }
  });

  return vertices;
}

/** 自定义边 */
function CustomEdge(props: CustomEdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    vertices = [],
  } = props;

  const { setEdges } = useReactFlow();
  const [edgePath, setEdgePath] = useState<string>('');

  useEffect(() => {
    if (vertices?.length > 0) {
      // 组合所有路径点（起点 + 拐点 + 终点）
      const points = [
        { x: sourceX, y: sourceY },
        ...(vertices || []), // 拐点
        { x: targetX, y: targetY },
      ];

      // 生成直角路径指令
      const newEdgePath = points.reduce((path, point, i) => {
        return i === 0
          ? `M ${point.x},${point.y}`
          : `${path} L ${point.x},${point.y}`;
      }, '');

      setEdgePath(newEdgePath); // 设置路径
    } else {
      // 获取路径
      const [newEdgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        borderRadius: 0, // 圆角还是直角
      });

      setEdgePath(newEdgePath); // 设置路径

      // 解析路径，获取拐点坐标
      const vertices = extractVerticesFromPath(newEdgePath);

      // 设置边的拐点坐标
      setEdges((eds: any[]) => {
        const newEds = eds.map((edge) => {
          if (edge?.id === id) return { ...edge, vertices };
          else return edge;
        });

        return newEds;
      });
    }
  }, [sourceX, sourceY, targetX, targetY, vertices]);

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
    </>
  );
}

export default memo(CustomEdge);
