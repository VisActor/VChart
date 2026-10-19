import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 655ad0e39ea0da009564283b
 * 验证目的：来源 Tooltip 配置、实际提示内容及移出隐藏。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const data1 = [
      { date: 'Day 1', workload: 7000 },
      { date: 'Day 2', workload: 1000 },
      { date: 'Day 3', workload: 6000 },
      { date: 'Day 4', workload: 4000 },
      { date: 'Day 5', workload: 8000 },
      { date: 'Day 6', workload: 3000 },
      { date: 'Day 7', workload: 9000 },
      { date: 'Day 8', workload: 2000 },
      { date: 'Day 9', workload: 5000 }
    ];
    const spec = {
      type: 'bar',
      padding: { top: 24, right: 48, bottom: 48, left: 48 },
      data: [{ id: 'id0', values: data1 }],
      xField: 'date',
      yField: 'workload',
      axes: [
        {
          orient: 'bottom',
          label: {
            space: 8,
            style: { fill: '#505050', fontFamily: 'PingFang SC', angle: 0 },
            type: 'rich',
            formatMethod: text => {
              return [
                { text: text, fontWeight: 'bold', fontSize: 12, fill: '#3f51b5' },
                { text: '🌞', fill: '#3f51b5' }
              ];
            }
          },
          tick: { visible: false },
          title: {
            visible: true,
            space: 20,
            style: { fill: '#333', fontFamily: 'PingFang SC', fontSize: 14, fontWeight: 'bold' },
            text: {
              type: 'rich',
              text: [
                { text: 'Date', fontWeight: 'bold', fontSize: 25, fill: '#3f51b5' },
                { text: '日期', fontStyle: 'italic', textDecoration: 'underline', fill: '#3f51b5' }
              ]
            }
          }
        },
        {
          orient: 'left',
          label: {
            space: 8,
            style: { fill: '#6F6F6F', fontFamily: 'PingFang SC' },
            formatMethod: label => `${label}K`
          },
          grid: {
            visible: true,
            style: {
              lineDash: [0]
            }
          },
          tick: {
            visible: false
          },
          title: {
            visible: true,
            space: 20,
            text: 'value',
            autoRotate: false,
            style: {
              fill: '#333',
              fontFamily: 'PingFang SC',
              fontSize: 14,
              fontWeight: 'bold',
              textBaseline: 'bottom',
              angle: -90
            }
          }
        }
      ],
      dataZoom: {
        orient: 'bottom',
        showDetail: true,
        middleHandler: {
          visible: true
        },
        backgroundChart: {
          area: {
            style: {
              fill: '#EAEAEA',
              fillOpacity: 0.5
            }
          },
          line: {
            style: {
              stroke: '#EAEAEA',
              lineWidth: 3
            }
          }
        },
        selectedBackgroundChart: {
          area: {
            style: {
              fill: '#EAEAEA'
            }
          },
          line: {
            style: {
              stroke: '#EAEAEA',
              lineWidth: 1
            }
          }
        },
        background: {
          style: {
            fill: '#fff',
            lineWidth: 1,
            stroke: '#EAEAEA'
          }
        },
        selectedBackground: {
          style: {
            fillOpacity: 0.1
          }
        }
      },
      crosshair: {
        xField: {
          visible: true,
          label: {
            visible: false
          }
        },
        yField: {
          visible: false
        }
      },
      tooltip: {
        enterable: true,
        renderMode: 'canvas',
        mark: {
          title: {
            value: {
              type: 'rich',
              text: [
                {
                  text: 'TOOLTIP',
                  fontWeight: 'bold',
                  fill: '#3f51b5'
                },
                {
                  text: '替代方案',
                  fontStyle: 'italic',
                  textDecoration: 'underline',
                  fill: '#3f51b5'
                }
              ]
            }
          }
        }
      },
      bar: {
        style: {
          fill: '#00924F'
        },
        state: {
          hover: {
            fill: '#1664FF'
          }
        }
      },
      title: {
        textType: 'rich',
        text: [
          {
            text: 'RICHTEXT',
            fontWeight: 'bold',
            fontSize: 25,
            fill: '#3f51b5',
            stroke: false
          },
          {
            text: '替代方案',
            fontStyle: 'italic',
            textDecoration: 'underline',
            fill: '#3f51b5',
            stroke: false
          }
        ]
      },
      label: {
        visible: true,
        textType: 'rich',
        formatMethod: text => {
          return [
            {
              text: text + '',
              fontWeight: 'bold',
              fontSize: 12,
              fill: '#3f51b5'
            },
            {
              text: 'K',
              fontStyle: 'italic',
              textDecoration: 'underline',
              fill: '#3f51b5'
            }
          ];
        }
      }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const p = await interactionTarget(page, 'bar');
    await page.mouse.move(p.x, p.y);
    await page.waitForFunction(() => window.__visualChart.getTooltipHandler()?.isTooltipShown());
    const first = await page.evaluate(() => {
      const c = window.__visualChart;
      const texts = c
        .getStage()
        .findAll(g => g.name?.includes('tooltip'), true)
        .flatMap(g => g.findAll?.(g => g.type === 'text' || g.type === 'richtext', true) ?? [])
        .map(g => JSON.stringify(g.attribute.textConfig ?? g.attribute.text));
      return (
        [...document.querySelectorAll('[class*="tooltip"]')]
          .filter(el => el.getBoundingClientRect().width > 0 && getComputedStyle(el).visibility !== 'hidden')
          .map(el => el.textContent)
          .join(' ') + texts.join(' ')
      );
    });
    await page.mouse.move(950, 750);
    await page.waitForFunction(() => !window.__visualChart.getTooltipHandler()?.isTooltipShown());
    await page.mouse.move(p.x, p.y);
    await page.waitForFunction(() => window.__visualChart.getTooltipHandler()?.isTooltipShown());
    await page.evaluate(first => (window.__tooltipText = first), first);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      if (!window.__tooltipText?.trim() || !window.__visualChart.getTooltipHandler()?.isTooltipShown())
        throw Error('提示未显示有效内容或未恢复');
    });
    await page.evaluate(() => {
      if (!window.__tooltipText.includes('TOOLTIP') || !window.__tooltipText.includes('替代方案'))
        throw Error('富文本 Tooltip 内容缺失');
    });
  }
};
