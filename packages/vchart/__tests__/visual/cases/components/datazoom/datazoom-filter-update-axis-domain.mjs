import { verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：更新数据后，DataZoom 保留关联分类轴的显式域及顺序。
 * 图表类型：bar。
 * 关键配置：分类轴 domain 为 A、B、C、D，DataZoom 选择前 10%。
 * 场景条件：原始行顺序为 B、A、C、D，更新时仅改变 value。
 * 最终检查：窗口仍显示更新后的 A，状态域和轴域均保持 A、B、C、D。
 * 覆盖边界：使用默认 filter 模式，预览同时包含全部分类。
 */
const createRows = offset => ['B', 'A', 'C', 'D'].map((category, index) => ({ category, value: index + offset }));

export default {
  createSpec() {
    return {
      type: 'bar',
      animation: false,
      data: { id: 'data', values: createRows(1) },
      xField: 'category',
      yField: 'value',
      axes: [
        { id: 'x-axis', orient: 'bottom', type: 'band', domain: ['A', 'B', 'C', 'D'] },
        { orient: 'left', type: 'linear' }
      ],
      dataZoom: [{ axisId: 'x-axis', orient: 'bottom', start: 0, end: 0.1 }]
    };
  },
  async exercise(page) {
    // 真实数据更新后等待渲染完成，不能仅验证初始状态。
    await page.evaluate(rows => {
      window.__visualChart.updateDataSync('data', rows);
    }, createRows(5));
    await interactionFrame(page);
  },
  async verify(page) {
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const model = window.__visualChart.getChart();
      const series = model.getAllSeries()[0];
      const components = model.getAllComponents();
      const zoom = components.find(component => component.type === 'dataZoom');
      const axis = components.find(component => component.getSpec().id === 'x-axis');
      const actual = series.getViewData().latestData.map(({ category, value }) => ({ category, value }));
      if (JSON.stringify(actual) !== JSON.stringify([{ category: 'A', value: 6 }])) {
        throw assertionError('前 10% 窗口未保留更新后的分类 A，实际值 ' + JSON.stringify(actual));
      }
      for (const domain of [zoom.stateScale.domain(), axis.getScale().domain()]) {
        if (JSON.stringify(domain) !== '["A","B","C","D"]') {
          throw assertionError('更新后分类域的顺序改变，实际值 ' + JSON.stringify(domain));
        }
      }
    });
    await verifyRendered(page);
  }
};
