import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0460
 * 验证目的：纵向区间面积的上下界及半透明填充。
 * 保留条件：源数据、数组顺序、字段关联、回调及系列组合。
 * 迁移说明：仅适配宿主和已记录的通用文字；不修改原始数值。
 * 覆盖边界：仅验证静态最终状态，不把交互或动画配置视为行为已覆盖。
 */
export default {
  createSpec() {
    // 每次重建独立源配置，保留确定性计算和回调。
    const spec = {
      type: 'rangeArea',
      data: [
        {
          id: 'areaData',
          values: [
            { type: 'Category A', min: 76, max: 100 },
            { type: 'Category B', min: 56, max: 108 },
            { type: 'Category C', min: 38, max: 129 },
            { type: 'Category D', min: 58, max: 155 },
            { type: 'Category E', min: 45, max: 120 },
            { type: 'Category F', min: 23, max: 99 },
            { type: 'Category G', min: 18, max: 56 },
            { type: 'Category H', min: 18, max: 34 }
          ]
        }
      ],
      xField: 'type',
      yField: ['min', 'max'],
      minField: 'min',
      maxField: 'max',
      area: { style: { fillOpacity: 0.15 } },
      axes: [
        { orient: 'left', label: { visible: true }, type: 'linear' },
        { orient: 'bottom', type: 'band' }
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
