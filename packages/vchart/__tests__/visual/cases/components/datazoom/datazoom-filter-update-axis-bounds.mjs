import { verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：关联轴固定范围时，更新数据后仍按配置的轴域计算筛选窗口。
 * 图表类型：scatter。
 * 关键配置：线性 x 轴固定为 [0, 100]，DataZoom 默认 filter 模式，窗口为 0–50%。
 * 场景条件：更新两个点的 y 值，x 值保持为 20、40。
 * 最终检查：状态域仍为 [0, 100]，更新后的两个点均保留并绘出。
 * 覆盖边界：更新过程沿用原窗口，不拖动手柄。
 */
const updated = [
  { x: 20, y: 3 },
  { x: 40, y: 4 }
];

export default {
  createSpec() {
    return {
      type: 'scatter',
      animation: false,
      data: {
        id: 'data',
        values: [
          { x: 20, y: 1 },
          { x: 40, y: 2 }
        ]
      },
      xField: 'x',
      yField: 'y',
      axes: [
        { id: 'x-axis', orient: 'bottom', type: 'linear', min: 0, max: 100 },
        { orient: 'left', type: 'linear' }
      ],
      dataZoom: [{ axisId: 'x-axis', orient: 'bottom', start: 0, end: 0.5 }]
    };
  },
  async exercise(page) {
    // 保留原来的 x 值，通过 y 值的变化确认实际完成了数据更新。
    await page.evaluate(rows => {
      window.__visualChart.updateDataSync('data', rows);
    }, updated);
    await interactionFrame(page);
  },
  async verify(page) {
    await page.evaluate(async rows => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const model = window.__visualChart.getChart();
      const series = model.getAllSeries()[0];
      const zoom = model.getAllComponents().find(component => component.type === 'dataZoom');
      const actual = series.getViewData().latestData.map(({ x, y }) => ({ x, y }));
      if (JSON.stringify(actual) !== JSON.stringify(rows)) {
        throw assertionError('固定轴域的 50% 窗口未保留两个更新后的点，实际值 ' + JSON.stringify(actual));
      }
      const domain = zoom.stateScale.domain();
      if (JSON.stringify(domain) !== '[0,100]') {
        throw assertionError('更新后的 DataZoom 状态域未保留轴的固定边界，实际值 ' + JSON.stringify(domain));
      }
    }, updated);
    await verifyRendered(page);
  }
};
