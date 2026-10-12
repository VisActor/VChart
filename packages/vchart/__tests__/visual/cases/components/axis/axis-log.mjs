import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 64c39cd41cfb041e0fa3384c
 * 验证目的：对数坐标轴的刻度与折线位置。
 * 保留条件：xField, yField, axes；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'line',
      data: [
        {
          values: [
            {
              time: 1,
              a: 0,
              b: 117,
              c: 145
            },
            {
              time: 10,
              a: 1,
              b: 1317,
              c: 2345
            },
            {
              time: 100,
              a: 2,
              b: 2500,
              c: 3100
            },
            {
              time: 1000,
              a: 3,
              b: 7500,
              c: 6100
            },
            {
              time: 10000,
              a: 4,
              b: 7500,
              c: 6100
            },
            {
              time: 100000,
              a: 5,
              b: 7500,
              c: 6100
            },
            {
              time: 1000000,
              a: 6,
              b: 7500,
              c: 6100
            }
          ]
        }
      ],
      xField: 'time',
      yField: 'a',
      axes: [
        {
          orient: 'left',
          type: 'linear'
        },
        {
          orient: 'bottom',
          type: 'log'
        }
      ]
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
