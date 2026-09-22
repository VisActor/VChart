import { verifySpec, verifyRendered } from '../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03c1
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：散点与面积图分别按数据过滤更新状态。
 * 保留条件：双系列、面积连续零值、两次 updateState 及 datumKeys/level。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：包含原始状态更新动作；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'common',
      series: [
        {
          type: 'scatter',
          data: {
            id: 'data1',
            values: [
              {
                x: 1,
                y: 80
              },
              {
                x: 2,
                y: 10
              },
              {
                x: 3,
                y: 10
              },
              {
                x: 4,
                y: 20
              }
            ]
          },
          xField: 'x',
          yField: 'y',
          point: {
            state: {
              ddd1: {
                size: 30
              },
              hover: {
                fill: 'red'
              }
            }
          }
        },
        {
          type: 'area',
          data: {
            id: 'data2',
            values: [
              {
                x: 1,
                y: 70
              },
              {
                x: 2,
                y: 0
              },
              {
                x: 3,
                y: 0
              },
              {
                x: 4,
                y: 10
              }
            ]
          },
          xField: 'x',
          yField: 'y',
          area: {
            state: {
              ddd2: {
                fill: 'blue'
              },
              hover: {
                fill: 'red'
              }
            }
          }
        }
      ],
      axes: [
        {
          orient: 'left'
        },
        {
          orient: 'bottom',
          type: 'band'
        }
      ]
    };
  },
  async exercise(page) {
    // 按来源顺序调用状态更新；最终实际图元由 verify 检查。
    await page.evaluate(
      actions => {
        for (const action of actions) window.__visualChart.updateState(...action.args);
      },
      [
        {
          method: 'updateState',
          args: [
            {
              ddd1: {
                filter: { datumKeys: ['x', 'y'], datums: [{ x: 1, y: 80 }] },
                level: 6
              }
            }
          ]
        },
        {
          method: 'updateState',
          args: [
            {
              ddd2: {
                filter: { datumKeys: ['x', 'y'], datums: [{ x: 1, y: 70 }] },
                level: 6
              }
            }
          ]
        }
      ]
    );
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
    await page.evaluate(() => {
      const series = window.__visualChart.getChart().getAllSeries();
      if (series.length !== 2 || series[0].type !== 'scatter' || series[1].type !== 'area')
        throw new Error('原始散点与面积系列关联改变');
      const points = series[0].getSeriesMark().getGraphics();
      const selected = points.filter(g => g.currentStates?.includes('ddd1'));
      if (
        selected.length !== 1 ||
        selected[0].context.data[0].x !== 1 ||
        selected[0].context.data[0].y !== 80 ||
        selected[0].attribute.size !== 30
      )
        throw new Error('ddd1 未精确命中 x=1、y=80 的散点');
      if (points.some(g => g !== selected[0] && g.attribute.size === 30)) throw new Error('ddd1 错误作用于其他散点');
      // 只要求包含目标数据的面积图元取得状态，不约束图元数量或数据排列。
      const areas = series[1].getSeriesMark().getGraphics();
      if (
        !areas.some(
          g =>
            g.context.data.some(d => d.x === 1 && d.y === 70) &&
            g.currentStates?.includes('ddd2') &&
            g.attribute.fill === 'blue'
        )
      )
        throw new Error('ddd2 未作用于包含目标数据的面积图元');
    });
  }
};
