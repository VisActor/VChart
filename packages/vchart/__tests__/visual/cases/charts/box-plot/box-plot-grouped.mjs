import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7ef052a1e9eec95f9e87
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：分组箱线图与图例标题及分层轴间距。
 * 保留条件：12 个原始集合、双 xField、group、paddingInner、颜色。
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
              y1: 9.16270124,
              y2: 10.07530816,
              y3: 10.09027907,
              y4: 10.27579542,
              y5: 11.62222959,
              group: 'High income'
            },
            {
              x: 'Sub-Saharan Africa',
              y1: 8.721525214,
              y2: 9.641352839,
              y3: 10.1736233,
              y4: 10.57169914,
              y5: 11.64427467,
              group: 'Low income'
            },
            {
              x: 'South Asia',
              y1: 9.404757278,
              y2: 10.36482449,
              y3: 10.94903493,
              y4: 11.5806383,
              y5: 12.50192084,
              group: 'Low income'
            },
            {
              x: 'South Asia',
              y1: 9.732841997,
              y2: 9.732841997,
              y3: 9.732841997,
              y4: 9.732841997,
              y5: 9.732841997,
              group: 'High income'
            },
            {
              x: 'Middle East & North Africa',
              y1: 9.541951901,
              y2: 10.33719892,
              y3: 10.91206173,
              y4: 11.29821858,
              y5: 11.60653481,
              group: 'Low income'
            },
            {
              x: 'Middle East & North Africa',
              y1: 10.2396509,
              y2: 10.63879995,
              y3: 11.09996104,
              y4: 11.54301107,
              y5: 11.92092709,
              group: 'High income'
            },
            {
              x: 'Latin America & Caribbean',
              y1: 10.14653181,
              y2: 10.32106777,
              y3: 10.45467215,
              y4: 10.45844052,
              y5: 10.6064696,
              group: 'Low income'
            },
            {
              x: 'Latin America & Caribbean',
              y1: 8.743652009,
              y2: 9.413881158,
              y3: 10.16606248,
              y4: 11.00011805,
              y5: 12.20655104,
              group: 'High income'
            },
            {
              x: 'East Asia & Pacific',
              y1: 7.800035977,
              y2: 8.850646235,
              y3: 10.14633178,
              y4: 11.59877618,
              y5: 13.24880824,
              group: 'High income'
            },
            {
              x: 'East Asia & Pacific',
              y1: 8.316035904,
              y2: 9.038602613,
              y3: 10.22954548,
              y4: 10.71782871,
              y5: 12.07411874,
              group: 'Low income'
            },
            {
              x: 'Europe & Central Asia',
              y1: 9.831631935,
              y2: 9.939275167,
              y3: 10.39108655,
              y4: 10.95556656,
              y5: 11.3012157,
              group: 'Low income'
            },
            {
              x: 'Europe & Central Asia',
              y1: 9.522480948,
              y2: 10.43085982,
              y3: 11.06642694,
              y4: 11.73822523,
              y5: 12.62940296,
              group: 'High income'
            }
          ]
        }
      ],
      xField: ['x', 'group'],
      minField: 'y1',
      q1Field: 'y2',
      medianField: 'y3',
      q3Field: 'y4',
      maxField: 'y5',
      seriesField: 'group',
      direction: 'vertical',
      color: ['#62CDFF', '#9E4784'],
      legends: [
        {
          visible: true
        }
      ],
      title: {
        visible: true,
        text: 'Global GDP 2021'
      },
      boxPlot: {
        style: {
          shaftShape: 'line',
          lineWidth: 2
        }
      },
      axes: [
        {
          orient: 'bottom',
          paddingInner: [0.1, 0.4]
        }
      ]
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
