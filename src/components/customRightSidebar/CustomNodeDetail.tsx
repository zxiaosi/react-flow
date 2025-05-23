import { HANDLE_POSITIONS, HANDLE_TYPES, NODE_TYPES } from '@/global';
import { useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { Button, Input, InputNumber, Select } from 'antd';
import { get, omit, set } from 'lodash';
import './index.less';

/** 唯一ID */
let uniqueId = 1;

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
    label: '宽 - width',
    disabled: false,
  },
  {
    type: 'number',
    name: 'height',
    label: '高 - height',
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
    type: 'list',
    name: ['data', 'handles'],
    label: '连接桩 - data.handles',
    disabled: false,
  },
] satisfies DetailColumns[];

/** 右侧侧边栏-节点详情 */
const CustomNodeDetail = ({ nodeId }: { nodeId: string }) => {
  const { getNode, updateNode, setEdges } = useReactFlow();
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
    handles.push({
      id: `handle${uniqueId++}`,
      type: 'source',
      position: 'Left',
    });
    set(node || {}, name, handles);
    updateNode(nodeId, node || {}); // 更新节点数据
    updateNodeInternals(nodeId); // 更新节点内部数据(动态增加连接桩用)
  };

  /** 删除连接桩 */
  const handleRemoveHandle = ({ name }: DetailColumns, index: number) => {
    const handles = get(node || {}, name) || [];
    const removeHandle = handles.splice(index, 1)?.[0] as HandleType;
    set(node || {}, name, handles);
    updateNode(nodeId, node || {}); // 更新节点数据
    updateNodeInternals(nodeId); // 更新节点内部数据(动态增加连接桩用)
    setEdges((edges) => {
      return edges.filter(({ source, target, sourceHandle, targetHandle }) => {
        return ![source, target, sourceHandle, targetHandle].includes(
          removeHandle.id,
        ); // 删除连接线
      });
    });
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

            {type === 'list' && (
              <div className="custom-right-sidebar-item-list-container">
                <div className="custom-right-sidebar-item-list">
                  {value?.map((handle: HandleType, idx: number) => {
                    const { type, position } = handle;
                    return (
                      <div
                        key={idx}
                        className="custom-right-sidebar-item-list-subItem"
                      >
                        <div className="custom-right-sidebar-item-list-subItem-title">
                          <span>{idx + 1}</span>
                          <span
                            className="iconfont"
                            onClick={() => handleRemoveHandle(item, idx)}
                          >
                            &#xe644;
                          </span>
                        </div>

                        <div className="custom-right-sidebar-item-list-subItem-column">
                          <span>类型</span>

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

                        <div className="custom-right-sidebar-item-list-subItem-column">
                          <span>方向</span>

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
                  className="custom-right-sidebar-item-list-add"
                  onClick={() => handleAddHandle(item)}
                  disabled={
                    !Object.keys(
                      omit(NODE_TYPES, ['customGroupNode']),
                    ).includes(node?.type || '')
                  }
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
