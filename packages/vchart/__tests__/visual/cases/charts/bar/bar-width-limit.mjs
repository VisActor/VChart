import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 66864e5b3160d400b5ccedad
 * 验证目的：柱宽与最大柱宽共同配置。
 * 保留条件：barWidth, barMaxWidth, xField, yField；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'bar',
      barWidth: 50,
      barMaxWidth: 10,
      data: [
        {
          id: 'barData',
          values: [
            {
              month: 'Monday',
              sales: 22
            },
            {
              month: 'Tuesday',
              sales: 13
            },
            {
              month: 'Wednesday',
              sales: 25
            },
            {
              month: 'Thursday',
              sales: 29
            },
            {
              month: 'Friday',
              sales: 38
            }
          ]
        }
      ],
      xField: 'month',
      yField: 'sales'
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
