import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65bb7a6f97cc3d008de5b40f
 * 验证目的：折线末端富文本标签。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const richTextConfig = text => [
      {
        text,
        fontSize: 14,
        fontWeight: 'bold',
        fill: 'red',
        stroke: false
      },
      {
        text: 'Alternative',
        fontSize: 10,
        lineThrough: true,
        underline: true,
        fill: 'green',
        stroke: false
      }
    ];
    const spec = {
      type: 'line',
      width: 800,
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
      title: {
        visible: true,
        text: 'Stacked line chart'
      },
      stack: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'country',
      lineLabel: { visible: true, textType: 'rich', formatMethod: text => richTextConfig(text) },
      label: {
        visible: true,
        formatMethod: text => {
          return { type: 'rich', text: richTextConfig(text) };
        }
      },
      totalLabel: {
        visible: true,
        formatMethod: text => {
          return { type: 'rich', text: richTextConfig(text) };
        }
      },
      legends: [{ visible: true, position: 'middle', orient: 'bottom' }]
    };

    return spec;
  },
  async verify(page) {
    // 同浏览器重建期望配置，并要求目标内容实际绘制。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      if (
        !window.__visualChart
          .getStage()
          .findAll(g => g.type === 'richtext' && g.attribute.visible !== false && g.globalAABBBounds.width() > 0, true)
          .length
      )
        throw new Error('富文本未实际绘制');
    });
  }
};
