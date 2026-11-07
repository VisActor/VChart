import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：程序化激活的维度也能在离开画布时清理。
 * 图表类型：line；公开 setDimensionIndex 激活 A，显式配置折线点的 dimension_hover。
 * 场景条件：光标只经过 padding 留白，不以命中数据点的 pointermove 建立活动缓存。
 * 最终检查：调用后一个点高亮；移出画布后没有残留的 dimension_hover 状态。
 * 覆盖边界：不验证 Tooltip 和 crosshair 的程序化显示。
 */
export default {
  createSpec() {
    return {
      type: 'line',
      padding: 80,
      animation: false,
      data: {
        values: [
          { x: 'A', y: 20 },
          { x: 'B', y: 30 },
          { x: 'C', y: 15 }
        ]
      },
      xField: 'x',
      yField: 'y',
      point: { state: { dimension_hover: { size: 16, fill: 'red' } } },
      tooltip: { visible: false }
    };
  },
  async exercise(page) {
    // 留白移动不会命中图表维度，不能替程序化入口补建活动缓存。
    await page.mouse.move(10, 10);
    await page.evaluate(() => {
      const chart = window.__visualChart;
      chart.setDimensionIndex('A', { tooltip: false, crosshair: false });
      window.__dimensionIndexLeave = chart
        .getStage()
        .findAll(g => g.type === 'symbol' && g.currentStates?.includes('dimension_hover'), true).length;
    });
    await page.mouse.move(20, 20);
    await page.mouse.move(900, 700);
    await interactionFrame(page);
  },
  async verify(page) {
    // 检查实际图元状态，而不是仅判断 leave 回调是否被调用。
    await page.evaluate(async () => {
      const remaining = window.__visualChart
        .getStage()
        .findAll(g => g.type === 'symbol' && g.currentStates?.includes('dimension_hover'), true).length;
      if (window.__dimensionIndexLeave !== 1 || remaining !== 0) {
        const { assertionError } = await import('/suite/assertions.mjs');
        throw assertionError(
          '程序化维度未正确清理：' + JSON.stringify({ activated: window.__dimensionIndexLeave, remaining })
        );
      }
    });
  }
};
