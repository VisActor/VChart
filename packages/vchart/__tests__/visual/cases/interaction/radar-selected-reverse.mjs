import { interactionTarget, interactionFrame, seriesStates } from '../../interaction-helpers.mjs';
import { verifySpec } from '../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03d3
 * 验证目的：关闭悬停后雷达点选中与反向状态。
 * 保留条件：源数据、配置和录制动作类型；按本地图元定位替代旧宿主坐标。
 * 覆盖边界：只验证本文件指定的动作与结果，不宣称重放全部录制子例。
 */
export default {
  createSpec() {
    // 每次返回独立的源配置与固定数据。
    return {
      type: 'radar',
      data: {
        id: 'radar',
        values: [
          {
            theta: '0',
            type: 'A',
            r: '873'
          },
          {
            theta: '1',
            type: 'A',
            r: '713'
          },
          {
            theta: '2',
            type: 'A',
            r: '742'
          },
          {
            theta: '3',
            type: 'A',
            r: '861'
          },
          {
            theta: '4',
            type: 'A',
            r: '815'
          },
          {
            theta: '5',
            type: 'A',
            r: '660'
          },
          {
            theta: '6',
            type: 'A',
            r: '795'
          },
          {
            theta: '7',
            type: 'A',
            r: '722'
          },
          {
            theta: '8',
            type: 'A',
            r: '818'
          },
          {
            theta: '9',
            type: 'A',
            r: '666'
          },
          {
            theta: '0',
            type: 'B',
            r: '896'
          },
          {
            theta: '1',
            type: 'B',
            r: '814'
          },
          {
            theta: '2',
            type: 'B',
            r: '856'
          },
          {
            theta: '3',
            type: 'B',
            r: '840'
          },
          {
            theta: '4',
            type: 'B',
            r: '634'
          },
          {
            theta: '5',
            type: 'B',
            r: '616'
          },
          {
            theta: '6',
            type: 'B',
            r: '652'
          },
          {
            theta: '7',
            type: 'B',
            r: '831'
          },
          {
            theta: '8',
            type: 'B',
            r: '614'
          },
          {
            theta: '9',
            type: 'B',
            r: '648'
          }
        ]
      },
      categoryField: 'theta',
      valueField: 'r',
      seriesField: 'type',
      groupBy: 'type',
      hover: false,
      line: {
        style: {
          lineWidth: 8
        },
        state: {
          hover: {
            stroke: 'red'
          },
          selected: {
            lineWidth: 10
          },
          selected_reverse: {
            stroke: '#ccc'
          }
        }
      },
      point: {
        state: {
          hover: {
            fill: 'red'
          },
          selected: {
            fill: 'yellow'
          },
          selected_reverse: {
            fill: 'blue'
          }
        }
      },
      startAngle: 90,
      tooltip: {
        transitionDuration: 0
      },
      axes: [
        {
          orient: 'angle',
          domainLine: {
            visible: true,
            smooth: false
          },
          tick: {
            visible: true
          },
          grid: {
            visible: true
          },
          label: {
            visible: true
          }
        },
        {
          orient: 'radius',
          label: {
            visible: true
          },
          domainLine: {
            visible: true,
            smooth: false
          },
          tick: {
            visible: true
          },
          grid: {
            visible: true,
            smooth: false,
            style: {
              stroke: 'red'
            }
          }
        }
      ]
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
      { count: 2, state: 'selected', reverse: true }
    );
  }
};
