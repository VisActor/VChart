import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 64cd376ca77f904af107fe71
 * 验证目的：三层分组柱图的组内间距。
 * 保留条件：xField, yField, seriesField, barGapInGroup, barWidth, paddingInner, bandPadding, label；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'bar',
      data: [
        {
          values: [
            {
              type: 'Category One',
              min: 76,
              max: 100,
              range: 'A',
              type2: 'p',
              color: 'A_p'
            },
            {
              type: 'Category Two',
              min: 56,
              max: 108,
              range: 'A',
              type2: 'p',
              color: 'A_p'
            },
            {
              type: 'Category One',
              min: 56,
              max: 100,
              range: 'B',
              type2: 'p',
              color: 'B_p'
            },
            {
              type: 'Category Two',
              min: 36,
              max: 108,
              range: 'B',
              type2: 'p',
              color: 'B_p'
            },
            {
              type: 'Category One',
              min: 76,
              max: 100,
              range: 'A',
              type2: 'k',
              color: 'A_k'
            },
            {
              type: 'Category Two',
              min: 56,
              max: 108,
              range: 'A',
              type2: 'k',
              color: 'A_k'
            },
            {
              type: 'Category One',
              min: 56,
              max: 100,
              range: 'B',
              type2: 'k',
              color: 'B_k'
            },
            {
              type: 'Category Two',
              min: 36,
              max: 108,
              range: 'B',
              type2: 'k',
              color: 'B_k'
            }
          ]
        }
      ],
      xField: ['type', 'range', 'type2'],
      yField: 'min',
      seriesField: 'color',
      barGapInGroup: [0, 5],
      barWidth: 20,
      paddingInner: [0.6, 0.6, 0.6],
      bandPadding: [0.6, 0.6, 0.6],
      label: {
        position: 'bothEnd'
      }
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
