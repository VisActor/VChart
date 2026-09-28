import { verifySpec, seriesGraphicCenter } from '../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03d5
 * 验证目的：关闭悬停后玫瑰扇区选中。
 * 保留条件：源数据、配置和录制动作类型；按本地图元定位替代旧宿主坐标。
 * 覆盖边界：只验证本文件指定的动作与结果，不宣称重放全部录制子例。
 */
export default {
  createSpec() {
    // 每次返回独立的源配置与固定数据。
    return {
      type: 'rose',
      data: [
        {
          id: 'id0',
          values: [
            {
              value: '886',
              type: 'A',
              stack: 'stack0'
            },
            {
              value: '856',
              type: 'B',
              stack: 'stack1'
            },
            {
              value: '839',
              type: 'C',
              stack: 'stack2'
            },
            {
              value: '755',
              type: 'D',
              stack: 'stack3'
            },
            {
              value: '797',
              type: 'E',
              stack: 'stack4'
            }
          ]
        }
      ],
      radius: 0.8,
      categoryField: 'type',
      valueField: 'value',
      seriesField: 'stack',
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
          grid: {
            visible: true,
            smooth: false
          },
          domainLine: {
            visible: true,
            smooth: false
          },
          tick: {
            visible: true
          }
        }
      ],
      hover: false,
      rose: {
        state: {
          hover: {
            fill: 'red'
          },
          selected: {
            stroke: '#000',
            lineWidth: 4
          }
        }
      }
    };
  },
  async exercise(page) {
    // 对实际图元执行来源动作，不靠固定等待冒充动作完成。
    const p = await seriesGraphicCenter(page, 'rose');
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
