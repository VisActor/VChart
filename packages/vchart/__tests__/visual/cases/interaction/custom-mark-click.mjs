import { verifySourceSpec, verifyRendered } from '../../helpers.mjs';

/**
 * BugServer case IDs: 66ed4970ded41300eeb7ff68
 * 验证目的：按 markName 绑定的自定义图元点击更新。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：保留来源动作或按源事件执行操作并检查结果。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'line',
      data: [
        {
          id: 'barData',
          values: [
            {
              State: 'WY',
              Age: 'Under 5 Years',
              Population: 25635
            },
            {
              State: 'WY',
              Age: '5 to 13 Years',
              Population: 1890
            },
            {
              State: 'WY',
              Age: '14 to 17 Years',
              Population: 9314
            },
            {
              State: 'DC',
              Age: 'Under 5 Years',
              Population: 30352
            },
            {
              State: 'DC',
              Age: '5 to 13 Years',
              Population: 20439
            },
            {
              State: 'DC',
              Age: '14 to 17 Years',
              Population: 10225
            },
            {
              State: 'VT',
              Age: 'Under 5 Years',
              Population: 38253
            },
            {
              State: 'VT',
              Age: '5 to 13 Years',
              Population: 42538
            },
            {
              State: 'VT',
              Age: '14 to 17 Years',
              Population: 15757
            },
            {
              State: 'ND',
              Age: 'Under 5 Years',
              Population: 51896
            },
            {
              State: 'ND',
              Age: '5 to 13 Years',
              Population: 67358
            },
            {
              State: 'ND',
              Age: '14 to 17 Years',
              Population: 18794
            },
            {
              State: 'AK',
              Age: 'Under 5 Years',
              Population: 72083
            },
            {
              State: 'AK',
              Age: '5 to 13 Years',
              Population: 85640
            },
            {
              State: 'AK',
              Age: '14 to 17 Years',
              Population: 22153
            }
          ]
        }
      ],
      customMark: [
        {
          type: 'rect',
          name: 'top-rect',
          layoutType: 'region-relative',
          orient: 'top',
          height: 40,
          visible: true,
          zIndex: 10001,
          style: {
            fill: '#c9c9c9',
            x: (datum, ctx) => {
              const bounds = ctx.getLayoutBounds();
              return bounds.x1;
            },

            y: (datum, ctx) => {
              const bounds = ctx.getLayoutBounds();

              return bounds.y1;
            },
            width: (datum, ctx) => {
              const bounds = ctx.getLayoutBounds();

              return bounds.width();
            },
            height: (datum, ctx) => {
              const bounds = ctx.getLayoutBounds();

              return bounds.height();
            }
          }
        },
        {
          type: 'rect',
          name: 'bottom-rect',
          layoutType: 'region-relative',
          orient: 'bottom',
          height: 20,
          visible: true,
          zIndex: 10001,
          style: {
            fill: '#e8e8e8',
            x: (datum, ctx) => {
              const bounds = ctx.getLayoutBounds();
              // return (bounds.x1 + bounds.x2) / 2;
              return bounds.x1;
            },

            y: (datum, ctx) => {
              const bounds = ctx.getLayoutBounds();

              return bounds.y1;
            },
            width: (datum, ctx) => {
              const bounds = ctx.getLayoutBounds();

              return bounds.width();
            },
            height: (datum, ctx) => {
              const bounds = ctx.getLayoutBounds();

              return bounds.height();
            }
          }
        }
      ],
      xField: 'State',
      yField: 'Population',
      seriesField: 'Age',
      legends: {
        visible: true
      },
      point: {
        style: {
          size: 0,
          fill: 'white',
          stroke: null,
          lineWidth: 2
        },
        state: {
          dimension_hover: {
            size: 8
          },

          unHover_line: {
            size: 0
          }
        }
      },
      line: {
        state: {
          hover_line: {
            strokeOpacity: 1
          },
          unHover_line: {
            strokeOpacity: 0.1
          }
        }
      },
      crosshair: {
        xField: {
          line: {
            type: 'line'
          }
        }
      }
    };

    return spec;
  },
  async exercise(page) {
    // 适配源动作；鼠标定位按实际图元，避免绑定旧宿主像素坐标。
    await page.evaluate(() =>
      window.__visualChart.on('click', { markName: 'top-rect' }, e => e.event.target.setAttributes({ fill: 'red' }))
    );
    const point = await page.evaluate(() => {
      const m = window.__visualChart
        .getChart()
        .getComponentsByType('customMark')
        .flatMap(c => c.getMarks())
        .find(m => m.name === 'top-rect');
      const b = m.getGraphics()[0].globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
    await page.mouse.move(950, 750);
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
    await page.waitForFunction(
      () =>
        window.__visualChart.getStage().findAll(g => g.type === 'rect' && g.attribute.fill === 'red', true).length > 0
    );
  }
};
