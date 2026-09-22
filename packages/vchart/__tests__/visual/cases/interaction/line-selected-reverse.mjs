import { verifySpec, seriesGraphicCenter } from '../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03cf
 * 验证目的：关闭悬停后折线点选中与反向状态。
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
      hover: false,
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
            strokeWidth: 4
          },
          selected: {
            stroke: 'yellow'
          },
          selected_reverse: {
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
          selected_reverse: {
            fill: '#ddd'
          }
        }
      }
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
