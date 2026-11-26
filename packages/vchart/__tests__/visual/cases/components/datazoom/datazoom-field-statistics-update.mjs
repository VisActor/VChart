import { verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：显式字段的统计类型变化后，DataZoom 更新筛选和预览使用的状态比例尺。
 * 关键配置：散点图、无关联轴的 DataZoom、0–25% 窗口。
 * 场景条件：先渲染数值数据，再锁定空域并清空数据，最后解除锁定并回填非等距数值。
 * 最终检查：空数据时使用分类比例尺，回填后按数值范围筛选并按数值间距绘制预览。
 * 覆盖边界：更新过程沿用原窗口，不拖动手柄。
 */
const createRows = () => [
  { x: 0, y: 1 },
  { x: 50, y: 3 },
  { x: 100, y: 2 },
  { x: 1000, y: 4 }
];

export default {
  createSpec() {
    return {
      type: 'scatter',
      animation: false,
      data: { id: 'data', values: createRows() },
      xField: 'x',
      yField: 'y',
      axes: [
        { orient: 'bottom', type: 'linear' },
        { orient: 'left', type: 'linear' }
      ],
      dataZoom: [{ orient: 'bottom', field: 'x', valueField: 'y', start: 0, end: 0.25 }]
    };
  },
  async exercise(page) {
    await page.evaluate(async rows => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const chart = window.__visualChart;
      const model = chart.getChart();
      const series = model.getAllSeries()[0];
      const zoom = model.getAllComponents().find(component => component.type === 'dataZoom');
      chart.updateFullDataSync({ id: 'data', values: [], fields: { x: { lockStatisticsByDomain: true, domain: [] } } });
      if (series.getViewData().latestData.length !== 0 || zoom.stateScale.type !== 'band') {
        throw assertionError('锁定空域后 DataZoom 未切换到空分类域');
      }
      chart.updateFullDataSync({ id: 'data', values: rows, fields: { x: { lockStatisticsByDomain: false } } });
    }, createRows());
    await interactionFrame(page);
  },
  async verify(page) {
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const chart = window.__visualChart;
      const model = chart.getChart();
      const zoom = model.getAllComponents().find(component => component.type === 'dataZoom');
      const actual = model
        .getAllSeries()[0]
        .getViewData()
        .latestData.map(row => row.x);
      if (zoom.stateScale.type !== 'linear' || JSON.stringify(zoom.stateScale.domain()) !== '[0,1000]') {
        throw assertionError('回填后 DataZoom 未恢复完整的连续域');
      }
      if (JSON.stringify(actual) !== '[0,50,100]') {
        throw assertionError('25% 窗口未按数值范围筛选，实际值 ' + JSON.stringify(actual));
      }
      const preview = chart.getStage().find(graphic => graphic.name === 'previewLine', true);
      const points = preview?.attribute.points ?? [];
      // VRender 在预览线首尾各添加一个连接到边缘的点。
      const dataPoints = points.slice(1, -1);
      if (
        preview?.attribute.visible === false ||
        dataPoints.length !== 4 ||
        !points.every(point => Number.isFinite(point.x) && Number.isFinite(point.y)) ||
        !(dataPoints[1].x > dataPoints[0].x && dataPoints[3].x - dataPoints[2].x > dataPoints[1].x - dataPoints[0].x)
      ) {
        throw assertionError('DataZoom 预览未按连续数值间距绘制');
      }
    });
    await verifyRendered(page);
  }
};
