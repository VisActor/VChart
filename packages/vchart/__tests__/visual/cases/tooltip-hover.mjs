import {} from '../helpers.mjs';

/** 鼠标悬停后的 HTML tooltip（tooltip）。 */
export default {
  createSpec() {
    // 单组正值柱图便于可靠定位柱体内部。
    return {
      type: 'bar',
      data: {
        id: 'data',
        values: [
          { x: 'A', y: 30 },
          { x: 'B', y: 50 },
          { x: 'C', y: 20 }
        ]
      },
      xField: 'x',
      yField: 'y',
      tooltip: { visible: true, renderMode: 'html', transitionDuration: 0 }
    };
  },
  async exercise(page) {
    // 使用公开坐标转换 API，验证 tooltip 内容而非只触发 mousemove。
    const point = await page.evaluate(() => window.__visualChart.convertDatumToPosition({ x: 'B', y: 25 }, {}, true));
    if (!point) throw new Error('无法定位 tooltip 目标');
    await page.mouse.move(point.x, point.y);
  },
  async verify(page) {
    // 目标 tooltip 必须可见且包含期望值。
    await page.waitForFunction(() =>
      [...document.querySelectorAll('[class*="tooltip"]')].some(
        el =>
          el.textContent.includes('50') &&
          el.getBoundingClientRect().width > 0 &&
          getComputedStyle(el).visibility !== 'hidden' &&
          getComputedStyle(el).display !== 'none'
      )
    );
  }
};
