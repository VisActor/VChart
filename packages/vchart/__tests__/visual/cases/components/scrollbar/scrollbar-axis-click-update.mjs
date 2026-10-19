import { verifyRendered, graphicCenter } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 65e982facf6d2600b8a6f9a3
 * 迁移边界：滚动中间态与 updateSpec 后最终态分别断言；原始 spec 更新会恢复初始范围，不能要求最终几何仍保持滚动位置。
 * 验证目的：来源滚动条拖动后点击轴标签更新柱颜色。
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
      scrollBar: [{ orient: 'right', startValue: '2011', endValue: '2014', roam: true }]
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    await page.evaluate(async () => {
      const { cases, loadCase } = await import('./cases/index.mjs');
      const spec = (
          await loadCase(cases.find(c => c.id === new URL(location.href).searchParams.get('case')))
        ).createSpec(),
        chartSpace = window.__visualChart;
      chartSpace.on('click', { nodeName: 'axis-label' }, e => {
        chartSpace.updateSpec({ ...spec, bar: { style: { fill: 'red' } } });
      });
      window.__scrollEvents = [];
      window.__scrollBefore = JSON.stringify(
        chartSpace
          .getChart()
          .getAllSeries()
          .map(s =>
            s
              .getSeriesMark()
              .getGraphics()
              .map(g => [g.attribute.x, g.attribute.y, g.attribute.width, g.attribute.height, g.attribute.points])
          )
      );
      chartSpace.on('scrollBarChange', e => window.__scrollEvents.push({ ...e.value }));
    });
    const p = await graphicCenter(page, 'slider');
    await page.mouse.move(p.x, p.y);
    await page.mouse.down();
    await page.mouse.move(p.x + 0, p.y + 120, { steps: 12 });
    await page.mouse.up();
    await page.mouse.move(950, 750);
    await interactionFrame(page);
    await page.evaluate(
      () =>
        (window.__scrollAfterDrag = JSON.stringify(
          window.__visualChart
            .getChart()
            .getAllSeries()
            .map(s =>
              s
                .getSeriesMark()
                .getGraphics()
                .map(g => [g.attribute.x, g.attribute.y, g.attribute.width, g.attribute.height, g.attribute.points])
            )
        ))
    );
    const label = await page.evaluate(() => {
      const g = window.__visualChart
        .getStage()
        .findAll(g => g.name === 'axis-label' && g.globalAABBBounds.y1 > 20 && g.globalAABBBounds.y2 < 570, true)
        .find(g => g.attribute.pickable !== false);
      if (!g) throw Error('缺少可点击轴标签');
      const b = g.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(label.x, label.y);
    await interactionFrame(page);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。

    await verifyRendered(page);
    await page.evaluate(() => {
      const c = window.__visualChart;
      if (!window.__scrollEvents?.length) throw Error('滚动条未产生范围事件');
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
      if (window.__scrollAfterDrag === window.__scrollBefore) throw Error('滚动未改变绘制');
      if (
        c.getSpec().bar?.style?.fill !== 'red' ||
        !c
          .getChart()
          .getAllSeries()[0]
          .getSeriesMark()
          .getGraphics()
          .every(g => g.attribute.fill === 'red')
      )
        throw Error('轴标签点击没有更新颜色');
    });
  }
};
