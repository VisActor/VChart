import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget, interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 65d850f26210ca00ad4a358d
 * 验证目的：极坐标十字线分类和数值 formatter 的真实悬停输出。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'radar',
      data: [
        {
          id: 'radar',
          values: [
            { name: 'Openlane', value1: 160.2, value2: 66.9 },
            { name: 'Yearin', value1: 150.1, value2: 50.5 },
            { name: 'Goodsilron', value1: 120.7, value2: 32.3 },
            { name: 'Condax', value1: 89.4, value2: 74.5 },
            { name: 'Opentech', value1: 78.5, value2: 29.7 },
            { name: 'Golddex', value1: 77.6, value2: 102.2 },
            { name: 'Isdom', value1: 69.8, value2: 22.6 },
            { name: 'Plusstrip', value1: 63.6, value2: 45.3 },
            { name: 'Kinnamplus', value1: 59.7, value2: 12.8 },
            { name: 'Zumgoity', value1: 54.3, value2: 19.6 },
            { name: 'Stanredtax', value1: 52.9, value2: 96.3 },
            { name: 'Conecom', value1: 42.9, value2: 11.9 },
            { name: 'Zencorporation', value1: 40.9, value2: 16.8 },
            { name: 'Iselectrics', value1: 39.2, value2: 9.9 },
            { name: 'Treequote', value1: 36.6, value2: 36.9 },
            { name: 'Sumace', value1: 34.8, value2: 14.6 },
            { name: 'Lexiqvolax', value1: 32.1, value2: 35.6 },
            { name: 'Sunnamplex', value1: 31.8, value2: 5.9 },
            { name: 'Faxquote', value1: 29.3, value2: 14.7 },
            { name: 'Donware', value1: 23.0, value2: 2.8 },
            { name: 'Warephase', value1: 21.5, value2: 12.1 },
            { name: 'Donquadtech', value1: 19.7, value2: 10.8 },
            { name: 'Nam-zim', value1: 15.5, value2: 4.1 },
            { name: 'Y-corporation', value1: 14.2, value2: 11.3 }
          ],
          transforms: [{ type: 'fold', options: { key: 'type', value: 'value', fields: ['value1', 'value2'] } }]
        }
      ],
      categoryField: 'name',
      valueField: 'value',
      seriesField: 'type',
      innerRadius: 0.3,
      outerRadius: 0.9,
      stack: true,
      area: { visible: true },
      point: { visible: false },
      axes: [
        {
          orient: 'angle',
          label: { formatter: `{label} ttt` },
          domainLine: { style: { lineDash: [2, 2] } },
          grid: { style: { lineDash: [2, 2] } },
          tick: { visible: false }
        },
        {
          orient: 'radius',
          grid: { smooth: true, style: { lineDash: [2, 2] } },
          label: { visible: true, inside: true, formatter: `{label:.1f}` }
        }
      ],
      crosshair: {
        categoryField: {
          visible: true,
          line: { style: { stroke: '#000', lineWidth: 1, opacity: 1, lineDash: [4, 4] } },
          label: { visible: true, formatter: `{label} ttt` }
        },
        valueField: {
          visible: true,
          line: { smooth: true, style: { stroke: '#000', lineWidth: 1, opacity: 1, lineDash: [4, 4] } },
          label: { visible: true, formatter: `{label:.3f}` }
        }
      },
      legends: { visible: true }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const p = await interactionTarget(page, 'area');
    await page.mouse.move(p.x, p.y);
    await interactionFrame(page);
    await page.evaluate(() => {
      window.__crosshairTexts = window.__visualChart
        .getStage()
        .findAll(g => g.name?.includes('crosshair') && g.attribute.visible !== false, true)
        .flatMap(g => g.findAll?.(x => x.type === 'text', true) ?? [])
        .map(g => String(g.attribute.text));
    });
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const texts = window.__crosshairTexts;
      if (!texts?.some(t => t.endsWith(' ttt')) || !texts.some(t => /^-?\d+\.\d{3}$/.test(t)))
        throw Error('极坐标十字线未应用分类/三位小数格式');
    });
  }
};
