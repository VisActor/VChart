import { interactionTarget, interactionFrame, seriesStates } from '../../interaction-helpers.mjs';
import { verifySpec } from '../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0330
 * 验证目的：面积图数据点和面积区域分别点击后的选择状态。
 * 保留条件：源数据、配置和录制动作类型；按本地图元定位替代旧宿主坐标。
 * 覆盖边界：只验证本文件指定的动作与结果，不宣称重放全部录制子例。
 */
export default {
  createSpec() {
    // 每次返回独立的源配置与固定数据。
    return {
      type: 'common',
      series: [
        {
          type: 'area',
          data: {
            id: 'data1',
            values: [
              {
                x: 1,
                y: 80
              },
              {
                x: 2,
                y: 40
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
          hover: true,
          select: true,
          point: {
            state: {
              normal: {
                fill: 'yellow',
                size: 30
              },
              selected: {
                fill: 'pink'
              }
            }
          },
          area: {
            interactive: true,
            state: {
              normal: {
                cursor: 'pointer',
                fill: 'grey'
              },
              selected: {
                fill: 'pink'
              }
            }
          },
          line: {
            state: {
              normal: {
                lineWidth: 20
              },
              selected: {
                stroke: 'pink'
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
      ],
      tooltip: {
        transitionDuration: 0
      }
    };
  },
  async exercise(page) {
    // 旧坐标缺少宿主尺寸；按源配置的不同图元重建动作，不宣称逐像素重放历史轨迹。
    const observations = [];
    for (const name of ['point', 'area']) {
      await page.mouse.move(950, 750);
      await page.evaluate(() => {
        window.__visualChart.clearSelected();
        window.__visualChart.clearHovered();
      });
      const target = await interactionTarget(page, name);
      await page.mouse.click(target.x, target.y);
      await interactionFrame(page);
      observations.push({ target: name, marks: await seriesStates(page) });
    }
    await page.evaluate(observations => {
      window.__stateObservations = observations;
    }, observations);
  },
  async verify(page) {
    // 每一步都必须命中相应图元，并验证源要求的反向状态；抑制动作后不能通过。
    await verifySpec(page, this.createSpec());
    await page.evaluate(
      ({ count, state, reverse }) => {
        const rows = window.__stateObservations;
        if (!rows || rows.length !== count) throw new Error('缺少多目标交互结果');
        for (const row of rows) {
          if (!row.marks.some(m => m.name === row.target && m.states[state] > 0))
            throw new Error('目标图元未进入状态：' + row.target);
          if (reverse && !row.marks.some(m => m.states[state + '_reverse'] > 0))
            throw new Error('缺少反向状态：' + row.target);
        }
        const actual = window.__visualChart.getStage().findAll(g => g.currentStates?.includes(state), true);
        if (!actual.length) throw new Error('最终交互状态未保留');
      },
      { count: 2, state: 'selected', reverse: false }
    );
  }
};
