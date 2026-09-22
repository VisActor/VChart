import { barSpec } from '../helpers.mjs';

/** 数据更新与尺寸调整（event-update-spec）。 */
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
