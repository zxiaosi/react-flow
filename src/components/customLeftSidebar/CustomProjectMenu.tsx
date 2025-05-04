import { Edge, Node, useReactFlow } from '@xyflow/react';
import { Input, Modal } from 'antd';
import { memo, useRef, useState } from 'react';
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
];

/** 左侧菜单-项目 */
const CustomProjectMenu = () => {
  const { fitView, setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const nodesRef = useRef<Node[]>([]); // 节点数据
  const edgesRef = useRef<Edge[]>([]); // 连接线数据

  const [open, setOpen] = useState(false); // 弹框是否打开

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
      case 'import': {
        const nodes = localStorage.getItem('nodes') || '[]'; // 获取节点数据
        const edges = localStorage.getItem('edges') || '[]'; // 获取连接线数据

        setNodes(JSON.parse(nodes));
        setEdges(JSON.parse(edges));
        break;
      }
      case 'export': {
        setOpen(true);

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

  /** 弹框关闭事件 */
  const handleCancel = () => {
    setOpen(false);
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

      <Modal
        title={'导出'}
        footer={null}
        open={open}
        onCancel={handleCancel}
        wrapClassName="custom-project-modal"
      >
        <div className="class-project-modal-content">
          <div className="class-project-modal-content-item">
            <div>节点列表</div>
            <Input.TextArea
              rows={6}
              defaultValue={JSON.stringify(nodesRef.current, null, 2)}
            />
          </div>

          <div className="class-project-modal-content-item">
            <div>边列表</div>
            <Input.TextArea
              rows={6}
              defaultValue={JSON.stringify(edgesRef.current, null, 2)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default memo(CustomProjectMenu);
