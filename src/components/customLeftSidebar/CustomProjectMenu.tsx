import { textToJsonAndDownloadUtil } from '@/utils';
import { useReactFlow } from '@xyflow/react';
import { Button, Form, FormInstance, Input, message, Modal } from 'antd';
import copy from 'copy-to-clipboard';
import { memo, useEffect, useRef, useState } from 'react';
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

/** 导入组件 */
const CustomImport = () => {
  const { setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    const nodes = localStorage.getItem('nodes') || '[]'; // 获取节点数据
    const edges = localStorage.getItem('edges') || '[]'; // 获取连接线数据

    setNodes(JSON.parse(nodes));
    setEdges(JSON.parse(edges));
  }, []);

  return <></>;
};

/** 导出组件 */
const CustomExport = () => {
  const { getNodes, getEdges } = useReactFlow();

  const formRef = useRef<FormInstance>(null); // 表单实例

  useEffect(() => {
    const nodes = getNodes(); // 获取节点数据
    const edges = getEdges(); // 获取连接线数据

    // 设置表单值
    formRef.current?.setFieldsValue({
      nodes: JSON.stringify(nodes, null, 2),
      edges: JSON.stringify(edges, null, 2),
    });
  }, []);

  /** 保存到本地缓存 */
  const handleSave = () => {
    const values = formRef?.current?.getFieldsValue?.();
    localStorage.setItem('nodes', values?.nodes);
    localStorage.setItem('edges', values?.edges);
  };

  /** 下载文件 */
  const handleDownload = () => {
    const values = formRef?.current?.getFieldsValue?.();
    const text = JSON.stringify({
      nodes: JSON.parse(values?.nodes || '[]'),
      edges: JSON.parse(values?.edges || '[]'),
    });

    textToJsonAndDownloadUtil(text, 'tuopu');
  };

  /** 复制完成事件 */
  const handleCopy = (type: 'nodes' | 'edges') => {
    const values = formRef?.current?.getFieldsValue?.();
    const result = copy(values?.[type]);
    if (result) message.success('复制成功');
    else message.error('复制失败');
  };

  return (
    <Form ref={formRef}>
      <div className="class-project-modal-export">
        <div className="class-project-modal-export-item">
          <div className="class-project-modal-export-item-title">
            <span>节点列表</span>
            <span className="iconfont" onClick={() => handleCopy('nodes')}>
              &#xe8c9;
            </span>
          </div>

          <Form.Item name={'nodes'} noStyle>
            <Input.TextArea rows={6} />
          </Form.Item>
        </div>

        <div className="class-project-modal-export-item">
          <div className="class-project-modal-export-item-title">
            <span>连接线列表</span>
            <span className="iconfont" onClick={() => handleCopy('edges')}>
              &#xe8c9;
            </span>
          </div>

          <Form.Item name={'edges'} noStyle>
            <Input.TextArea rows={6} />
          </Form.Item>
        </div>

        <div className="class-project-modal-export-btn">
          <Button type="primary" block onClick={handleSave}>
            保存到本地缓存
          </Button>
          <Button type="primary" block onClick={handleDownload}>
            下载文件
          </Button>
        </div>
      </div>
    </Form>
  );
};

/** 左侧菜单-项目 */
const CustomProjectMenu = () => {
  const { fitView, setNodes, setEdges } = useReactFlow();

  const [modalType, setModalType] = useState<'import' | 'export' | ''>(''); // 弹框类型

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
      case 'import': {
        setModalType('import');
        break;
      }
      case 'export': {
        setModalType('export');
        break;
      }
      case 'default':
        break;
    }
  };

  /** 弹框关闭事件 */
  const handleCancel = () => {
    setModalType('');
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
        open={modalType !== ''}
        title={modalType === 'import' ? '导入项目' : '导出项目'}
        footer={null}
        destroyOnClose={true}
        onCancel={handleCancel}
        wrapClassName="custom-project-modal"
      >
        {modalType === 'import' && <CustomImport />}

        {modalType === 'export' && <CustomExport />}
      </Modal>
    </>
  );
};

export default memo(CustomProjectMenu);
