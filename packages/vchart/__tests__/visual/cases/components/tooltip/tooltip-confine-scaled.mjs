import { verifySpec } from '../../../helpers.mjs';
import { interactionFrame, interactionTarget } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：缩放后的图表仍将 HTML tooltip 限制在可见画布内。
 * 图表类型：line。
 * 关键配置：tooltip.confine、tooltip.renderMode、tooltip.trigger。
 * 场景条件：图表容器缩至 75%，点击最右侧的数据点。
 * 最终检查：显示最右点的内容，且提示框四边均在画布内。
 * 覆盖边界：默认 tooltip 挂载容器，不包含 Canvas tooltip。
 */
export default {
  createSpec() {
    return {
      type: 'line',
      data: {
        values: [12, 18, 15, 23, 20, 25, 21, 27].map((amount, index) => ({
          date: `2026-01-0${index + 1}`,
          amount,
          group: 'Daily completed orders'
        }))
      },
      xField: 'date',
      yField: 'amount',
      seriesField: 'group',
      point: { visible: true },
      tooltip: {
        activeType: ['dimension'],
        className: 'scaled-chart-tooltip',
        confine: true,
        renderMode: 'html',
        trigger: 'click'
      }
    };
  },
  async exercise(page) {
    await page.evaluate(() => {
      const chart = document.querySelector('#chart');
      chart.style.left = '32px';
      chart.style.top = '24px';
      chart.style.transformOrigin = 'top left';
      chart.style.transform = 'scale(0.75)';
    });
    const point = await interactionTarget(page, 'point', 7);
    // 图元使用画布局部坐标，浏览器点击使用页面坐标。
    const position = await page.evaluate(({ x, y }) => {
      const canvas = document.querySelector('#chart canvas');
      const bounds = canvas.getBoundingClientRect();
      return {
        x: bounds.left + (x * bounds.width) / canvas.offsetWidth,
        y: bounds.top + (y * bounds.height) / canvas.offsetHeight
      };
    }, point);
    await page.mouse.click(position.x, position.y);
    await interactionFrame(page);
  },
  async verify(page) {
    await verifySpec(page, this.createSpec());
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const tooltip = document.querySelector('.scaled-chart-tooltip');
      if (
        !tooltip ||
        getComputedStyle(tooltip).visibility !== 'visible' ||
        !tooltip.textContent.includes('2026-01-08')
      ) {
        throw assertionError('点击后应显示最右侧日期的 HTML tooltip');
      }

      const canvas = document.querySelector('#chart canvas').getBoundingClientRect();
      const panel = tooltip.getBoundingClientRect();
      const overflows = [
        canvas.left - panel.left,
        panel.right - canvas.right,
        canvas.top - panel.top,
        panel.bottom - canvas.bottom
      ];
      if (Math.max(...overflows) > 0.5) {
        throw assertionError(`HTML tooltip 超出缩放后的画布，左、右、上、下溢出量为 ${overflows.join(', ')} px`);
      }
    });
  }
};
