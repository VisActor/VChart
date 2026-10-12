import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f0152a1e9eec95f9eb2
 * 验证目的：转化漏斗的转化标签与外侧标签。
 * 保留条件：categoryField, valueField, isTransform, isCone, title, label, transformLabel, outerLabel, legends；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'funnel',
      categoryField: 'name',
      valueField: 'value',
      isTransform: true,
      isCone: false,
      data: [
        {
          id: 'funnel',
          values: [
            {
              value: 5676,
              name: 'Sent'
            },
            {
              value: 3872,
              name: 'Viewed'
            },
            {
              value: 1668,
              name: 'Clicked'
            },
            {
              value: 610,
              name: 'Add to Cart'
            },
            {
              value: 565,
              name: 'Purchased'
            }
          ]
        }
      ],
      title: {
        visible: true,
        text: 'Percentage of the customers have dropped from the sales process'
      },
      label: {
        visible: true
      },
      transformLabel: {
        visible: true
      },
      outerLabel: {
        position: 'right',
        visible: true
      },
      legends: {
        visible: true,
        orient: 'top'
      }
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
