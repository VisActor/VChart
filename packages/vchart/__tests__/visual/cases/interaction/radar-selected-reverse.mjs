import { verifySpec, seriesGraphicCenter } from '../../helpers.mjs';
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
    // 对实际图元执行来源动作，不靠固定等待冒充动作完成。
    const p = await seriesGraphicCenter(page, 'point');
    await page.mouse.click(p.x, p.y);
  },
  async verify(page) {
    // 配置、状态及实际过滤结果须满足场景目的；动作未生效必须失败。
    await verifySpec(page, this.createSpec());
    await page.waitForFunction(() => {
      const all = window.__visualChart.getStage().findAll(g => g.currentStates?.includes('selected'), true);
      return all.length > 0;
    });
    await page.waitForFunction(
      () => window.__visualChart.getStage().findAll(g => g.currentStates?.includes('selected_reverse'), true).length > 0
    );
  }
};
