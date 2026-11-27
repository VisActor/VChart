import { verifyRendered } from '../../../helpers.mjs';
import { interactionFrame } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：默认 filter 模式在数据回填时重新应用原窗口并绘制预览。
 * 关键配置：折线图、底部 DataZoom、0–40% 窗口、原始 updateDataSync 更新。
 * 场景条件：固定九条数据，先渲染非空图以满足视觉宿主检查，再清空并回填。
 * 最终检查：主图恢复四个分类，预览使用完整数据域，选区与手柄保持正确层级。
 * 覆盖边界：回填后不拖动手柄，空数据初始化另由组件单测覆盖。
 */
const times = ['2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
const values = [8, 9, 11, 14, 16, 17, 17, 16, 15];
const createRows = () => times.map((time, index) => ({ time, value: values[index] }));

export default {
  createSpec() {
    return {
      type: 'line',
      animation: false,
      data: { id: 'data0', values: createRows() },
      xField: 'time',
      yField: 'value',
      dataZoom: [{ orient: 'bottom', start: 0, end: 0.4 }]
    };
  },
  async exercise(page) {
    await page.evaluate(rows => {
      const chart = window.__visualChart;
      chart.updateDataSync('data0', []);
      const series = chart.getChart().getAllSeries()[0];
      window.__datazoomFilterUpdateCleared = series.getViewData().latestData.length === 0;
      chart.updateDataSync('data0', rows);
    }, createRows());
    await interactionFrame(page);
  },
  async verify(page) {
    await page.evaluate(async times => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const chart = window.__visualChart;
      const model = chart.getChart();
      const series = model.getAllSeries()[0];
      const zoom = model.getAllComponents().find(component => component.type === 'dataZoom');
      const actual = series.getViewData().latestData.map(d => d.time);
      if (!window.__datazoomFilterUpdateCleared || JSON.stringify(actual) !== JSON.stringify(times.slice(0, 4))) {
        throw assertionError('回填数据后未恢复 0–40% 窗口，实际分类 ' + JSON.stringify(actual));
      }
      if (JSON.stringify(zoom.stateScale.domain()) !== JSON.stringify(times)) {
        throw assertionError('DataZoom 状态域未恢复全部分类');
      }
      const stage = chart.getStage();
      const preview = stage.find(g => g.name === 'previewLine', true);
      const points = preview?.attribute.points ?? [];
      if (
        preview?.attribute.visible === false ||
        points.length < times.length ||
        !points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)) ||
        !(preview.globalAABBBounds.width() > 0 && preview.globalAABBBounds.height() > 0)
      ) {
        throw assertionError('DataZoom 预览线未正确绘制');
      }
      const layer = name => stage.find(g => g.name === name, true)?.attribute.zIndex;
      if (!(layer('previewGroup') < layer('selectedBackground') && layer('selectedBackground') < layer('endHandler'))) {
        throw assertionError('DataZoom 预览、选区与手柄层级错误');
      }
    }, times);
    await verifyRendered(page);
  }
};
