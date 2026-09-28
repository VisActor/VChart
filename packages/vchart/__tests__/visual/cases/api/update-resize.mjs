import { barSpec } from '../../helpers.mjs';

/**
 * 验证目的：数据更新与尺寸调整（event-update-spec）。
 * 图表类型：bar。
 * 关键配置：updateData、resize。
 * 场景条件：固定初始两组数据，更新为两条数据并调整为 640×480。
 * 最终检查：验证实际数据含 Updated=55、条数为二、Canvas 尺寸正确。
 * 覆盖边界：不验证 updateSpec 或连续多次更新。
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
    });
  },
  async verify(page) {
    // 检查更新后的数据与真实画布尺寸。
    await page.evaluate(() => {
      const canvas = window.__visualChart.getCanvas();
      const data = window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData;
      if (
        canvas.width !== 640 ||
        canvas.height !== 480 ||
        data.length !== 2 ||
        !data.some(item => item.x === 'Updated' && item.y === 55)
      )
        throw new Error('更新或 resize 未生效');
    });
  }
};
