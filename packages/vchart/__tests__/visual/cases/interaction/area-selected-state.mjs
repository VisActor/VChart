import { verifySpec, seriesGraphicCenter } from '../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0330
 * 验证目的：面积图数据点点击选中。
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
  }
};
