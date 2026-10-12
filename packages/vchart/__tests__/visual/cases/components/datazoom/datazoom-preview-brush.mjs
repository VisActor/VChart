import { verifySourceSpec, verifyRendered, graphicCenter } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 65f7f08fe17cd600d4f92832
 * 验证目的：来源 DataZoom 拖动及有效范围约束。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'common',
      autoFit: true,
      data: [
        {
          id: 'id0',
          values: [
            { x: 1, y: 20 },
            { x: 2, y: 40 },
            { x: 3, y: 30 },
            { x: 4, y: 50 },
            { x: 5, y: 40 }
          ]
        }
      ],
      width: 600,
      height: 600,
      series: [{ type: 'line', dataIndex: 0, xField: 'x', yField: 'y' }],
      dataZoom: [{ orient: 'bottom', start: 0, delayType: 'throttle', brushSelect: true, showDetail: true }],
      axes: [{ orient: 'left' }, { orient: 'bottom' }]
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
    const p = await graphicCenter(page, 'background');
    await page.mouse.move(p.x, p.y);
    await page.mouse.down();
    await page.mouse.move(p.x + 160, p.y + 0, { steps: 12 });
    // 保留源 throttle；松开前等待最后一次范围事件，避免尚未处理的尾端移动被丢弃。
    const end = await page.evaluate(() => {
      const background = window.__visualChart.getStage().find(g => g.name === 'background', true);
      return Math.min(1, 0.5 + 160 / background.attribute.width);
    });
    await page.waitForFunction(end => Math.abs(window.__zoomEvents?.at(-1)?.end - end) < 1e-8, end);
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
