import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 677c9b8eec437f00b3c5121a
 * 验证目的：setDimensionIndex 定位来源指定维度的十字线。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：验证来源 setDimensionIndex 之后的实际十字线；附带 move 录制不在本例的验证范围。
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
      title: { visible: true, text: '100% stacked area chart of cosmetic products sales' },
      percent: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'country',
      legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
      axes: [
        {
          orient: 'left',
          label: {
            formatMethod(val) {
              return `${(val * 100).toFixed(2)}%`;
            }
          }
        }
      ],
      area: {
        style: {
          fill: {
            gradient: 'linear',
            x0: 0.5,
            y0: 0,
            x1: 0.5,
            y1: 1,
            stops: [
              {
                offset: 0,
                opacity: 1
              },
              {
                offset: 1,
                opacity: 0
              }
            ]
          }
        }
      },
      tooltip: {
        offset: { x: 50, y: 50 }
      }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(() => {
      const chartSpace = window.__visualChart;
      chartSpace.setDimensionIndex('Nail polish');
    });
    await interactionFrame(page);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(value => {
      const c = window.__visualChart;
      const graphics = c
        .getStage()
        .findAll(g => g.name?.toLowerCase().includes('crosshair') && g.attribute.visible !== false, true);
      if (!graphics.length) throw Error('指定维度没有显示 crosshair');
      const text = c
        .getStage()
        .findAll(
          g => g.type === 'text' && String(g.attribute.text).includes(value) && g.attribute.visible !== false,
          true
        );
      if (!text.length) throw Error('指定维度文本不存在');
    }, 'Nail polish');
  }
};
