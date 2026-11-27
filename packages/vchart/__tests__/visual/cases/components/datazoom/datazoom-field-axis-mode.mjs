import { verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7eff52a1e9eec95f9eae
 * 验证目的：显式 field 且未关联轴时，axis 模式仍按字段筛选初始窗口。
 * 图表类型：rangeColumn；关键配置：横向范围柱、时间轴、field、percent/value 混合窗口。
 * 场景条件：保留来源用例的 11 条区间、逆序数据及窗口，移除业务 tooltip 并替换标题。
 * 最终检查：只显示 TOP 9、TOP 8、TOP 6 三条柱；检查时间轴域与手柄范围，截图验证柱条位置。
 * 覆盖边界：只迁移初始状态；更新、空数据回填和 API 交互由 filter-mode.test.ts 验证。
 */
export default {
  createSpec() {
    return {
      type: 'rangeColumn',
      direction: 'horizontal',
      animation: false,
      color: [
        '#3855df',
        '#ffc52b',
        '#5ecf78',
        '#fb7a00',
        '#0acffd',
        '#217dfd',
        '#98dd61',
        '#3150e0',
        '#714efd',
        '#0bcfff',
        '#3d0dde'
      ],
      yField: 'type',
      minField: 'start_time',
      maxField: 'end_time',
      seriesField: 'color',
      data: [
        {
          id: 'data',
          values: [
            [1681926000, 1681927200, 'TOP 1'],
            [1681926000, 1681959600, 'TOP 2'],
            [1681925400, 1681974000, 'TOP 3'],
            [1681924800, 1681933200, 'TOP 4'],
            [1681959600, 1681963200, 'TOP 5'],
            [1681970400, 1681971000, 'TOP 5'],
            [1681992000, 1681992600, 'TOP 5'],
            [1681956000, 1681963200, 'TOP 6'],
            [1681990200, 1681993800, 'TOP 7'],
            [1681948800, 1681959600, 'TOP 8'],
            [1681945200, 1681956000, 'TOP 9']
          ]
            .map(([start_time, end_time, type], color) => ({ start_time, end_time, type, color: String(color) }))
            .reverse()
        }
      ],
      axes: [
        { orient: 'left', type: 'band', bandPadding: 0.5, visible: false },
        { id: 'time', orient: 'bottom', type: 'time', layers: [{ tickStep: 28800, timeFormat: '%Y%m%d %H:%M' }] }
      ],
      dataZoom: [
        {
          orient: 'bottom',
          field: 'start_time',
          valueField: 'type',
          height: 20,
          start: 0.1,
          endValue: 1681956000,
          filterMode: 'axis',
          brushSelect: false,
          startText: { formatMethod: text => Math.floor(text) },
          endText: { formatMethod: text => Math.floor(text) }
        }
      ],
      title: { text: '字段窗口范围筛选' }
    };
  },
  async verify(page) {
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const chart = window.__visualChart.getChart();
      const visible = chart
        .getAllSeries()[0]
        .getViewData()
        .latestData.map(d => d.type);
      if (JSON.stringify(visible) !== '["TOP 9","TOP 8","TOP 6"]') {
        throw assertionError('字段窗口未筛选到三条范围柱，实际值 ' + JSON.stringify(visible));
      }
      const components = chart.getAllComponents();
      const domain = components
        .find(c => c.getSpec().id === 'time')
        .getScale()
        .domain();
      // 允许时间轴 nice 扩展到整刻度，但不能恢复到未筛选数据的完整范围。
      if (domain[0] < 1681931520 || domain[0] > 1681945200 || domain[1] < 1681963200 || domain[1] >= 1681992000) {
        throw assertionError('时间轴未使用筛选后的范围柱端点，实际域 ' + JSON.stringify(domain));
      }
      const { start, end } = components.find(c => c.type === 'dataZoom').getVRenderComponents()[0].attribute;
      if (Math.abs(start - 0.1) > 1e-10 || Math.abs(end - 13 / 28) > 1e-10) {
        throw assertionError('混合模式窗口手柄位置错误');
      }
    });
    await verifyRendered(page);
  }
};
