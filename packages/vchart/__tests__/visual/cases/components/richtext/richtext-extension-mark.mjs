import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65bb785c97cc3d008de5b403
 * 验证目的：组合图自定义富文本图元。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const spec = {
      type: 'common',
      data: [
        {
          id: 'barData',
          values: [
            { date: 'Day one', class: 'A', score: 20, highest: true },
            { date: 'Day one', class: 'B', score: 18 },
            { date: 'Day one', class: 'C', score: 19 },
            { date: 'Day one', class: 'D', score: 15 },
            { date: 'Day two', class: 'A', score: 16 },
            { date: 'Day two', class: 'B', score: 19, highest: true },
            { date: 'Day two', class: 'C', score: 18 },
            { date: 'Day two', class: 'D', score: 14 },
            { date: 'Day three', class: 'A', score: 19, highest: true },
            { date: 'Day three', class: 'B', score: 16 },
            { date: 'Day three', class: 'C', score: 18 },
            { date: 'Day three', class: 'D', score: 13 },
            { date: 'Day four', class: 'A', score: 18 },
            { date: 'Day four', class: 'B', score: 20 },
            { date: 'Day four', class: 'C', score: 22 },
            { date: 'Day four', class: 'D', score: 26, highest: true }
          ]
        }
      ],
      series: [
        {
          type: 'bar',
          yField: 'score',
          xField: ['date', 'class'],
          seriesField: 'class',
          extensionMark: [
            {
              type: 'text',
              dataId: 'barData',
              visible: true,
              style: {
                text: {
                  type: 'rich',
                  text: [
                    {
                      text: 'TOOLTIP',
                      fontWeight: 'bold',
                      fill: 'red',
                      stroke: false
                    },
                    {
                      text: 'Alternative',
                      fontStyle: 'italic',
                      textDecoration: 'underline',
                      fill: '#3f51b5',
                      stroke: false
                    }
                  ]
                },
                x: (datum, ctx, elements, dataView) => {
                  return ctx.valueToX([datum.date, datum.class]);
                },
                y: (datum, ctx, elements, dataView) => {
                  return ctx.valueToY([datum.score]) - 28;
                },
                fill: 'red',
                visible: datum => datum.highest === true
              }
            }
          ]
        }
      ],
      title: {
        visible: true,
        text: 'Mark the class with the highest daily score with a red flag',
        padding: {
          left: 50,
          bottom: 10
        }
      },
      axes: [
        { orient: 'left', type: 'linear', nice: true, range: { max: 30 } },
        { orient: 'bottom', type: 'band' }
      ]
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
