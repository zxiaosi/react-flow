import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useNodeConfig from '@/hooks/useNodeConfig';
import useProjectConfig from '@/hooks/useProjectConfig';
import { getLayoutedElementsUtil } from '@/utils';
import { Panel, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

/** 自定义左侧菜单 */
const CustomLeftMenu = ({ onClick }) => {
  /** react-flow 实例方法 */
  const { fitView, getEdges, getNodes, setNodes, setEdges } = useReactFlow();

  /** 项目配置 */
  const { showBg, onChangeShowBg, theme, onChangeTheme } = useProjectConfig(
    useShallow((state) => ({
      showBg: state.showBg,
      onChangeShowBg: state.onChangeShowBg,
      theme: state.theme,
      onChangeTheme: state.onChangeTheme,
    })),
  );

  /** 节点配置 */
  const { onDrageNodeData, onChangeModalId } = useNodeConfig(
    useShallow((state) => ({
      onDrageNodeData: state.onDrageNodeData,
      onChangeModalId: state.onChangeModalId,
    })),
  );

  const [dialogOpen, setDialogOpen] = useState(false); // 弹框是否打开

  /** 菜单数据 */
  const menuItems = [
    {
      name: 'project',
      label: '项目',
      children: [
        {
          name: 'theme',
          label: '主题',
          icon: theme === 'light' ? '&#xe611;' : '&#xe634;',
        },
        { name: 'background', label: '背景', icon: '&#xe661;' },
        { name: 'fitView', label: '铺满', icon: '&#xe6f0;' },
        { name: 'export', label: '导出', icon: '&#xe60f;' },
      ],
    },
    {
      name: 'layput',
      label: '布局',
      children: [
        {
          name: 'algorithm',
          type: 'select',
          options: [
            { label: 'Dagre', value: 'dagre' },
            // { label: 'Elkjs', value: 'elkjs' },
          ],
        },
        { name: 'horizontal', label: '水平', icon: '&#xe601;' },
        { name: 'vertical', label: '垂直', icon: '&#xe602;' },
      ],
    },
    {
      name: 'node',
      label: '节点',
      children: [
        { name: 'default', label: '默认', icon: '&#xe652;' },
        { name: 'group', label: '组', icon: '&#xe9b3;' },
        { name: 'square', label: '正方形', icon: '&#xe600;' },
        { name: 'lozenge', label: '菱形', icon: '&#xe636;' },
      ],
    },
  ];

  /** 菜单点击事件 */
  const handleClick = (item) => {
    onChangeModalId?.(''); // 清空弹框id

    if (item.name === 'node') return;

    switch (item.name) {
      case 'theme':
        onChangeTheme?.();
        break;
      case 'background':
        onChangeShowBg?.();
        break;
      case 'fitView':
        fitView();
        break;
      case 'export': {
        setDialogOpen(true);
        break;
      }
      case 'horizontal':
      case 'vertical': {
        const nodes = getNodes();
        const edges = getEdges();
        const direction = item.name === 'horizontal' ? 'LR' : 'TB';

        const { nodes: layoutNodes, edges: layoutEdges } =
          getLayoutedElementsUtil(nodes, edges, direction);

        setNodes(layoutNodes);
        setEdges(layoutEdges);
        fitView();
        break;
      }
      case 'default':
        break;
    }
  };

  /** 菜单拖拽开始事件 */
  const handleDragStart = (e, item, child) => {
    onChangeModalId?.(''); // 清空弹框id

    if (item.name !== 'node') return;
    onDrageNodeData?.(child);
  };

  /** 弹框打开事件 */
  const handleOpenChange = (open) => {
    if (!open) setDialogOpen(false);
  };

  return (
    <>
      <Panel position="top-left">
        <div
          className="border-1 grid w-[200px] gap-4 rounded border-gray-200 bg-white p-3 shadow"
          onClick={onClick}
        >
          {menuItems.map((item) => (
            <div key={item.name}>
              <div className="mb-2 text-sm font-bold">{item.label}</div>
              <div className="flex flex-wrap gap-2">
                {item.children.map((child) => {
                  return child?.type === 'select' ? (
                    <Select
                      key={child.name}
                      defaultValue={child?.options?.[0]?.value}
                    >
                      <SelectTrigger className="w-[86px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {child.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div
                      key={child.name}
                      className={`h-[36px] w-[36px] rounded bg-gray-100 text-gray-600 caret-transparent hover:bg-gray-200 ${item.name === 'node' ? 'cursor-move' : 'cursor-pointer'} `}
                      draggable={item.name === 'node'}
                      onClick={() => handleClick(child)}
                      onDragStart={(e) => handleDragStart(e, item, child)}
                    >
                      <span
                        title={child.label}
                        className={`iconfont flex h-full w-full items-center justify-center ${!showBg && child.name === 'background' ? 'text-gray-300' : ''}`}
                        dangerouslySetInnerHTML={{ __html: child.icon || '' }}
                      ></span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Panel>

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
                  defaultValue={JSON.stringify(getNodes(), null, 2)}
                />
              </div>

              <div>
                <div className="mb-2">边列表</div>
                <Textarea
                  spellCheck={false}
                  className="min-h-[200px]"
                  defaultValue={JSON.stringify(getEdges(), null, 2)}
                />
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default memo(CustomLeftMenu);
