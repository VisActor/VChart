import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget, interactionFrame, seriesStates } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 66f2a5a8885776011c598a43
 * 验证目的：来源漏斗外标签对齐、虚线与悬停。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'funnel',
      maxSize: '75%',
      minSize: '10%',
      isTransform: true,
      shape: 'rect',
      color: {
        type: 'ordinal',
        range: ['#00328E', '#0048AA', '#005FC5', '#2778E2', '#4E91FF', '#70ABFF', '#8FC7FF', '#AEE2FF']
      },
      transformRatioText: 'transformRatio',
      funnel: {
        style: { cornerRadius: 4, stroke: 'white', lineWidth: 2 },
        state: { hover: { stroke: '#4e83fd', lineWidth: 1 } }
      },
      transform: { style: { stroke: 'white', lineWidth: 2 }, state: { hover: { stroke: '#4e83fd', lineWidth: 1 } } },
      label: {
        visible: true,
        style: { lineHeight: 16, limit: Infinity, text: datum => [`${datum.name}`, `${datum.value}`] }
      },
      outerLabel: {
        visible: true,
        alignLabel: true,
        style: {
          text: datum => {
            return `${datum.name}`;
          }
        },
        line: {
          minLength: 0,
          style: {
            lineDash: [2, 2]
          }
        }
      },
      transformLabel: {
        visible: true,
        style: {
          fill: 'black'
        }
      },
      data: [
        {
          name: 'funnel',
          values: [
            {
              value: 100,
              name: 'Resume Screening',
              percent: 1
            },
            {
              value: 80,
              name: 'Resume Evaluation',
              percent: 0.8
            },
            {
              value: 50,
              name: 'Evaluation Passed',
              percent: 0.5
            },
            {
              value: 30,
              name: 'Interview',
              percent: 0.3
            },
            {
              value: 10,
              name: 'Final Pass',
              percent: 0.1
            }
          ]
        }
      ],
      categoryField: 'name',
      valueField: 'value'
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const p = await interactionTarget(page, 'funnel');
    await page.mouse.move(p.x, p.y);
    await interactionFrame(page);
    await page.evaluate(r => (window.__funnelHover = r), await seriesStates(page));
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const s = window.__visualChart.getChart().getAllSeries()[0];
      if (!window.__funnelHover?.some(m => m.name === 'funnel' && m.states.hover > 0)) throw Error('漏斗未悬停');
      const lines = s
        .getMarks()
        .find(m => m.name === 'outerLabelLine')
        .getGraphics();
      if (lines.length !== 5 || !lines.every(g => JSON.stringify(g.attribute.lineDash) === '[2,2]'))
        throw Error('外标签虚线未绘制');
    });
  }
};
