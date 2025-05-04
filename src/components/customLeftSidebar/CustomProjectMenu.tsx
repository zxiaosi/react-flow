import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edge, Node, useReactFlow } from '@xyflow/react';
import { memo, useRef, useState } from 'react';

/** 菜单数据 */
const menuItems = [
  {
    name: 'project',
    label: '项目',
    children: [
      { name: 'fitView', label: '铺满', icon: '&#xe6f0;' },
      { name: 'clear', label: '清空', icon: '&#xe681;' },
      { name: 'import', label: '导入', icon: '&#xe610;' },
      { name: 'export', label: '导出', icon: '&#xe60f;' },
    ],
  },
];

/** 左侧菜单-项目 */
const CustomProjectMenu = () => {
  const { fitView, setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const nodesRef = useRef<Node[]>([]); // 节点数据
  const edgesRef = useRef<Edge[]>([]); // 连接线数据

  const [dialogOpen, setDialogOpen] = useState(false); // 弹框是否打开

  /** 点击事件 */
  const handleClick = (item) => {
    switch (item.name) {
      case 'fitView':
        fitView();
        break;
      case 'clear': {
        setNodes([]);
        setEdges([]);
        break;
      }
      case 'export': {
        setDialogOpen(true);

        const nodes = getNodes(); // 获取节点数据
        const edges = getEdges(); // 获取连接线数据
        nodesRef.current = nodes; // 存储节点数据
        edgesRef.current = edges; // 存储连接线数据

        localStorage.setItem('nodes', JSON.stringify(nodes)); // 存储节点数据
        localStorage.setItem('edges', JSON.stringify(edges)); // 存储连接线数据
        break;
      }
      case 'default':
        break;
    }
  };

  /** 弹框打开事件 */
  const handleOpenChange = (open) => {
    if (!open) setDialogOpen(false);
  };

  return (
    <>
      {menuItems.map((item) => (
        <div key={item.name}>
          <div className="mb-2 text-center text-sm font-bold">{item.label}</div>
          <div className="flex flex-wrap gap-2">
            {item.children.map((child: any) => {
              const { name, label, icon } = child;
              return (
                <div
                  key={name}
                  className={`h-[33px] w-[33px] cursor-pointer rounded bg-gray-100 caret-transparent hover:bg-gray-200`}
                  draggable={item.name === 'node'}
                  onClick={() => handleClick(child)}
                >
                  <span
                    title={label}
                    className={`iconfont flex h-full w-full items-center justify-center`}
                    dangerouslySetInnerHTML={{ __html: icon || '' }}
                  ></span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导出</DialogTitle>
            <div className="grid gap-4">
              <div>
                <div className="mb-2">节点列表</div>
                <Textarea
                  spellCheck={false}
                  className="min-h-[200px]"
                  defaultValue={JSON.stringify(nodesRef.current, null, 2)}
                />
              </div>

              <div>
                <div className="mb-2">边列表</div>
                <Textarea
                  spellCheck={false}
                  className="min-h-[200px]"
                  defaultValue={JSON.stringify(edgesRef.current, null, 2)}
                />
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(CustomProjectMenu);
