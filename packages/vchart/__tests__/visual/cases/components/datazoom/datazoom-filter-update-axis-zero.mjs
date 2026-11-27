import { verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：更新数据后，关联线性轴默认包含的零仍参与 DataZoom 窗口计算。
 * 图表类型：scatter。
 * 关键配置：线性 x 轴关闭 nice，DataZoom 选择后 50%。
 * 场景条件：三个 x 值均为正，更新时仅改变 y。
 * 最终检查：状态域为 [0, 40]，更新后的 x=20 和 x=40 仍可见。
 * 覆盖边界：使用默认 zero，不配置显式轴边界。
 */
const createRows = offset => [10, 20, 40].map((x, index) => ({ x, y: index + offset }));

export default {
  createSpec() {
    return {
      type: 'scatter',
      animation: false,
      data: { id: 'data', values: createRows(1) },
      xField: 'x',
      yField: 'y',
      axes: [
        { id: 'x-axis', orient: 'bottom', type: 'linear', nice: false },
        { orient: 'left', type: 'linear' }
      ],
      dataZoom: [{ axisId: 'x-axis', orient: 'bottom', start: 0.5, end: 1 }]
    };
  },
  async exercise(page) {
    await page.evaluate(rows => {
      window.__visualChart.updateDataSync('data', rows);
    }, createRows(5));
    await interactionFrame(page);
  },
  async verify(page) {
    await page.evaluate(async expected => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const model = window.__visualChart.getChart();
      const series = model.getAllSeries()[0];
      const zoom = model.getAllComponents().find(component => component.type === 'dataZoom');
      const actual = series.getViewData().latestData.map(({ x, y }) => ({ x, y }));
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw assertionError('含零轴域的后 50% 窗口未保留两个更新后的点，实际值 ' + JSON.stringify(actual));
      }
      const domain = zoom.stateScale.domain();
      if (JSON.stringify(domain) !== '[0,40]') {
        throw assertionError('更新后 DataZoom 状态域未包含零，实际值 ' + JSON.stringify(domain));
      }
    }, createRows(5).slice(1));
    await verifyRendered(page);
  }
};
