import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget, interactionFrame, seriesStates } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03e2
 * 验证目的：半圆饼图悬停状态及标签引导线布局。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'pie',
      data: [
        {
          id: 'id0',
          values: [
            { type: 'a', value: 100 },
            { type: 'b', value: 89 },
            { type: 'c', value: 123 },
            { type: 'd', value: 300 }
          ]
        }
      ],
      valueField: 'value',
      categoryField: 'type',
      radius: 0.8,
      cornerRadius: 0.2,
      center: { x: 150, y: 200 },
      startAngle: 90,
      endAngle: 270,
      padAngle: 10,
      label: {
        visible: true,
        style: { fontSize: 16, text: args => '123123123' },
        state: { hover: { fill: 'red' } },
        line: { visible: true, style: { lineWidth: 2 }, state: { hover: { stroke: 'red' } } },
        layout: {}
      },
      pie: {
        style: {
          stroke: '#aaa',
          lineWidth: 2,
          fill: {
            gradient: 'radial',
            r0: 0,
            x0: 0.5,
            y0: 0.5,
            x1: 0.5,
            y1: 0.5,
            r1: 0.5,
            stops: [
              { offset: 0, opacity: 0.2 },
              { offset: 0.5, opacity: 0.6 },
              { offset: 1, opacity: 1 }
            ]
          }
        },
        state: {
          hover: {
            outerRadius: 0.85,
            fill: {
              gradient: 'radial',
              r0: 0,
              x0: 0.5,
              y0: 0.5,
              x1: 0.5,
              y1: 0.5,
              r1: 0.5,
              stops: [
                { offset: 0, color: 'red' },
                { offset: 0.5, color: 'yellow' },
                { offset: 1, color: 'blue' }
              ]
            }
          },
          selected: { stroke: 'blue', lineWidth: 2 }
        }
      }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const p = await interactionTarget(page, 'pie', 1);
    await page.mouse.move(p.x, p.y);
    await interactionFrame(page);
    await page.evaluate(r => (window.__pieHover = r), await seriesStates(page));
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      if (!window.__pieHover?.some(m => m.name === 'pie' && m.states.hover > 0)) throw Error('半圆扇区未悬停');
      const texts = window.__visualChart
        .getStage()
        .findAll(g => g.type === 'text' && g.attribute.visible !== false, true);
      if (!texts.length) throw Error('半圆标签未绘制');
    });
  }
};
