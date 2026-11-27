import { graphicCenter, verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：更新数据后保留用户拖动后的 DataZoom 窗口。
 * 图表类型：scatter。
 * 关键配置：x 轴固定为 [0, 100]，DataZoom 初始窗口为 [0, 0.25]。
 * 场景条件：拖动两端手柄选择后半段，然后仅更新 y 值。
 * 最终检查：实际窗口不变，更新后的 x=60 和 x=80 可见，预览正常绘制。
 * 覆盖边界：默认 filter 模式，真实鼠标拖动及 updateDataSync。
 */
const createRows = offset => [20, 60, 80].map((x, index) => ({ x, y: index + offset }));

export default {
  createSpec() {
    return {
      type: 'scatter',
      animation: false,
      data: { id: 'data', values: createRows(1) },
      xField: 'x',
      yField: 'y',
      axes: [
        { id: 'x-axis', orient: 'bottom', type: 'linear', min: 0, max: 100, nice: false },
        { orient: 'left', type: 'linear' }
      ],
      dataZoom: [{ axisId: 'x-axis', orient: 'bottom', start: 0, end: 0.25 }]
    };
  },
  async exercise(page) {
    await page.evaluate(() => {
      window.__visualChart.on('dataZoomChange', event => {
        window.__lastZoomWindow = [event.value.start, event.value.end];
      });
    });
    // 扩展右手柄到终点，再将左手柄移到中点。
    const start = await graphicCenter(page, 'startHandler');
    const end = await graphicCenter(page, 'endHandler');
    await page.mouse.move(end.x, end.y);
    await page.mouse.down();
    await page.mouse.move(end.x + 3 * (end.x - start.x) + 20, end.y, { steps: 12 });
    await page.mouse.up();
    await interactionFrame(page);
    const right = await graphicCenter(page, 'endHandler');
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move((start.x + right.x) / 2, start.y, { steps: 12 });
    await page.mouse.up();
    await page.mouse.move(950, 750);
    await interactionFrame(page);
    // 保存真实选区，随后更新数据；verify 同时检查新数据与窗口保持。
    await page.evaluate(rows => {
      const chart = window.__visualChart;
      window.__zoomWindowBeforeUpdate = window.__lastZoomWindow;
      chart.updateDataSync('data', rows);
    }, createRows(5));
    await interactionFrame(page);
  },
  async verify(page) {
    await page.evaluate(async expected => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const chart = window.__visualChart.getChart();
      const zoom = chart.getAllComponents().find(component => component.type === 'dataZoom');
      const before = window.__zoomWindowBeforeUpdate;
      const { start, end } = zoom.getVRenderComponents()[0].attribute;
      if (!before || before[0] < 0.45 || before[0] > 0.55 || before[1] < 0.99) {
        throw assertionError('拖动未形成后半段窗口，实际值 ' + JSON.stringify(before));
      }
      const actual = chart
        .getAllSeries()[0]
        .getViewData()
        .latestData.map(({ x, y }) => ({ x, y }));
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw assertionError('交互窗口未保留更新后的两个点，实际值 ' + JSON.stringify(actual));
      }
      if (start !== before[0] || end !== before[1]) {
        throw assertionError('数据更新重置了用户窗口，实际值 ' + JSON.stringify([start, end]));
      }
    }, createRows(5).slice(1));
    await verifyRendered(page);
  }
};
