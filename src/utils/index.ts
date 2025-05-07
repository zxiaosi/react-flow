import { NODE_HEIGHT, NODE_WIDTH } from '@/global';
import dagre from '@dagrejs/dagre';
import { Edge, Node } from '@xyflow/react';

/** 获取节点唯一id */
export const getNodeIdUtil = (getNodes: () => Node[]) => {
  const nodes = getNodes?.();
  const lastId = nodes?.[nodes?.length - 1]?.id;
  const newNodeId = lastId ? parseInt(lastId) + 1 : 1;
  return `${newNodeId}`;
};

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
 * 将文本转换为JSON并下载
 * @param {string} text - 要转换的文本
 * @param {string} filename - 下载的文件名（不带.json扩展名）
 */
export function textToJsonAndDownloadUtil(text = '', filename = 'data') {
  try {
    // 1. 将文本转换为JSON对象
    // 如果文本已经是JSON格式，直接解析
    // 如果不是，则作为纯文本处理
    let jsonObj;
    try {
      jsonObj = JSON.parse(text);
    } catch (e) {
      // 如果不是有效的JSON，则作为纯文本处理
      jsonObj = { content: text };
    }

    // 2. 将JSON对象转换为字符串，格式化输出
    const jsonString = JSON.stringify(jsonObj, null, 2);

    // 3. 创建Blob对象
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 4. 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;

    // 5. 触发下载
    document.body.appendChild(a);
    a.click();

    // 6. 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('转换或下载失败:', error);
    alert('转换或下载失败，请查看控制台获取详细信息');
  }
}

/**
 * 从 SVG 路径中提取顶点坐标
 * @param {string} path - SVG 路径
 * @returns {VerticesType[]} - 顶点坐标数组
 */
export function extractVerticesFromPathUtil(path: string): VerticesType[] {
  const vertices = [] as VerticesType[];
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
