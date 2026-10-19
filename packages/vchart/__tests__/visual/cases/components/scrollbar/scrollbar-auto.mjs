import { verifySourceSpec, verifyRendered, graphicCenter } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 64fe90861754d74d66e96291
 * 迁移边界：固定数据只有九类；先缩窄至 360×600，保留 bandSize:50 以产生真实溢出。
 * 验证目的：来源滚动条拖动与实际可视范围。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const spec = {
      type: 'area',
      data: {
        values: [
          { type: 'Nail polish', country: 'Africa', value: 4229 },
          { type: 'Nail polish', country: 'EU', value: 4376 },
          { type: 'Nail polish', country: 'China', value: 3054 },
          { type: 'Nail polish', country: 'USA', value: 12814 },
          { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
          { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
          { type: 'Eyebrow pencil', country: 'China', value: 5067 },
          { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
          { type: 'Rouge', country: 'Africa', value: 5221 },
          { type: 'Rouge', country: 'EU', value: 3574 },
          { type: 'Rouge', country: 'China', value: 7004 },
          { type: 'Rouge', country: 'USA', value: 11624 },
          { type: 'Lipstick', country: 'Africa', value: 9256 },
          { type: 'Lipstick', country: 'EU', value: 4376 },
          { type: 'Lipstick', country: 'China', value: 9054 },
          { type: 'Lipstick', country: 'USA', value: 8814 },
          { type: 'Eyeshadows', country: 'Africa', value: 3308 },
          { type: 'Eyeshadows', country: 'EU', value: 4572 },
          { type: 'Eyeshadows', country: 'China', value: 12043 },
          { type: 'Eyeshadows', country: 'USA', value: 12998 },
          { type: 'Eyeliner', country: 'Africa', value: 5432 },
          { type: 'Eyeliner', country: 'EU', value: 3417 },
          { type: 'Eyeliner', country: 'China', value: 15067 },
          { type: 'Eyeliner', country: 'USA', value: 12321 },
          { type: 'Foundation', country: 'Africa', value: 13701 },
          { type: 'Foundation', country: 'EU', value: 5231 },
          { type: 'Foundation', country: 'China', value: 10119 },
          { type: 'Foundation', country: 'USA', value: 10342 },
          { type: 'Lip gloss', country: 'Africa', value: 4008 },
          { type: 'Lip gloss', country: 'EU', value: 4572 },
          { type: 'Lip gloss', country: 'China', value: 12043 },
          { type: 'Lip gloss', country: 'USA', value: 22998 },
          { type: 'Mascara', country: 'Africa', value: 18712 },
          { type: 'Mascara', country: 'EU', value: 6134 },
          { type: 'Mascara', country: 'China', value: 10419 },
          { type: 'Mascara', country: 'USA', value: 11261 }
        ]
      },
      title: { visible: true, text: 'Stacked area chart of cosmetic products sales' },
      xField: 'type',
      yField: 'value',
      seriesField: 'country',
      legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
      crosshair: {
        xField: { visible: true, label: { visible: true } },
        yField: { visible: true, label: { visible: true } }
      },
      axes: [
        { orient: 'bottom', type: 'band', bandSize: 50, sampling: false, label: { autoRotate: true } },
        { orient: 'left', type: 'linear' }
      ],
      scrollBar: [{ orient: 'bottom', start: 0, filterMode: 'axis', axisIndex: 0, auto: true }]
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
    await page.evaluate(() => window.__visualChart.resize(360, 600));
    await interactionFrame(page);
    const p = await graphicCenter(page, 'slider');
    await page.mouse.move(p.x, p.y);
    await page.mouse.down();
    await page.mouse.move(p.x + 120, p.y + 0, { steps: 12 });
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
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。

    await verifySourceSpec(page);
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
    });
  }
};
