import { verifySourceSpec, verifyRendered } from '../../helpers.mjs';
import { interactionFrame } from '../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 66ed43a315288000e7958d90
 * 验证目的：来源 customMark 点击回调修改实际图元。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'line',
      data: [
        {
          id: 'barData',
          values: [
            { State: 'WY', Age: 'Under 5 Years', Population: 25635 },
            { State: 'WY', Age: '5 to 13 Years', Population: 1890 },
            { State: 'WY', Age: '14 to 17 Years', Population: 9314 },
            { State: 'DC', Age: 'Under 5 Years', Population: 30352 },
            { State: 'DC', Age: '5 to 13 Years', Population: 20439 },
            { State: 'DC', Age: '14 to 17 Years', Population: 10225 },
            { State: 'VT', Age: 'Under 5 Years', Population: 38253 },
            { State: 'VT', Age: '5 to 13 Years', Population: 42538 },
            { State: 'VT', Age: '14 to 17 Years', Population: 15757 },
            { State: 'ND', Age: 'Under 5 Years', Population: 51896 },
            { State: 'ND', Age: '5 to 13 Years', Population: 67358 },
            { State: 'ND', Age: '14 to 17 Years', Population: 18794 },
            { State: 'AK', Age: 'Under 5 Years', Population: 72083 },
            { State: 'AK', Age: '5 to 13 Years', Population: 85640 },
            { State: 'AK', Age: '14 to 17 Years', Population: 22153 }
          ]
        }
      ],
      customMark: [
        {
          type: 'rect',
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
          layoutType: 'region-relative',
          orient: 'bottom',
          height: 20,
          visible: true,
          zIndex: 10001,
          style: {
            fill: '#e8e8e8',
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
        }
      ],
      xField: 'State',
      yField: 'Population',
      seriesField: 'Age',
      legends: { visible: true },
      point: {
        style: { size: 0, fill: 'white', stroke: null, lineWidth: 2 },
        state: { dimension_hover: { size: 8 }, unHover_line: { size: 0 } }
      },
      line: { state: { hover_line: { strokeOpacity: 1 }, unHover_line: { strokeOpacity: 0.1 } } },
      crosshair: { xField: { line: { type: 'line' } } }
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(() => {
      const chartSpace = window.__visualChart;
      chartSpace.on('click', { level: 'model', type: 'customMark' }, e => {
        const target = e.event.target;
        target.setAttributes({ fill: 'red' });
      });
    });
    const p = await page.evaluate(() => {
      const c = window.__visualChart;
      const group = c
        .getChart()
        .getAllComponents()
        .find(c => c.type === 'customMark')
        .getMarks()[0]
        .getGraphics()[0];
      const g = group.type === 'group' ? group.find(g => g.type !== 'group', true) : group;
      const b = g.globalAABBBounds;
      window.__customTarget = g;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(p.x, p.y);
    await page.mouse.move(950, 750);
    await interactionFrame(page);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      if (window.__customTarget?.attribute.fill !== 'red') throw Error('customMark 点击回调未修改图元');
    });
  }
};
