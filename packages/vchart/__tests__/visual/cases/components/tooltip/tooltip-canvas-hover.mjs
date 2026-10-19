import { interactionTarget, interactionFrame } from '../../../interaction-helpers.mjs';
import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03f5
 * 验证目的：悬停柱形显示Canvas提示框。
 * 保留条件：原始数据与配置；通用文字翻译保留字段关联和长标签场景。
 * 覆盖边界：按图元适配来源鼠标动作，检查最终提示框状态。
 */
export default {
  createSpec() {
    // 返回来源的独立确定性配置。
    return {
      type: 'bar',
      xField: 'date',
      yField: 'value',
      width: 600,
      height: 600,
      data: [
        {
          name: 'barData',
          values: [
            {
              date: '2019-08-29',
              value: 39359021311
            },
            {
              date: '2019-08-30',
              value: 41363548585
            }
          ]
        }
      ],
      tooltip: {
        renderMode: 'canvas'
      }
    };
  },
  async exercise(page) {
    // 保留多次 move 的语义：不同 datum 的提示、移出隐藏、恢复最终提示。
    const observations = [];
    for (const index of [0, 1, -1, 1]) {
      let expected = '';
      if (index >= 0) {
        const p = await interactionTarget(page, 'bar', index);
        expected = await page.evaluate(index => {
          const s = window.__visualChart.getChart().getAllSeries()[0];
          return String(s.getViewData().latestData[index][s.getSpec().yField]);
        }, index);
        await page.mouse.move(p.x, p.y);
      } else await page.mouse.move(950, 750);
      await page.waitForFunction(
        shown => window.__visualChart.getTooltipHandler()?.isTooltipShown() === shown,
        index >= 0
      );
      await interactionFrame(page);
      observations.push(
        await page.evaluate(expected => {
          const c = window.__visualChart,
            roots = c.getStage().findAll(g => g.name?.includes('tooltip') && g.attribute.visible !== false, true);
          const text = roots
            .flatMap(g => g.findAll?.(g => g.type === 'text', true) ?? [])
            .map(g => String(g.attribute.text))
            .join(' ');
          return { shown: c.getTooltipHandler()?.isTooltipShown(), expected, text };
        }, expected)
      );
    }
    await page.evaluate(observations => {
      window.__tooltipObservations = observations;
    }, observations);
  },
  async verify(page) {
    // Canvas 提示必须包含对应 datum 的值，切换和隐藏均以实际组件状态为准。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page);
    await page.evaluate(() => {
      const rows = window.__tooltipObservations;
      if (rows?.length !== 4) throw Error('缺少多步 Tooltip 结果');
      for (const i of [0, 1, 3])
        if (!rows[i].shown || !rows[i].text.includes(rows[i].expected)) throw Error('Canvas Tooltip 内容不匹配');
      if (rows[2].shown || rows[0].expected === rows[1].expected || rows[0].text === rows[1].text)
        throw Error('Tooltip 未切换或隐藏');
      if (!window.__visualChart.getTooltipHandler()?.isTooltipShown()) throw Error('最终 Tooltip 未恢复');
    });
  }
};
