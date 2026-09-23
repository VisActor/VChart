import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget, interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 655ad1e99ea0da0095642841
 * 验证目的：饼图选择触发富文本指标及对应数值。
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
          values: [
            { value: '159', type: 'Tradition Industries', percentage: '71.6%' },
            { value: '50', type: 'Business Companies', percentage: '22.5%' },
            { value: '13', type: 'Customer-facing Companies', percentage: '5.9%' }
          ]
        }
      ],
      radius: 0.8,
      innerRadius: 0.5,
      valueField: 'value',
      categoryField: 'type',
      label: {
        visible: true,
        style: { fontSize: 16 },
        line: { style: {}, line1MinLength: 30 },
        layout: { align: 'edge' }
      },
      pie: { state: { selected: { outerRadius: 0.85 } } },
      indicator: {
        visible: true,
        fixed: false,
        trigger: 'select',
        gap: 10,
        title: {
          autoLimit: true,
          style: {
            fontSize: 16,
            type: 'rich',
            text: datum => {
              if (!datum) {
                return '';
              }
              return [
                { text: 'type:', fontWeight: 'bold', fontSize: 20, fill: '#3f51b5' },
                { text: datum.type, fontStyle: 'italic', textDecoration: 'underline', fill: '#3f51b5' }
              ];
            }
          }
        },
        content: [
          { field: 'value', style: { fontSize: 42, fontWeight: 'bolder' } },
          { field: 'percentage', style: { fontSize: 20 } }
        ]
      }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const p = await interactionTarget(page, 'pie');
    await page.mouse.click(p.x, p.y);
    await page.mouse.move(950, 750);
    await interactionFrame(page);
    await page.evaluate(() => {
      const s = window.__visualChart.getChart().getAllSeries()[0],
        g = s
          .getSeriesMark()
          .getGraphics()
          .find(g => g.currentStates?.includes('selected'));
      window.__indicatorValue = g?.context.data[0][s.getSpec().valueField];
    });
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const value = window.__indicatorValue,
        c = window.__visualChart;
      if (value === undefined) throw Error('饼图未选中');
      const indicators = c
        .getStage()
        .findAll(g => g.name?.includes('indicator') && g.attribute.visible !== false, true);
      if (
        !indicators.length ||
        !indicators.some(
          g =>
            JSON.stringify(g.attribute).includes(String(value)) ||
            g.findAll?.(x => JSON.stringify(x.attribute).includes(String(value)), true).length
        )
      )
        throw Error('指标未显示选中值');
    });
  }
};
