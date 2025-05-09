import { Edge, Node } from '@xyflow/react';
import { create } from 'zustand';

interface Props {
  /** 选中的节点 */
  selectedNodes: Node[];
  /** 选中的节点改变事件 */
  onChangeSelectedNodes: (nodes: Node[]) => void;
  /** 选中的连接线 */
  selectedEdges: Edge[];
  /** 选中的连接线改变事件 */
  onChangeSelectedEdges: (edges: Edge[]) => void;
}

/** 节点/连接线选择配置 */
const useSelectNodeEdge = create<Props>((set) => ({
  selectedNodes: [],
  onChangeSelectedNodes: (nodes) => set({ selectedNodes: nodes }),
  selectedEdges: [],
  onChangeSelectedEdges: (edges) => set({ selectedEdges: edges }),
}));

export default useSelectNodeEdge;
