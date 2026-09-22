import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0461
 * 验证目的：横向区间面积图的上下界。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。

    const spec = {
      type: 'rangeArea',
      data: [
        {
          id: 'areaData',
          values: [
            { type: 'Category 1', min: 76, max: 100 },
            { type: 'Category 2', min: 56, max: 108 },
            { type: 'Category 3', min: 38, max: 129 },
            { type: 'Category 4', min: 58, max: 155 },
            { type: 'Category 5', min: 45, max: 120 },
            { type: 'Category 6', min: 23, max: 99 },
            { type: 'Category 7', min: 18, max: 56 },
            { type: 'Category 8', min: 18, max: 34 }
          ]
        }
      ],
      yField: 'type',
      xField: ['min', 'max'],
      minField: 'min',
      maxField: 'max',

      direction: 'horizontal',

      axes: [
        {
          orient: 'bottom',
          label: {
            visible: true
          },
          type: 'linear'
        },
        { orient: 'left', type: 'band' }
      ]
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
