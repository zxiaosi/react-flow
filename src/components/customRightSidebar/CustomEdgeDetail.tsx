import { EDGE_TYPES, EDGE_TYPES_OPTIONS } from '@/global';
import { useReactFlow } from '@xyflow/react';
import { Button, Input, InputNumber, Select } from 'antd';
import { get, set } from 'lodash';
import './index.less';

/** 配置 */
const columns = [
  { type: 'text', name: 'id', label: '唯一ID - id', disabled: true },
  {
    type: 'text',
    name: 'source',
    label: '起始节点 - source',
    disabled: false,
  },
  {
    type: 'text',
    name: 'target',
    label: '目标节点  - target',
    disabled: false,
  },
  {
    type: 'select',
    name: 'type',
    label: '类型 - type',
    disabled: false,
    options: EDGE_TYPES_OPTIONS,
  },
  {
    type: 'list',
    name: ['data', 'vertices'],
    label: '拐点 - vertices',
    disabled: false,
  },
] satisfies DetailColumns[];

/** 右侧侧边栏-连接线详情 */
const CustomEdgeDetail = ({ edgeId }: { edgeId: string }) => {
  const { getEdge, updateEdge, getNode } = useReactFlow();

  const edge = getEdge(edgeId); // 获取连接线数据

  /** 节点数据变化事件 */
  const handleChange = (value: any, item: DetailColumns) => {
    const { name } = item;
    set(edge || {}, name, value); // 设置节点数据
    updateEdge(edgeId, edge || {}); // 更新节点数据
  };

  /** 添加连接线拐点 */
  const handleAddVertice = ({ name }: DetailColumns) => {
    const { source = '', target = '' } = edge || {};
    const { x: sourceX = 0, y: sourceY = 0 } = getNode(source)?.position || {}; // 获取起始节点数据
    const { x: targetX = 0, y: targetY = 0 } = getNode(target)?.position || {}; // 获取目标节点数据
    const position = {
      x: (sourceX - targetX) / 2,
      y: (sourceY - targetY) / 2,
    };

    const vertices: VerticesType[] = get(edge || {}, name) || [];
    vertices.push(position);
    set(edge || {}, name, vertices);
    updateEdge(edgeId, edge || {}); // 更新连接线数据
  };

  /** 删除连接线拐点 */
  const handleRemoveVertice = ({ name }: DetailColumns, index: number) => {
    const vertices = get(edge || {}, name) || [];
    vertices.splice(index, 1);
    set(edge || {}, name, vertices);
    updateEdge(edgeId, edge || {}); // 更新连接线数据
  };

  return (
    <>
      {columns.map((item) => {
        const { type, name, label, disabled, options } = item;
        const value = get(edge || {}, name);

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

            {type === 'select' && (
              <Select
                value={value}
                onChange={(e) => handleChange(e, item)}
                options={options}
                disabled={disabled}
              />
            )}

            {type === 'list' && (
              <div className="custom-right-sidebar-item-list-container">
                <div className="custom-right-sidebar-item-list">
                  {value?.map((sub: VerticesType, idx: number) => {
                    return (
                      <div
                        key={idx}
                        className="custom-right-sidebar-item-list-subItem"
                      >
                        <div className="custom-right-sidebar-item-list-subItem-title">
                          <span>{idx + 1}</span>
                          <span
                            className="iconfont"
                            onClick={() => handleRemoveVertice(item, idx)}
                          >
                            &#xe644;
                          </span>
                        </div>

                        <div className="custom-right-sidebar-item-list-subItem-column">
                          <span>X</span>
                          <InputNumber
                            size="small"
                            changeOnWheel={true}
                            value={sub?.x}
                            onChange={(e) =>
                              handleChange(e, {
                                ...item,
                                name: [...name, idx, 'x'],
                              })
                            }
                          />
                        </div>
                        <div className="custom-right-sidebar-item-list-subItem-column">
                          <span>Y</span>
                          <InputNumber
                            size="small"
                            changeOnWheel={true}
                            value={sub?.y}
                            onChange={(e) =>
                              handleChange(e, {
                                ...item,
                                name: [...name, idx, 'y'],
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
                  onClick={() => handleAddVertice(item)}
                  disabled={!Object.keys(EDGE_TYPES).includes(edge?.type || '')}
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

export default CustomEdgeDetail;
