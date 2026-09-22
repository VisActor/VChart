import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 649d7eed52a1e9eec95f9e7c
 * 验证目的：渐变柱形与圆角。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，源中附带的 hover/select 配置不计为交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'bar',
      data: [
        {
          id: 'data',
          values: [
            {
              x: 'Mon',
              y: 100,
              type: 'Sales'
            },
            {
              x: 'Tues',
              y: 66,
              type: 'Sales'
            },
            {
              x: 'Wed',
              y: 95,
              type: 'Sales'
            },
            {
              x: 'Thus',
              y: 52,
              type: 'Sales'
            },
            {
              x: 'Fri',
              y: 68,
              type: 'Sales'
            },
            {
              x: 'Sat',
              y: 52,
              type: 'Sales'
            },
            {
              x: 'sun',
              y: 48,
              type: 'Sales'
            },
            {
              x: 'Mon',
              y: 43,
              type: 'Profit'
            },
            {
              x: 'Tues',
              y: 80,
              type: 'Profit'
            },
            {
              x: 'Wed',
              y: 68,
              type: 'Profit'
            },
            {
              x: 'Thus',
              y: 40,
              type: 'Profit'
            },
            {
              x: 'Fri',
              y: 53,
              type: 'Profit'
            },
            {
              x: 'Sat',
              y: 72,
              type: 'Profit'
            },
            {
              x: 'sun',
              y: 71,
              type: 'Profit'
            }
          ]
        }
      ],
      xField: ['x', 'type'],
      yField: 'y',
      seriesField: 'type',
      bar: {
        style: {
          cornerRadius: 10,
          fill: {
            gradient: 'linear',
            x0: 0.5,
            y0: 0,
            x1: 0.5,
            y1: 1,
            stops: [
              {
                offset: 0,
                color: '#86DF6C'
              },
              {
                offset: 1,
                color: '#468DFF'
              }
            ]
          }
        },
        state: {
          selected: {
            stroke: '#000',
            lineWidth: 1
          }
        }
      },
      axes: [
        {
          orient: 'bottom',
          domainLine: {
            visible: false
          },
          bandPadding: 0,
          paddingInner: 0.1
        },
        {
          orient: 'left',
          grid: {
            visible: false
          },
          tick: {
            visible: true,
            tickCount: 3
          },
          domainLine: {
            visible: false
          }
        }
      ]
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
