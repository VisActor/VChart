import { verifySourceSpec, verifyRendered, graphicCenter } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 6620bfc6b19f5100ced6a52e
 * 验证目的：来源 DataZoom 拖动及有效范围约束。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'bar',
      data: [
        {
          id: 'barData',
          values: [
            { year: '2000', sales: 22 },
            { year: '2001', sales: 13 },
            { year: '2002', sales: 25 },
            { year: '2003', sales: 29 },
            { year: '2004', sales: 38 },
            { year: '2005', sales: 49 },
            { year: '2006', sales: 58 },
            { year: '2007', sales: 29 },
            { year: '2008', sales: 78 },
            { year: '2009', sales: 19 },
            { year: '2010', sales: 23 },
            { year: '2011', sales: 20 },
            { year: '2012', sales: 98 },
            { year: '2013', sales: 49 },
            { year: '2014', sales: 28 }
          ]
        }
      ],
      direction: 'horizontal',
      yField: 'year',
      xField: 'sales',
      dataZoom: [{ orient: 'right', roam: true, start: 0, end: 0.2, minSpan: 0.2, maxSpan: 0.2 }]
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(() => {
      const c = window.__visualChart;
      window.__zoomEvents = [];
      window.__zoomBefore = JSON.stringify(
        c
          .getChart()
          .getAllSeries()
          .map(s =>
            s
              .getSeriesMark()
              .getGraphics()
              .map(g => [g.attribute.x, g.attribute.y, g.attribute.width, g.attribute.height, g.attribute.points])
          )
      );
      c.on('dataZoomChange', e => window.__zoomEvents.push({ ...e.value }));
    });
    const p = await graphicCenter(page, 'selectedBackground');
    await page.mouse.move(p.x, p.y);
    await page.mouse.down();
    await page.mouse.move(p.x + 0, p.y + 140, { steps: 12 });
    await page.mouse.up();
    await page.mouse.move(950, 750);
    await interactionFrame(page);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      const c = window.__visualChart,
        events = window.__zoomEvents,
        r = events?.at(-1),
        cfg = c.getSpec().dataZoom[0];
      if (!r || !Number.isFinite(r.start) || !Number.isFinite(r.end) || r.end <= r.start)
        throw Error('未产生有效范围变化');
      const span = r.end - r.start;
      if (
        (cfg.minSpan !== undefined && span < cfg.minSpan - 1e-6) ||
        (cfg.maxSpan !== undefined && span > cfg.maxSpan + 1e-6)
      )
        throw Error('范围违反来源 minSpan/maxSpan');
      const actual = JSON.stringify(
        c
          .getChart()
          .getAllSeries()
          .map(s =>
            s
              .getSeriesMark()
              .getGraphics()
              .map(g => [g.attribute.x, g.attribute.y, g.attribute.width, g.attribute.height, g.attribute.points])
          )
      );
      if (actual === window.__zoomBefore) throw Error('缩放没有影响实际绘制');
    });
  }
};
