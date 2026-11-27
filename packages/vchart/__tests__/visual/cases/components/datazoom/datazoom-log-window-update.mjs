import { verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：对数轴的值窗口使用比例尺正反映射，并在交互和数据更新后保持值锚点。
 * 图表类型：scatter；关键配置：log 轴、value/value 窗口，关闭 nice。
 * 场景条件：初始完整域 [1,1000]；API 设置值窗口 [10,100]，组件交互改为 40%–60%，再扩张域。
 * 最终检查：仅显示更新后的 x=20、40，手柄为 30%–45%，预览域为 [1,10000]。
 * 覆盖边界：同时验证 API 正向映射、真实组件事件的反向映射与更新后的锚点保持。
 */
const rows = (expanded, offset) =>
  (expanded ? [1, 10, 20, 40, 100, 1000, 10000] : [1, 10, 20, 40, 100, 1000]).map((x, i) => ({ x, y: i + offset }));
export default {
  createSpec() {
    return {
      type: 'scatter',
      animation: false,
      data: { id: 'data', values: rows(false, 1) },
      xField: 'x',
      yField: 'y',
      axes: [{ id: 'x', orient: 'bottom', type: 'log', nice: false, zero: false }, { orient: 'left' }],
      dataZoom: [{ axisId: 'x', orient: 'bottom', startValue: 1, endValue: 1000, rangeMode: ['value', 'value'] }]
    };
  },
  async exercise(page) {
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const zoom = window.__visualChart.getChart().getAllComponents().find(c => c.type === 'dataZoom');
      zoom.setStartAndEnd(10, 100, ['value', 'value']);
      const component = zoom.getVRenderComponents()[0];
      const background = component.find(g => g.name === 'background', true).attribute;
      const startHandle = component.find(g => g.name === 'startHandler', true).attribute;
      const endHandle = component.find(g => g.name === 'endHandler', true).attribute;
      const start = (startHandle.x - background.x) / background.width;
      const end = (endHandle.x - background.x) / background.width;
      if (Math.abs(start - 1 / 3) > 1e-10 || Math.abs(end - 2 / 3) > 1e-10) {
        throw assertionError('对数值窗口未按比例尺定位到 1/3–2/3');
      }
      const visible = window.__visualChart.getChart().getAllSeries()[0].getViewData().latestData.map(d => d.x);
      if (JSON.stringify(visible) !== '[10,20,40,100]') {
        throw assertionError('对数值窗口未保留 API 的值端点，实际值 ' + JSON.stringify(visible));
      }
      component.setStartAndEnd(0.4, 0.6);
    });
    await interactionFrame(page);
    await page.evaluate(values => window.__visualChart.updateDataSync('data', values), rows(true, 5));
    await interactionFrame(page);
  },
  async verify(page) {
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const chart = window.__visualChart.getChart();
      const zoom = chart.getAllComponents().find(c => c.type === 'dataZoom');
      const actual = chart.getAllSeries()[0].getViewData().latestData.map(({ x, y }) => ({ x, y }));
      if (JSON.stringify(actual) !== JSON.stringify([{ x: 20, y: 7 }, { x: 40, y: 8 }])) {
        throw assertionError('对数窗口交互/更新后的筛选错误，实际值 ' + JSON.stringify(actual));
      }
      const { start, end } = zoom.getVRenderComponents()[0].attribute;
      if (Math.abs(start - 0.3) > 1e-10 || Math.abs(end - 0.45) > 1e-10) {
        throw assertionError('更新后的对数窗口未保持交互值锚点，实际位置 ' + JSON.stringify([start, end]));
      }
      if (JSON.stringify(zoom.stateScale.domain()) !== '[1,10000]') {
        throw assertionError('对数预览未恢复完整更新域');
      }
    });
    await verifyRendered(page);
  }
};
