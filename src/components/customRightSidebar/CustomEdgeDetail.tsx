import { EDGE_TYPES } from '@/global';
import { useReactFlow } from '@xyflow/react';
import { Input, InputNumber, Select } from 'antd';
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
    options: EDGE_TYPES,
  },
  {
    type: 'vertices',
    name: ['data', 'vertices'],
    label: '拐点 - vertices',
    disabled: false,
  },
] satisfies DetailColumns[];

/** 右侧侧边栏-连接线详情 */
const CustomEdgeDetail = ({ edgeId }: { edgeId: string }) => {
  const { getEdge, updateEdge } = useReactFlow();

  const edge = getEdge(edgeId); // 获取连接线数据

  /** 节点数据变化事件 */
  const handleChange = (value: any, item: DetailColumns) => {
    const { name } = item;
    set(edge || {}, name, value); // 设置节点数据
    updateEdge(edgeId, edge || {}); // 更新节点数据
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

            {type === 'vertices' && (
              <div className="custom-right-sidebar-item-vertices-container">
                {value?.map((sub: VerticesType, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className="custom-right-sidebar-item-vertices"
                    >
                      <div className="custom-right-sidebar-item-vertices">
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
                      <div>
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
            )}
          </div>
        );
      })}
    </>
  );
};

export default CustomEdgeDetail;
