import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 649d7f2352a1e9eec95f9f17
 * 验证目的：来源 Tooltip 配置、实际提示内容及移出隐藏。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const data = [
      { x: '2:00', y: 82 },
      { x: '4:00', y: 50 },
      { x: '6:00', y: 64 },
      { x: '8:00', y: 10 },
      { x: '10:00', y: 30 },
      { x: '12:00', y: 40 },
      { x: '14:00', y: 56 },
      { x: '16:00', y: 40 },
      { x: '18:00', y: 64 },
      { x: '20:00', y: 74 },
      { x: '22:00', y: 98 }
    ];
    const sum = data.reduce((sum, cur) => sum + cur.y, 0);
    const spec = {
      type: 'bar',
      data: { id: 'data1', values: data },
      xField: 'x',
      yField: 'y',
      bar: {
        style: {
          fill: {
            gradient: 'linear',
            x0: 0.5,
            y0: 0.4,
            x1: 1,
            y1: 0.5,
            stops: [
              { offset: 0, color: '#4FC6B4' },
              { offset: 1, color: '#31679E' }
            ]
          },
          cornerRadius: 10
        }
      },
      tooltip: {
        transitionDuration: 0,
        mark: {
          position: 'top',
          content: [
            { key: '指标', value: datum => datum.y },
            { key: '占比', value: datum => Math.floor((datum.y / sum) * 10000) / 100 + '%', hasShape: false }
          ],
          updateContent: prev =>
            (prev ?? [])
              .map(c => {
                c.key += '的值是';
                return c;
              })
              .concat({ key: '我是', value: '新加的一行' })
        },
        style: {
          panel: {
            padding: { top: 5, bottom: 10, left: 10, right: 10 },
            backgroundColor: '#272d54',
            border: { color: '#999', width: 4, radius: 10 },
            shadow: { x: 0, y: 0, blur: 10, spread: 5, color: '#666' }
          },
          titleLabel: { fontSize: 20, fontColor: 'white', fontWeight: 'bold', align: 'center', lineHeight: 24 },
          keyLabel: { fontSize: 14, fontColor: 'orange', align: 'center', lineHeight: 15, spacing: 10 },
          valueLabel: { fontSize: 14, fontColor: 'yellow', align: 'center', lineHeight: 15, spacing: 10 },
          shape: { size: 15, spacing: 10 },
          spaceRow: 10
        },
        offset: { y: 20 }
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
      for (const text of ['指标的值是', '占比的值是', '新加的一行'])
        if (!window.__tooltipText.includes(text)) throw Error('updateContent 缺少 ' + text);
    });
  }
};
