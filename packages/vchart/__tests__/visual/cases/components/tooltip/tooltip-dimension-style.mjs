import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 64dc73f1ae69d5156f811c0a
 * 验证目的：来源 Tooltip 配置、实际提示内容及移出隐藏。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'area',
      data: {
        values: [
          { type: 'Nail polish', country: 'Africa', value: 4229 },
          { type: 'Nail polish', country: 'EU', value: 4376 },
          { type: 'Nail polish', country: 'China', value: 3054 },
          { type: 'Nail polish', country: 'USA', value: 12814 },
          { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
          { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
          { type: 'Eyebrow pencil', country: 'China', value: 5067 },
          { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
          { type: 'Rouge', country: 'Africa', value: 5221 },
          { type: 'Rouge', country: 'EU', value: 3574 },
          { type: 'Rouge', country: 'China', value: 7004 },
          { type: 'Rouge', country: 'USA', value: 11624 },
          { type: 'Lipstick', country: 'Africa', value: 9256 },
          { type: 'Lipstick', country: 'EU', value: 4376 },
          { type: 'Lipstick', country: 'China', value: 9054 },
          { type: 'Lipstick', country: 'USA', value: 8814 },
          { type: 'Eyeshadows', country: 'Africa', value: 3308 },
          { type: 'Eyeshadows', country: 'EU', value: 4572 },
          { type: 'Eyeshadows', country: 'China', value: 12043 },
          { type: 'Eyeshadows', country: 'USA', value: 12998 },
          { type: 'Eyeliner', country: 'Africa', value: 5432 },
          { type: 'Eyeliner', country: 'EU', value: 3417 },
          { type: 'Eyeliner', country: 'China', value: 15067 },
          { type: 'Eyeliner', country: 'USA', value: 12321 },
          { type: 'Foundation', country: 'Africa', value: 13701 },
          { type: 'Foundation', country: 'EU', value: 5231 },
          { type: 'Foundation', country: 'China', value: 10119 },
          { type: 'Foundation', country: 'USA', value: 10342 },
          { type: 'Lip gloss', country: 'Africa', value: 4008 },
          { type: 'Lip gloss', country: 'EU', value: 4572 },
          { type: 'Lip gloss', country: 'China', value: 12043 },
          { type: 'Lip gloss', country: 'USA', value: 22998 },
          { type: 'Mascara', country: 'Africa', value: 18712 },
          { type: 'Mascara', country: 'EU', value: 6134 },
          { type: 'Mascara', country: 'China', value: 10419 },
          { type: 'Mascara', country: 'USA', value: 11261 }
        ]
      },
      title: { visible: true, text: 'Stacked area chart of cosmetic products sales' },
      xField: 'type',
      yField: 'value',
      seriesField: 'country',
      legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
      crosshair: { xField: { visible: true } },
      tooltip: {
        transitionDuration: 0,
        dimension: {
          title: { valueStyle: { fill: 'green' } },
          content: [
            {
              key: datum => datum['country'],
              value: datum => datum['value'],
              valueStyle: { fill: 'red', fontWeight: 'bold' }
            },
            {
              key: '第二行',
              value: datum => datum['value'],
              keyStyle: { fill: 'blue', fontWeight: 'bold' },
              valueStyle: { fontSize: 12, lineHeight: 21 }
            }
          ],
          updateContent: prev => {
            prev[2].keyStyle = { fill: 'orange', fontWeight: 'bold' };
            prev[2].valueStyle = { fill: 'orange', fontWeight: 'bold' };
            return prev;
          }
        }
      }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const p = await interactionTarget(page, 'point');
    p.y = await page.evaluate(
      () => window.__visualChart.getChart().getAllSeries()[0].getRegion().getLayoutStartPoint().y + 5
    );
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
      if (!window.__tooltipText.includes('第二行')) throw Error('维度 Tooltip 额外行缺失');
    });
  }
};
