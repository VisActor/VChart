import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e040c
 * 验证目的：mark提示框顶部定位。
 * 保留条件：原始数据与配置；通用文字翻译保留字段关联和长标签场景。
 * 覆盖边界：按图元适配来源鼠标动作，检查最终提示框状态。
 */
export default {
  createSpec() {
    // 返回来源的独立确定性配置。
    return {
      type: 'bar',
      xField: 'date',
      yField: 'value',
      width: 600,
      height: 600,
      data: [
        {
          name: 'barData',
          values: [
            {
              date: '2019-08-29',
              value: 39359021311
            },
            {
              date: '2019-08-30',
              value: 41363548585
            }
          ]
        }
      ],
      tooltip: {
        transitionDuration: 0,
        mark: {
          position: 'top'
        }
      }
    };
  },
  async exercise(page) {
    // 真实鼠标操作必须产生可观察的组件状态。
    await page.evaluate(() => {
      window.__visualChart.on('pointermove', () => {
        window.__pointerObserved = true;
      });
    });
    const p = await page.evaluate(() => {
      const s = window.__visualChart.getChart().getAllSeries()[0];
      const m = s.type === 'line' ? s.getMarks().find(m => m.name === 'point') : s.getSeriesMark();
      const g = m.getGraphics()[Math.min(2, m.getGraphics().length - 1)];
      const b = g.globalAABBBounds;
      window.__tooltipExpectedValue = String(
        s.getViewData().latestData[Math.min(2, m.getGraphics().length - 1)][s.getSpec().yField]
      );
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    });
    await page.mouse.move(p.x, p.y);
  },
  async verify(page) {
    // 配置和绘制检查与视觉差异共同验证目标条件。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page);
    await page.waitForFunction(() => window.__visualChart.getTooltipHandler()?.isTooltipShown() === true);
    await page.evaluate(() => {
      const spec = window.__visualChart.getSpec();
      if (spec.tooltip.renderMode === 'canvas') {
        const graphics = window.__visualChart
          .getStage()
          .findAll(g => g.name?.includes('tooltip') && g.attribute.visible !== false, true);
        if (!graphics.length) throw Error('Canvas tooltip未绘制');
      } else {
        const elements = [...document.querySelectorAll('[class*="tooltip"]')];
        if (
          !elements.some(
            e =>
              e.textContent.includes(window.__tooltipExpectedValue) &&
              e.getBoundingClientRect().width > 0 &&
              getComputedStyle(e).visibility !== 'hidden' &&
              getComputedStyle(e).display !== 'none'
          )
        )
          throw Error('HTML tooltip没有可见内容');
      }
    });
  }
};
