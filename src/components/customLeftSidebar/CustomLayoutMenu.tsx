import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ALGORITHM_TYPE } from '@/global';
import { getLayoutedElementsUtil } from '@/utils';
import { useReactFlow } from '@xyflow/react';
import { memo } from 'react';

/** 菜单数据 */
const menuItems = [
  {
    name: 'layput',
    label: '布局',
    children: [
      { name: 'algorithm', type: 'select', options: ALGORITHM_TYPE },
      { name: 'horizontal', label: '水平', icon: '&#xe601;' },
      { name: 'vertical', label: '垂直', icon: '&#xe602;' },
    ],
  },
];

/** 左侧菜单-布局 */
const CustomLayoutMenu = () => {
  const { fitView, setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  /** 点击事件 */
  const handleClick = (item) => {
    switch (item.name) {
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

  return (
    <>
      {menuItems.map((item) => (
        <div key={item.name}>
          <div className="mb-2 text-center text-sm font-bold">{item.label}</div>
          <div className="flex flex-wrap gap-2">
            {item.children.map((child: any) => {
              const { name, label, icon, type = '', options = [] } = child;
              return type === 'select' ? (
                <Select key={name} defaultValue={options?.[0]?.value}>
                  <SelectTrigger className="h-[33px] w-[74px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div
                  key={name}
                  className={`h-[33px] w-[33px] cursor-pointer rounded bg-gray-100 text-gray-600 caret-transparent hover:bg-gray-200`}
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
    </>
  );
};

export default memo(CustomLayoutMenu);
