import { HANDLE_POSITIONS, HANDLE_TYPES } from '@/global';
import { useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { Button, Input, InputNumber, Select } from 'antd';
import { get, set } from 'lodash';
import './index.less';

/** 唯一ID */
let uniqueId = 0;

/** 配置 */
const columns = [
  { type: 'text', name: 'id', label: '唯一ID - id', disabled: true },
  {
    type: 'text',
    name: ['data', 'label'],
    label: '文案 - data.label',
    disabled: false,
  },
  {
    type: 'number',
    name: 'width',
    label: '宽 - style.width',
    disabled: false,
  },
  {
    type: 'number',
    name: 'height',
    label: '高 - style.height',
    disabled: false,
  },
  {
    type: 'number',
    name: ['position', 'x'],
    label: 'X坐标 - position.x',
    disabled: false,
  },
  {
    type: 'number',
    name: ['position', 'y'],
    label: 'Y坐标 - position.y',
    disabled: false,
  },
  {
    type: 'handles',
    name: ['data', 'handles'],
    label: '连接桩 - data.handles',
    disabled: false,
  },
] satisfies DetailColumns[];

/** 右侧侧边栏-节点详情 */
const CustomNodeDetail = ({ nodeId }: { nodeId: string }) => {
  const { getNode, updateNode } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const node = getNode(nodeId); // 获取节点数据
  if (!node?.width) node!.width = node?.measured?.width;
  if (!node?.height) node!.height = node?.measured?.height;

  /** 节点数据变化事件 */
  const handleChange = (value: any, item: DetailColumns) => {
    const { name } = item;
    set(node || {}, name, value); // 设置节点数据
    updateNode(nodeId, node || {}); // 更新节点数据
    if (name?.includes('handles')) updateNodeInternals(nodeId); // 更新节点内部数据(动态增加连接桩用)
  };

  /** 添加连接桩 */
  const handleAddHandle = ({ name }: DetailColumns) => {
    const handles: HandleType[] = get(node || {}, name) || [];
    handles.push({ id: `${uniqueId++}`, type: 'source', position: 'Left' });
    set(node || {}, name, handles);
    updateNode(nodeId, node || {}); // 更新节点数据
    updateNodeInternals(nodeId); // 更新节点内部数据(动态增加连接桩用)
  };

  /** 删除连接桩 */
  const handleRemoveHandle = ({ name }: DetailColumns, index: number) => {
    const handles = get(node || {}, name) || [];
    handles.splice(index, 1);
    set(node || {}, name, handles);
    updateNode(nodeId, node || {}); // 更新节点数据
    updateNodeInternals(nodeId); // 更新节点内部数据(动态增加连接桩用)
  };

  return (
    <>
      {columns.map((item) => {
        const { type, name, label, disabled } = item;
        const value = get(node || {}, name);

        return (
          <div key={label} className="custom-right-sidebar-item">
            <div className="custom-right-sidebar-item-label">{label}</div>
            {type === 'text' && (
              <Input
                disabled={disabled}
                value={value}
                onChange={(e) => handleChange(e.target.value, item)}
              />
            )}

            {type === 'number' && (
              <InputNumber
                changeOnWheel={true}
                disabled={disabled}
                value={value}
                onChange={(e) => handleChange(e, item)}
              />
            )}

            {type === 'handles' && (
              <div className="custom-right-sidebar-item-handles-container">
                <div className="custom-right-sidebar-item-handles">
                  {value?.map((handle: HandleType, idx: number) => {
                    const { id, type, position } = handle;
                    return (
                      <div
                        key={idx}
                        className="custom-right-sidebar-item-handle"
                      >
                        <div className="custom-right-sidebar-item-handle-title">
                          <span>{idx + 1}</span>
                          <span onClick={() => handleRemoveHandle(item, idx)}>
                            关闭
                          </span>
                        </div>

                        <div className="custom-right-sidebar-item-handle-id">
                          <div>ID</div>

                          <Input
                            size="small"
                            value={id}
                            disabled
                            prefix={`${nodeId} - `}
                          />
                        </div>

                        <div className="custom-right-sidebar-item-handle-type">
                          <div>类型</div>

                          <Select
                            size="small"
                            value={type}
                            options={HANDLE_TYPES}
                            onChange={(e) =>
                              handleChange(e, {
                                ...item,
                                name: [...name, idx, 'type'],
                              })
                            }
                          />
                        </div>

                        <div className="custom-right-sidebar-item-handle-position">
                          <div>方向</div>

                          <Select
                            size="small"
                            value={position}
                            options={HANDLE_POSITIONS}
                            onChange={(e) =>
                              handleChange(e, {
                                ...item,
                                name: [...name, idx, 'position'],
                              })
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  size="small"
                  type="primary"
                  className="custom-right-sidebar-item-add-handle"
                  onClick={() => handleAddHandle(item)}
                >
                  添加连接桩
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default CustomNodeDetail;
