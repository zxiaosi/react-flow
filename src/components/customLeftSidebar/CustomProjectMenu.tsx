import CustomImportExportModal from '@/components/customImportExportModal';
import { useReactFlow } from '@xyflow/react';
import { memo, useRef } from 'react';
import './index.less';

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
] satisfies MenuItems[];

/** 左侧菜单-项目 */
const CustomProjectMenu = () => {
  const { fitView, setNodes, setEdges } = useReactFlow();

  const modalRef = useRef<any>(null); // 弹框ref

  /** 点击事件 */
  const handleClick = (item: MenuItems) => {
    const { name } = item;

    switch (name) {
      case 'fitView': {
        fitView();
        break;
      }
      case 'clear': {
        setNodes([]);
        setEdges([]);
        break;
      }
      case 'import':
      case 'export': {
        modalRef?.current?.open?.(name);
        break;
      }
      case 'default':
        break;
    }
  };

  return (
    <>
      <div className="custom-project-menu">
        {menuItems.map((item) => (
          <div key={item.name}>
            <div className="custom-left-menu-title">{item.label}</div>
            <div className="custom-left-menu-content">
              {item.children.map((child: any) => {
                const { name, label, icon } = child;
                return (
                  <div
                    key={name}
                    className={`custom-left-menu-content-item`}
                    onClick={() => handleClick(child)}
                  >
                    <span
                      title={label}
                      className={`iconfont`}
                      dangerouslySetInnerHTML={{ __html: icon || '' }}
                    ></span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <CustomImportExportModal ref={modalRef} />
    </>
  );
};

export default memo(CustomProjectMenu);
