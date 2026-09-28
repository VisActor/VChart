import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 64afb5dc2a6e789306c890fa
 * 验证目的：时间轴 layers 的 tickStep 与混合范围数据。
 * 保留条件：源数据、数组顺序、字段关联、回调及系列组合。
 * 迁移说明：仅适配宿主和已记录的通用文字；不修改原始数值。
 * 覆盖边界：仅验证静态最终状态，不把交互或动画配置视为行为已覆盖。
 */
export default {
  createSpec() {
    // 每次重建独立源配置，保留确定性计算和回调。
    const spec = {
      type: 'rangeColumn',
      data: [
        {
          id: 'data0',
          values: [
            { type: 'Category A', min: 1224836868000, max: 1224923268000 },
            { type: 'Category B', min: 1225009668000, max: 1225182468000 },
            { type: 'Category C', min: 1225182468000, max: 1225268868000 },
            { type: 'Category D', min: 58, max: 155 },
            { type: 'Category E', min: 45, max: 120 },
            { type: 'Category F', min: 23, max: 99 },
            { type: 'Category G', min: 18, max: 56 },
            { type: 'Category H', min: 18, max: 34 }
          ]
        }
      ],
      direction: 'horizontal',
      yField: 'type',
      xField: ['min', 'max'],
      label: { visible: false, position: 'bothEnd' },
      axes: [
        {
          orient: 'bottom',
          type: 'time',
          range: { min: 1224836868000, max: 1240475268000 },
          layers: [{ tickStep: 28800, timeFormat: '%Y%m%d' }]
        }
      ]
    };
    return spec;
  },
  async verify(page) {
    // 核对完整输入与有效绘制；目标分支另外经过配置变异验证。
    await verifySourceSpec(page);
    await verifyRendered(page);
  }
};
