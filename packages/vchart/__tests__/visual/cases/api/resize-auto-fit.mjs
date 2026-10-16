/**
 * 验证目的：默认 autoFit 的首次容器通知不能撤销手动 resize。
 * 图表类型：bar。
 * 关键配置：显式 600×600、默认 autoFit、resize(300, 300)、customMark 触发重建。
 * 场景条件：同一浏览器任务内 renderAsync 后立即 resize，再等待真实 ResizeObserver 通知。
 * 最终检查：resize、首次通知、无尺寸变化的窗口事件及重建后，布局、stage 和 Canvas 均为 300×300。
 * 覆盖边界：容器真实变化和新显式 Spec 尺寸覆盖由核心单元测试验证。
 */
export default {
  createSpec() {
    return {
      type: 'bar',
      width: 600,
      height: 600,
      xField: 'date',
      yField: 'value',
      data: {
        id: 'data',
        values: [
          { date: '2019-08-29', value: 39359021311 },
          { date: '2019-08-30', value: 41363548585 }
        ]
      },
      tooltip: { transitionDuration: 0 }
    };
  },
  async exercise(page) {
    // 重新创建实例，让首次原生 observer 通知发生在手动 resize 之后。
    await page.evaluate(async () => {
      const spec = window.__visualChart.getSpec();
      window.__visualChart.release();
      const chart = (window.__visualChart = new window.VChart.default(spec, {
        dom: 'chart',
        animation: false,
        resizeDelay: 0,
        theme: { fontFamily: 'Arial', tooltip: { transitionDuration: 0 } },
        onError: error => window.__visualErrors.push(String(error))
      }));
      const sizes = (window.__resizeAutoFitSizes = []);
      const capture = () => {
        const rect = chart.getChart().getCanvasRect();
        const stage = chart.getStage();
        const canvas = chart.getCanvas();
        sizes.push([rect.width, rect.height, stage.width, stage.height, canvas.width, canvas.height]);
      };
      // 测试自己的原生 observer 提供交付屏障，不以固定延时猜测首次通知完成时间。
      const delivered = new Promise(resolve => {
        const observer = new ResizeObserver(() => {
          observer.disconnect();
          requestAnimationFrame(resolve);
        });
        observer.observe(document.getElementById('chart'));
      });
      await chart.renderAsync();
      await chart.resize(300, 300);
      capture();
      await delivered;
      capture();
      window.dispatchEvent(new Event('resize'));
      capture();
      const original = chart.getChart();
      await chart.updateSpec({
        ...chart.getSpec(),
        customMark: [{ type: 'text', style: { text: 'resize 300×300', x: 20, y: 20 } }]
      });
      window.__resizeAutoFitRemade = chart.getChart() !== original;
      window.dispatchEvent(new Event('resize'));
      capture();
    });
  },
  async verify(page) {
    // 每个阶段检查真实尺寸，并确认重建确实发生，防止无效动作产生假通过。
    await page.evaluate(() => {
      const sizes = window.__resizeAutoFitSizes;
      const chart = window.__visualChart;
      const rect = chart.getChart().getCanvasRect();
      const stage = chart.getStage();
      const canvas = chart.getCanvas();
      if (
        !window.__resizeAutoFitRemade ||
        sizes?.length !== 4 ||
        sizes.some(size => size.some(value => value !== 300)) ||
        [rect.width, rect.height, stage.width, stage.height, canvas.width, canvas.height].some(value => value !== 300)
      ) {
        throw new Error('自动尺寸监听或 Spec 重建覆盖了手动 resize 的 300×300 尺寸：' + JSON.stringify(sizes));
      }
    });
  }
};
