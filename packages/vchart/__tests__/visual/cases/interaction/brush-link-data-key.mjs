import { verifyRendered } from '../../helpers.mjs';
import { interactionTarget, interactionFrame } from '../../interaction-helpers.mjs';
/**
 * 验证目的：多变量面板按观测 id 联动框选，不按相同像素范围错误选点。
 * 图表类型：common/scatter。关键配置：brushLinkDataKey='id'。
 * 场景条件：两个面板中 A/B 的位置互换，框选 A 后目标面板须仍选中 A。
 * 最终检查：真实 inBrush/outOfBrush 状态；未执行框选时不能通过。
 */
export default {
  createSpec() {
    return {
      type: 'common',
      animation: false,
      layout: {
        type: 'grid',
        col: 5,
        row: 2,
        colWidth: [
          { index: 0, size: 50 },
          { index: 2, size: 20 },
          { index: 3, size: 50 }
        ],
        elements: [
          { modelId: 'left', col: 1, row: 0 },
          { modelId: 'right', col: 4, row: 0 },
          { modelId: 'x0', col: 1, row: 1 },
          { modelId: 'x1', col: 4, row: 1 },
          { modelId: 'y0', col: 0, row: 0 },
          { modelId: 'y1', col: 3, row: 0 }
        ]
      },
      region: [{ id: 'left' }, { id: 'right' }],
      series: [
        {
          type: 'scatter',
          id: 'source',
          regionId: 'left',
          data: {
            id: 'a',
            values: [
              { id: 'A', x: 2, y: 2 },
              { id: 'B', x: 8, y: 8 }
            ]
          },
          xField: 'x',
          yField: 'y',
          size: 14
        },
        {
          type: 'scatter',
          id: 'target',
          regionId: 'right',
          data: {
            id: 'b',
            values: [
              { id: 'A', x: 8, y: 8 },
              { id: 'B', x: 2, y: 2 }
            ]
          },
          xField: 'x',
          yField: 'y',
          size: 14
        }
      ],
      axes: [
        ...['left', 'right'].flatMap((regionId, i) => [
          { id: `x${i}`, regionId, orient: 'bottom', type: 'linear', min: 0, max: 10 },
          { id: `y${i}`, regionId, orient: 'left', type: 'linear', min: 0, max: 10 }
        ])
      ],
      brush: {
        regionId: 'left',
        seriesId: 'source',
        brushLinkSeriesId: 'target',
        brushLinkDataKey: 'id',
        inBrush: { colorAlpha: 1 },
        outOfBrush: { colorAlpha: 0.15 }
      }
    };
  },
  async exercise(page) {
    const point = await interactionTarget(page, 'point', 0, 0);
    await page.mouse.move(point.x - 18, point.y - 18);
    await page.mouse.down();
    await page.mouse.move(point.x + 18, point.y + 18, { steps: 8 });
    await page.mouse.up();
    await page.mouse.move(950, 750);
    await interactionFrame(page);
  },
  async verify(page) {
    await verifyRendered(page);
    await page.evaluate(() => {
      const target = window.__visualChart.getChart().getAllSeries()[1];
      const points = target.getSeriesMark().getGraphics();
      const a = points.find(p => p.context.data[0].id === 'A'),
        b = points.find(p => p.context.data[0].id === 'B');
      if (!a.hasState('inBrush') || !b.hasState('outOfBrush')) {
        throw new Error('Brush must link the same observation id across differently positioned panels');
      }
    });
  }
};
