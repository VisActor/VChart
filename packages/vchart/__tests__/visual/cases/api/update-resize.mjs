import { barSpec } from '../../helpers.mjs';

/**
 * 验证目的：数据更新与尺寸调整（event-update-spec）。
 * 图表类型：bar。
 * 关键配置：updateData、resize、updateSpec 添加 customMark 触发重建。
 * 场景条件：更新为两条数据并调整为 640×480，随后重建 chart。
 * 最终检查：数据含 Updated=55、条数为二，重建后布局、stage 和 Canvas 尺寸仍一致。
 * 覆盖边界：不验证 autoFit 或新增显式 Spec 尺寸覆盖手动尺寸。
 */
export default {
  createSpec: barSpec,
  async exercise(page) {
    // 等待公开异步 API 完成，并检查实际数据和画布尺寸。
    await page.evaluate(async () => {
      await window.__visualChart.updateData('data', [
        { x: 'Updated', y: 55, group: 'Alpha' },
        { x: 'Second', y: 20, group: 'Alpha' }
      ]);
      const container = document.getElementById('chart');
      container.style.width = '640px';
      container.style.height = '480px';
      await window.__visualChart.resize(640, 480);
      const previous = window.__visualChart.getChart();
      await window.__visualChart.updateSpec({
        ...window.__visualChart.getSpec(),
        data: {
          id: 'data',
          values: [
            { x: 'Updated', y: 55, group: 'Alpha' },
            { x: 'Second', y: 20, group: 'Alpha' }
          ]
        },
        customMark: [{ type: 'text', style: { text: '尺寸保持 640×480', x: 20, y: 20, textAlign: 'left' } }]
      });
      window.__resizeRemade = window.__visualChart.getChart() !== previous;
    });
  },
  async verify(page) {
    // 检查更新后的数据与真实画布尺寸。
    await page.evaluate(() => {
      const canvas = window.__visualChart.getCanvas();
      const data = window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData;
      const rect = window.__visualChart.getChart().getCanvasRect();
      const stage = window.__visualChart.getStage();
      if (
        !window.__resizeRemade ||
        rect.width !== 640 ||
        rect.height !== 480 ||
        stage.width !== 640 ||
        stage.height !== 480 ||
        canvas.width !== 640 ||
        canvas.height !== 480 ||
        data.length !== 2 ||
        !data.some(item => item.x === 'Updated' && item.y === 55)
      )
        throw new Error('更新或 resize 未生效');
    });
  }
};
