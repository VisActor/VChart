import { assertionError } from '../../../assertions.mjs';
import { verifyRendered, verifySpec } from '../../../helpers.mjs';

/**
 * 验证目的：瀑布图堆积标签按 formatter 对变化值保留四位小数。
 * 场景条件：第一根柱需要补零，第二根柱需要舍入，且其变化值与累计值不同。
 * 覆盖边界：断言垂直瀑布图中两根数据柱的可见标签文本，截图检查标签与柱的布局。
 */
export default {
  createSpec() {
    return {
      type: 'waterfall',
      data: {
        values: [
          { category: 'A', value: 1.2 },
          { category: 'B', value: 0.12567 }
        ]
      },
      xField: 'category',
      yField: 'value',
      total: { type: 'end', text: 'Total' },
      stackLabel: { visible: true, valueType: 'change', formatter: '.4f' }
    };
  },
  async verify(page) {
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'label');

    // 从图元读取文本和对应类目，确认格式化使用的是堆积变化值。
    const labels = await page.evaluate(() => {
      const stage = window.__visualChart.getStage();
      return stage
        .findAll(
          graphic =>
            graphic.type === 'text' &&
            graphic.attribute.visible !== false &&
            ['A', 'B'].includes(graphic.attribute.data?.index),
          true
        )
        .map(graphic => [graphic.attribute.data.index, graphic.attribute.text]);
    });
    const texts = new Map(labels);
    if (labels.length !== 2 || texts.get('A') !== '1.2000' || texts.get('B') !== '0.1257') {
      throw assertionError(`堆积变化值标签应为 A=1.2000、B=0.1257，实际为 ${JSON.stringify(labels)}`);
    }
  }
};
