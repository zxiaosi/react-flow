import { extractVerticesFromPathUtil } from '@/utils';
import {
  BaseEdge,
  Edge,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from '@xyflow/react';
import React, { useEffect, useRef } from 'react';

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
    selected,
  } = props;

  const { getEdge, updateEdge, screenToFlowPosition } = useReactFlow();

  const mouseDownIdRef = useRef(-1); // 鼠标按下的拐点索引
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

  /** 鼠标移动事件 */
  const handleMouseMove = (event: MouseEvent) => {
    if (mouseDownIdRef.current < 0) return;
    event.preventDefault();
    const dragX = event.clientX;
    const dragY = event.clientY;

    const newVertices = [...(data?.vertices || [])];
    newVertices[mouseDownIdRef.current] = screenToFlowPosition(
      { x: dragX, y: dragY },
      { snapToGrid: false },
    );
    // 设置边的拐点坐标
    const edge = getEdge(id);
    updateEdge(id, {
      ...edge,
      data: { ...edge?.data, vertices: newVertices },
    });
  };

  /** 鼠标抬起事件 */
  const handleMouseUp = () => {
    mouseDownIdRef.current = -1;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  /** 鼠标按下事件 */
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    mouseDownIdRef.current = index;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <BaseEdge id={id} path={edgePathRef.current} />

      {selected &&
        data?.vertices &&
        data?.vertices?.map((vertex, index) => (
          <circle
            key={index}
            tabIndex={0}
            cx={vertex.x}
            cy={vertex.y}
            r="4px"
            fill="#ff0066"
            strokeWidth={1}
            stroke={mouseDownIdRef.current === index ? 'black' : 'white'}
            style={{ pointerEvents: 'all', outline: 'none' }}
            onMouseDown={(e) => handleMouseDown(e, index)}
          />
        ))}

      <circle
        r={'4'}
        fill="yellow"
        style={{
          filter: 'drop-shadow(0px 0px 2px #ffc300)',
        }}
      >
        <animateMotion
          dur={'6s'}
          repeatCount={'indefinite'}
          path={edgePathRef.current}
          // keyPoints={'1;0'}
          // keyTimes={'0;1'}
        />
      </circle>
    </>
  );
};

export default CustomEdge;
