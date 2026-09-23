import { interactionTarget, interactionFrame, seriesStates } from '../../interaction-helpers.mjs';
import { verifySpec } from '../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03ce
 * 验证目的：折线点悬停与反向弱化。
 * 保留条件：源数据、配置和录制动作类型；按本地图元定位替代旧宿主坐标。
 * 覆盖边界：只验证本文件指定的动作与结果，不宣称重放全部录制子例。
 */
export default {
  createSpec() {
    // 每次返回独立的源配置与固定数据。
    return {
      type: 'line',
      data: [
        {
          id: 'id0',
          values: [
            {
              x: '0',
              type: 'A',
              y: '898'
            },
            {
              x: '1',
              type: 'A',
              y: '813'
            },
            {
              x: '2',
              type: 'A',
              y: '696'
            },
            {
              x: '3',
              type: 'A',
              y: '799'
            },
            {
              x: '4',
              type: 'A',
              y: '846'
            },
            {
              x: '5',
              type: 'A',
              y: '847'
            },
            {
              x: '6',
              type: 'A',
              y: '609'
            },
            {
              x: '7',
              type: 'A',
              y: '742'
            },
            {
              x: '8',
              type: 'A',
              y: '650'
            },
            {
              x: '9',
              type: 'A',
              y: '712'
            },
            {
              x: '0',
              type: 'B',
              y: '880'
            },
            {
              x: '1',
              type: 'B',
              y: '814'
            },
            {
              x: '2',
              type: 'B',
              y: '746'
            },
            {
              x: '3',
              type: 'B',
              y: '846'
            },
            {
              x: '4',
              type: 'B',
              y: '760'
            },
            {
              x: '5',
              type: 'B',
              y: '643'
            },
            {
              x: '6',
              type: 'B',
              y: '881'
            },
            {
              x: '7',
              type: 'B',
              y: '836'
            },
            {
              x: '8',
              type: 'B',
              y: '715'
            },
            {
              x: '9',
              type: 'B',
              y: '647'
            }
          ]
        }
      ],
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      axes: [
        {
          orient: 'left',
          range: {
            min: 500
          },
          expand: {
            max: 0.2
          },
          tickCount: 6,
          forceTickCount: 6,
          visible: false
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          }
        }
      ],
      line: {
        state: {
          hover: {
            lineWidth: 4
          },
          selected: {
            stroke: 'red'
          },
          hover_reverse: {
            stroke: '#ddd'
          }
        }
      },
      tooltip: {
        transitionDuration: 0
      },
      point: {
        state: {
          hover: {
            fill: 'red'
          },
          selected: {
            fill: 'yellow'
          },
          hover_reverse: {
            fill: '#ddd'
          }
        }
      }
    };
  },
  async exercise(page) {
    // 旧坐标缺少宿主尺寸；按源配置的不同图元重建动作，不宣称逐像素重放历史轨迹。
    const observations = [];
    for (const name of ['point', 'line']) {
      await page.mouse.move(950, 750);
      await page.evaluate(() => {
        window.__visualChart.clearSelected();
        window.__visualChart.clearHovered();
      });
      const target = await interactionTarget(page, name);
      await page.mouse.move(target.x, target.y);
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
      { count: 2, state: 'hover', reverse: true }
    );
  }
};
