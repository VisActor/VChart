import { assertionError } from '../../../assertions.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
import sankeyScrollbar from './sankey-scrollbar.mjs';

/**
 * 验证目的：组合图在已有 Stage 上启用桑基滚动后可查看被裁剪的内容。
 * 图表类型：common，包含 sankey 系列。
 * 关键配置：通过 updateSpecSync 为系列添加 overflow: 'scroll'。
 * 场景条件：三层固定流向，缩窄绘图区后链接仍宽于视口。
 * 最终检查：Stage 被复用，且真实滚轮和滑块拖动都能移动内容。
 * 覆盖边界：VChart 创建的 Stage 和横向溢出。
 */
function createSpec(overflow) {
  const { data, overflow: _overflow, ...series } = sankeyScrollbar.createSpec();
  return {
    type: 'common',
    data,
    series: [{ ...series, dataIndex: 0, ...(overflow ? { overflow } : {}) }]
  };
}

export default {
  createSpec: () => createSpec(),
  async exercise(page) {
    const reusedStage = await page.evaluate(spec => {
      const chart = window.__visualChart;
      const stage = chart.getStage();
      chart.updateSpecSync({ ...spec, animation: false });
      return chart.getStage() === stage;
    }, createSpec('scroll'));
    if (!reusedStage) {
      throw assertionError('开启桑基滚动时应复用组合图的 Stage');
    }
    await interactionFrame(page);
    await sankeyScrollbar.exercise(page);
  },
  verify: sankeyScrollbar.verify
};
