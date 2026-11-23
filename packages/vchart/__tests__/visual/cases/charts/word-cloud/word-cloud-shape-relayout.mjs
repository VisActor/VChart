import { verifyRendered, verifySourceSpec } from '../../../helpers.mjs';

/**
 * 验证目的：防止形状词云沿用上一轮的放置状态，造成词语重叠。
 * 图表类型：wordCloud。
 * 关键配置：双区域文本遮罩、ensureMappingEnlarge、两个优先词。
 * 场景条件：长词初始能放入左侧，放大后放不下，两个优先词仍能放入各自的区域。
 * 最终检查：只有两个优先词可见，且字号确实经历了放大。
 * 覆盖边界：关闭填充词和失败重试，单独检查放大重排的结果。
 */
export default {
  createSpec() {
    return {
      type: 'wordCloud',
      width: 350,
      height: 175,
      padding: 0,
      animation: false,
      random: false,
      nameField: 'name',
      valueField: 'value',
      fontSizeRange: [12, 24],
      maskShape: { type: 'text', text: '█ ▇', fontFamily: 'monospace' },
      word: { style: { fontFamily: 'monospace', fontWeight: 'normal' } },
      wordCloudShapeConfig: {
        ratio: 1,
        layoutMode: 'ensureMappingEnlarge',
        importantWordCount: 2,
        fontSizeEnlargeFactor: 2,
        textLayoutTimes: 0,
        fillingTimes: 0
      },
      data: {
        id: 'words',
        values: [
          { name: 'A', value: 24 },
          { name: 'BBB', value: 18 },
          { name: 'MMMMMMMMMMM', value: 12 }
        ]
      }
    };
  },
  async verify(page) {
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const visibleWords = window.__visualChart
        .getChart()
        .getAllSeries()[0]
        .getSeriesMark()
        .getGraphics()
        .filter(word => word.attribute.visible !== false)
        .map(word => [word.attribute.text, word.attribute.fontSize]);
      if (
        JSON.stringify(visibleWords) !==
        JSON.stringify([
          ['A', 48],
          ['BBB', 36]
        ])
      ) {
        throw assertionError('放大重排后应只显示两个放大的优先词，实际为 ' + JSON.stringify(visibleWords));
      }
    });
  }
};
