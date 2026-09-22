import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 64d05b3ea77f904af107fe73
 * 验证目的：拖拽矩形刷选后区分命中和未命中的散点。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：保留来源动作或按源事件执行操作并检查结果。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'scatter',
      data: [
        {
          values: [
            { x: 936196, size: 83431, y: 1371, type: 'Technology', area: 'Northeast' },
            { x: 1270911, size: 219815, y: 5590, type: 'Office supplies', area: 'Central South' },
            { x: 453898, size: 19061, y: 727, type: 'Technology', area: 'Southwest' },
            { x: 919743, size: 148800, y: 1199, type: 'Furniture', area: 'North' },
            { x: 1676224, size: 163453, y: 2517, type: 'Furniture', area: 'East' },
            { x: 1466575, size: 251487, y: 2087, type: 'Technology', area: 'Central South' },
            { x: 824673, size: 86067, y: 3622, type: 'Office supplies', area: 'Northeast' },
            { x: 230956, size: 24016, y: 347, type: 'Technology', area: 'Northwest' },
            { x: 1599653, size: 228179, y: 2183, type: 'Technology', area: 'East' },
            { x: 745813, size: 137265, y: 3020, type: 'Office supplies', area: 'North' },
            { x: 267870, size: 49633, y: 970, type: 'Office supplies', area: 'Northwest' },
            { x: 1408628, size: 215585, y: 6341, type: 'Office supplies', area: 'East' },
            { x: 781743, size: 144986, y: 927, type: 'Technology', area: 'North' },
            { x: 501533, size: 29303, y: 814, type: 'Furniture', area: 'Southwest' },
            { x: 920698, size: 72692, y: 1470, type: 'Furniture', area: 'Northeast' },
            { x: 316212, size: 24903, y: 468, type: 'Furniture', area: 'Northwest' },
            { x: 1399928, size: 199582, y: 2023, type: 'Furniture', area: 'Central South' },
            { x: 347692, size: 49272, y: 1858, type: 'Office supplies', area: 'Southwest' }
          ]
        }
      ],
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      sizeField: 'size',
      size: [10, 25],
      shapeField: 'type',
      shape: ['circle', 'triangle'],
      axes: [
        { orient: 'left', range: { min: 0 }, type: 'linear' },
        { orient: 'bottom', label: { visible: true }, type: 'linear' }
      ],
      legends: [
        {
          visible: true,
          orient: 'left',
          position: 'start',
          title: {
            visible: true,
            style: {
              text: 'Title'
            }
          },
          item: {
            visible: true
          }
        }
      ],
      direction: 'horizontal',
      brush: {
        brushType: 'rect',
        inBrush: {
          colorAlpha: 1
        },
        outOfBrush: {
          colorAlpha: 0.2
        },
        sizeThreshold: 8
      },
      tooltip: {
        transitionDuration: 0
      }
    };

    return spec;
  },
  async exercise(page) {
    // 适配源动作；鼠标定位按实际图元，避免绑定旧宿主像素坐标。
    await page.evaluate(() =>
      window.__visualChart.on('brushEnd', e => {
        window.__brushState = { inside: e.value.inBrushData.length, outside: e.value.outOfBrushData.length };
      })
    );
    const point = await page.evaluate(() => {
      const g = window.__visualChart.getChart().getAllSeries()[0].getSeriesMark().getGraphics()[0];
      const b = g.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    });
    await page.mouse.move(point.x - 18, point.y - 18);
    await page.mouse.down();
    await page.mouse.move(point.x + 18, point.y + 18, { steps: 8 });
    await page.mouse.up();
    await page.mouse.move(950, 750);
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
    await page.waitForFunction(() => {
      const graphics = window.__visualChart.getChart().getAllSeries()[0].getSeriesMark().getGraphics();
      return (
        graphics.some(g => g.currentStates?.includes('inBrush')) &&
        graphics.some(g => g.currentStates?.includes('outOfBrush'))
      );
    });
  }
};
