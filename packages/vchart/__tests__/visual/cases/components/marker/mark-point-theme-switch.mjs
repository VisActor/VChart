import { verifyRendered, verifySourceSpec } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证运行时切换深色主题后，折线图标注仍可见且显式颜色不变。
 * 通过连接线实际颜色验证主题切换，默认文字色由截图比较和单元测试验证。
 */
export default {
  createSpec() {
    return {
      type: 'line',
      data: {
        values: [
          { x: 'A', y: 1 },
          { x: 'B', y: 3 },
          { x: 'C', y: 2 }
        ]
      },
      xField: 'x',
      yField: 'y',
      markPoint: [
        {
          coordinate: { x: 'A', y: 1 },
          itemContent: { type: 'text', offsetY: -20, text: { text: 'Default' } }
        },
        {
          coordinate: { x: 'C', y: 2 },
          itemContent: { type: 'text', offsetY: -20, text: { text: 'Explicit', style: { fill: '#e03131' } } }
        }
      ]
    };
  },
  async exercise(page) {
    await page.evaluate(async () => {
      const chart = window.__visualChart;
      const line = chart.getStage().find(node => node.name === 'mark-point-line', true);
      window.__markPointLightStroke = line?.attribute.lineStyle?.stroke;
      await chart.setCurrentTheme('dark');
    });
    await interactionFrame(page);
  },
  async verify(page) {
    await verifySourceSpec(page);
    await verifyRendered(page, 'mark-point');
    await page.evaluate(() => {
      const stage = window.__visualChart.getStage();
      const line = stage.find(node => node.name === 'mark-point-line', true);
      if (window.__markPointLightStroke !== '#606773' || line?.attribute.lineStyle?.stroke !== '#bbbdc3') {
        throw Error('标注连接线未由浅色主题切换到深色主题');
      }
      const labels = stage.findAll(
        node => node.type === 'text' && ['Default', 'Explicit'].includes(node.attribute.text),
        true
      );
      if (labels.length !== 2 || labels.some(label => label.attribute.visible === false)) {
        throw Error('切换主题后缺少可见的标注文字');
      }
      if (labels.find(label => label.attribute.text === 'Explicit')?.attribute.fill !== '#e03131') {
        throw Error('主题切换修改了显式标注颜色');
      }
    });
  }
};
