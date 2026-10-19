import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 649d7ee452a1e9eec95f9e6a, 646745e9cb5fa8011f4e0462
 * 迁移边界：合并两个来源相同的静态范围带与平均线；旧 strokeWidth 与 lineWidth 的 hover 差异未算作交互覆盖。
 * 验证目的：独立数据源的区间面积与平均值折线组合。
 * 保留条件：源数据、数组顺序、字段关联、回调及系列组合。
 * 迁移说明：仅适配宿主和已记录的通用文字；不修改原始数值。
 * 覆盖边界：仅验证静态最终状态，不把交互或动画配置视为行为已覆盖。
 */
export default {
  createSpec() {
    // 每次重建独立源配置，保留确定性计算和回调。
    const spec = {
      type: 'common',
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
        },
        {
          id: 'lineData',
          values: [
            { type: 'Category A', average: 88 },
            { type: 'Category B', average: 82 },
            { type: 'Category C', average: 83.5 },
            { type: 'Category D', average: 106.5 },
            { type: 'Category E', average: 82.5 },
            { type: 'Category F', average: 61 },
            { type: 'Category G', average: 37 },
            { type: 'Category H', average: 26 }
          ]
        }
      ],
      series: [
        {
          type: 'rangeArea',
          dataIndex: 0,
          xField: 'type',
          yField: ['min', 'max'],
          stack: false,
          area: { style: { fillOpacity: 0.15 } }
        },
        {
          type: 'line',
          dataIndex: 1,
          xField: 'type',
          yField: 'average',
          point: { state: { hover: { fillOpacity: 0.5, stroke: 'blue', lineWidth: 2 }, selected: { fill: 'red' } } }
        }
      ],
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
