import { verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：数据域扩张后，DataZoom 的 value 窗口保持数据值端点。
 * 图表类型：scatter；关键配置：value/value 窗口 [20,40]，线性轴关闭 nice/zero。
 * 场景条件：原始域 [0,100]，更新 y 并增加 x=200；不拖动窗口。
 * 最终检查：仍显示更新后的 x=20、40，手柄百分比改为 [0.1,0.2]，预览覆盖 [0,200]。
 * 覆盖边界：值端点与派生百分比分离，更新不能把窗口漂移到 [40,80]。
 */
const createRows = (expanded, offset) =>
  (expanded ? [0, 20, 40, 80, 100, 200] : [0, 20, 40, 80, 100]).map((x, i) => ({ x, y: i + offset }));
export default {
  createSpec() {
    return {
      type: 'scatter',
      animation: false,
      data: { id: 'data', values: createRows(false, 1) },
      xField: 'x',
      yField: 'y',
      axes: [{ id: 'x', orient: 'bottom', type: 'linear', nice: false, zero: false }, { orient: 'left' }],
      dataZoom: [{ axisId: 'x', orient: 'bottom', startValue: 20, endValue: 40, rangeMode: ['value', 'value'] }]
    };
  },
  async exercise(page) {
    await page.evaluate(values => window.__visualChart.updateDataSync('data', values), createRows(true, 5));
    await interactionFrame(page);
  },
  async verify(page) {
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const chart = window.__visualChart.getChart();
      const zoom = chart.getAllComponents().find(c => c.type === 'dataZoom');
      const actual = chart
        .getAllSeries()[0]
        .getViewData()
        .latestData.map(({ x, y }) => ({ x, y }));
      if (
        JSON.stringify(actual) !==
        JSON.stringify([
          { x: 20, y: 6 },
          { x: 40, y: 7 }
        ])
      ) {
        throw assertionError('值窗口未保留更新后的 20、40，实际值 ' + JSON.stringify(actual));
      }
      const { start, end } = zoom.getVRenderComponents()[0].attribute;
      if (Math.abs(start - 0.1) > 1e-10 || Math.abs(end - 0.2) > 1e-10) {
        throw assertionError('值窗口的派生百分比错误，实际值 ' + JSON.stringify([start, end]));
      }
      if (JSON.stringify(zoom.stateScale.domain()) !== '[0,200]') {
        throw assertionError('DataZoom 未使用完整更新域');
      }
    });
    await verifyRendered(page);
  }
};
