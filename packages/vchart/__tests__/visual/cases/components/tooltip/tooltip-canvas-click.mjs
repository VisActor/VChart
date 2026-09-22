import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e038d
 * 验证目的：点击触发Canvas提示框。
 * 保留条件：原始数据与配置；通用文字翻译保留字段关联和长标签场景。
 * 覆盖边界：按图元适配来源鼠标动作，检查最终提示框状态。
 */
export default {
  createSpec() {
    // 返回来源的独立确定性配置。
    return {
      type: 'line',
      data: [
        {
          id: 'id0',
          values: [
            {
              x: '0',
              type: 'A',
              y: '860'
            },
            {
              x: '1',
              type: 'A',
              y: '721'
            },
            {
              x: '2',
              type: 'A',
              y: '653'
            },
            {
              x: '3',
              type: 'A',
              y: '726'
            },
            {
              x: '4',
              type: 'A',
              y: '645'
            },
            {
              x: '5',
              type: 'A',
              y: '853'
            },
            {
              x: '6',
              type: 'A',
              y: '602'
            },
            {
              x: '7',
              type: 'A',
              y: '810'
            },
            {
              x: '8',
              type: 'A',
              y: '879'
            },
            {
              x: '9',
              type: 'A',
              y: '837'
            },
            {
              x: '0',
              type: 'B',
              y: '816'
            },
            {
              x: '1',
              type: 'B',
              y: '608'
            },
            {
              x: '2',
              type: 'B',
              y: '787'
            },
            {
              x: '3',
              type: 'B',
              y: '704'
            },
            {
              x: '4',
              type: 'B',
              y: '791'
            },
            {
              x: '5',
              type: 'B',
              y: '849'
            },
            {
              x: '6',
              type: 'B',
              y: '893'
            },
            {
              x: '7',
              type: 'B',
              y: '686'
            },
            {
              x: '8',
              type: 'B',
              y: '638'
            },
            {
              x: '9',
              type: 'B',
              y: '810'
            }
          ]
        }
      ],
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      axes: [
        {
          orient: 'left',
          range: {
            min: 500
          },
          expand: {
            max: 0.2
          },
          tickCount: 6,
          forceTickCount: 6
        },
        {
          orient: 'bottom',
          label: {
            visible: true
          }
        }
      ],
      tooltip: {
        visible: true,
        renderMode: 'canvas',
        trigger: 'click'
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
    await page.mouse.click(p.x, p.y);
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
