import { textToJsonAndDownloadUtil } from '@/utils';
import { useReactFlow } from '@xyflow/react';
import {
  Button,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
  Upload,
} from 'antd';
import copy from 'copy-to-clipboard';
import { UploadRequestOption } from 'rc-upload/es/interface';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './index.less';

type ModalType = 'import' | 'export' | '';

/** 自定义导入导出弹框 */
const CustomImportExportModal = forwardRef((props, ref) => {
  const { fitView, setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const formRef = useRef<FormInstance>(null); // 表单实例

  const [modalType, setModalType] = useState<ModalType>(''); // 弹框类型
  const [loading, setLoading] = useState(false); // 上传加载中

  /** 弹框关闭事件 */
  const handleCancel = () => {
    setModalType('');
  };

  /** 弹框打开/关闭回调 */
  const handleAfterOpenChange = (open: boolean) => {
    if (open) {
      if (modalType === 'import') return;

      const nodes = getNodes(); // 获取节点数据
      const edges = getEdges(); // 获取连接线数据

      // 设置表单值
      formRef.current?.setFieldsValue({
        nodes: JSON.stringify(nodes, null, 2),
        edges: JSON.stringify(edges, null, 2),
      });
    } else {
      setLoading(false);
      formRef.current?.resetFields();
    }
  };

  /** 复制事件 */
  const handleCopy = (type: 'nodes' | 'edges') => {
    const values = formRef?.current?.getFieldsValue?.();
    const result = copy(values?.[type]);
    if (result) message.success('复制成功');
    else message.error('复制失败');
  };

  /** 从本地缓存导入 */
  const handleLocalImport = () => {
    const nodes = localStorage.getItem('nodes') || '[]';
    const edges = localStorage.getItem('edges') || '[]';
    formRef.current?.setFieldsValue({
      nodes: JSON.stringify(JSON.parse(nodes), null, 2),
      edges: JSON.stringify(JSON.parse(edges), null, 2),
    });
  };

  /** 导出到本地缓存 */
  const handleLocalExport = () => {
    const values = formRef?.current?.getFieldsValue?.();
    localStorage.setItem('nodes', values?.nodes);
    localStorage.setItem('edges', values?.edges);
  };

  /** 从文件导入 */
  const handleFileImport = (options: UploadRequestOption) => {
    const { file, filename } = options;
    setLoading(() => true);
    console.log('handleCustomUpload', options);

    // 创建 FileReader 实例
    const reader = new FileReader();

    // 绑定加载完成方法
    reader.onload = (event) => {
      try {
        const { nodes, edges } = JSON.parse(event?.target?.result as string);
        formRef.current?.setFieldsValue({
          nodes: JSON.stringify(nodes, null, 2),
          edges: JSON.stringify(edges, null, 2),
        });
      } catch (error) {
        console.error('JSON解析错误:', error);
        message.error(`${filename} 不是有效的JSON文件`);
      } finally {
        setLoading(() => false);
      }
    };

    // 绑定加载失败方法
    reader.onerror = () => {
      message.error(`${filename} 文件读取失败`);
      setLoading(() => false);
    };

    // 读取文件
    reader.readAsText(file as any);
  };

  /** 导出到文件 */
  const handleFileExport = () => {
    const values = formRef?.current?.getFieldsValue?.();
    const text = JSON.stringify({
      nodes: JSON.parse(values?.nodes || '[]'),
      edges: JSON.parse(values?.edges || '[]'),
    });

    setLoading(() => true);
    textToJsonAndDownloadUtil(text, 'tuopu');
    setLoading(() => false);
  };

  /** 确定事件 */
  const handleOk = () => {
    handleCancel();
    const values = formRef?.current?.getFieldsValue?.();
    const nodes = JSON.parse(values?.nodes || '[]');
    const edges = JSON.parse(values?.edges || '[]');
    setNodes(nodes);
    setEdges(edges);
    fitView();
  };

  useImperativeHandle(ref, () => ({
    open: (type: ModalType) => {
      setModalType(type);
    },
  }));

  return (
    <Modal
      open={modalType !== ''}
      title={modalType === 'import' ? '导入' : '导出'}
      footer={null}
      destroyOnClose={true}
      maskClosable={false}
      onCancel={handleCancel}
      wrapClassName="custom-project-modal"
      afterOpenChange={handleAfterOpenChange}
    >
      <Form ref={formRef}>
        <div className="class-project-modal-content">
          <div className="class-project-modal-content-item">
            <div className="class-project-modal-content-item-title">
              <span>节点列表</span>
              <span className="iconfont" onClick={() => handleCopy('nodes')}>
                &#xe8c9;
              </span>
            </div>

            <Form.Item name={'nodes'} noStyle>
              <Input.TextArea rows={6} />
            </Form.Item>
          </div>

          <div className="class-project-modal-content-item">
            <div className="class-project-modal-content-item-title">
              <span>连接线列表</span>
              <span className="iconfont" onClick={() => handleCopy('edges')}>
                &#xe8c9;
              </span>
            </div>

            <Form.Item name={'edges'} noStyle>
              <Input.TextArea rows={6} />
            </Form.Item>
          </div>

          {modalType === 'import' && (
            <>
              <div className="class-project-modal-content-btnGroup">
                <Button type="primary" onClick={handleLocalImport}>
                  从本地缓存导入
                </Button>

                <Upload
                  name="file"
                  accept=".json"
                  maxCount={1}
                  showUploadList={false}
                  customRequest={handleFileImport}
                >
                  <Button type="primary" loading={loading}>
                    从文件导入
                  </Button>
                </Upload>
              </div>

              <div className="class-project-modal-content-btn">
                <Button danger block onClick={handleOk}>
                  确定
                </Button>
              </div>
            </>
          )}

          {modalType === 'export' && (
            <>
              <div className="class-project-modal-content-btnGroup">
                <Button type="primary" onClick={handleLocalExport}>
                  导出到本地缓存
                </Button>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleFileExport}
                >
                  导出到文件
                </Button>
              </div>
            </>
          )}
        </div>
      </Form>
    </Modal>
  );
});

export default CustomImportExportModal;
