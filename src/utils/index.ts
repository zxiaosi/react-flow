import dagre from '@dagrejs/dagre';
import { Edge, Node } from '@xyflow/react';

/** 节点宽度 */
const NODE_WIDTH = 172;
/** 节点高度 */
const NODE_HEIGHT = 36;

/**
 * 获取布局后的节点和边
 * @param nodes 节点数据
 * @param edges 边数据
 * @param direction 布局方向 TB:上下 LR:左右
 */
export const getLayoutedElementsUtil = (
  nodes: Node[],
  edges: Edge[],
  direction = 'TB',
) => {
  const isHorizontal = direction === 'LR';

  // 创建一个新的 dagre 图 (一定要重新创建画布, 否则布局会错乱)
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  // 设置画布的节点
  nodes.forEach((node) => {
    const { width, height, measured } = node;

    dagreGraph.setNode(node.id, {
      width: width || measured?.width || NODE_WIDTH,
      height: height || measured?.height || NODE_HEIGHT,
    });
  });

  // 设置画布的边
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // 计算布局
  dagre.layout(dagreGraph);

  // 获取节点宽高
  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const { width, height, measured } = node;
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - (width || measured?.width || NODE_WIDTH) / 2,
        y: nodeWithPosition.y - (height || measured?.height || NODE_HEIGHT) / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

/**
 * 根据路径从对象中获取值
 * @param obj 要查找的对象
 * @param path 路径，可以是字符串、数字或数组
 * @returns 对应的值，如果路径不存在则返回 undefined
 */
export function getValueByPathUtil<T = any>(
  obj: Record<string | number, any>,
  path: string | number | Array<string | number>,
): T | undefined {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }

  // 统一处理路径为数组形式
  const pathArray = Array.isArray(path) ? path : [path];

  let current: any = obj;
  for (const key of pathArray) {
    if (current == null) {
      return undefined;
    }

    // 检查当前对象是否有该属性
    if (typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current as T;
}

/**
 * 根据路径设置对象中的值
 * @param obj 要设置的对象
 * @param path 路径，可以是字符串、数字或数组
 * @param value 要设置的值
 * @return 设置后的对象
 */
export function setValueByPathUtil(
  obj: Record<string | number, any>,
  path: string | number | Array<string | number>,
  value: any,
) {
  if (!obj || typeof obj !== 'object') {
    return;
  }

  // 统一处理路径为数组形式
  const pathArray = Array.isArray(path) ? path : [path];

  let current = obj;
  for (let i = 0; i < pathArray.length; i++) {
    const key = pathArray[i];

    // 如果是最后一个键，则设置值
    if (i === pathArray.length - 1) {
      current[key] = value;
      return;
    }

    // 如果中间路径不存在，则创建对象
    if (current[key] == null) {
      current[key] = {};
    }

    current = current[key];
  }

  return current;
}
