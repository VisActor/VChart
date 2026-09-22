import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7ef052a1e9eec95f9e85
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：纵向箱线图五数概括与线形须线。
 * 保留条件：六个原始五数集合、shaftShape=line、lineWidth=2。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'boxPlot',
      data: [
        {
          name: 'boxPlot',
          values: [
            {
              x: 'Sub-Saharan Africa',
              y1: 8.72,
              y2: 9.73,
              y3: 10.17,
              y4: 10.51,
              y5: 11.64
            },
            {
              x: 'South Asia',
              y1: 9.4,
              y2: 10.06,
              y3: 10.75,
              y4: 11.56,
              y5: 12.5
            },
            {
              x: 'Middle East & North Africa',
              y1: 9.54,
              y2: 10.6,
              y3: 11.05,
              y4: 11.5,
              y5: 11.92
            },
            {
              x: 'Latin America & Caribbean',
              y1: 8.74,
              y2: 9.46,
              y3: 10.35,
              y4: 10.94,
              y5: 12.21
            },
            {
              x: 'East Asia & Pacific',
              y1: 7.8,
              y2: 8.95,
              y3: 10.18,
              y4: 11.57,
              y5: 13.25
            },
            {
              x: 'Europe & Central Asia',
              y1: 9.52,
              y2: 10.39,
              y3: 10.93,
              y4: 11.69,
              y5: 12.63
            }
          ]
        }
      ],
      xField: 'x',
      minField: 'y1',
      q1Field: 'y2',
      medianField: 'y3',
      q3Field: 'y4',
      maxField: 'y5',
      direction: 'vertical',
      boxPlot: {
        style: {
          shaftShape: 'line',
          lineWidth: 2
        }
      }
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
