import { DataSet, DataView, csvParser } from '@visactor/vdataset';
import { VChart } from '../../../src/vchart-all';
import { createCanvas, removeDom } from '../../util/dom';
import type { IHeatmapChartSpec } from '../../../src';

/**
 * 验证热力图颜色映射字段来源于 valueField
 * 目的：确保 HeatmapSeries.getColorAttribute() 的 field 为度量字段（valueField）
 * 前置：构造一个简单热力图，指定 valueField='v'
 * 断言：series.getMeasureField()[0] 与 getColorAttribute().field 均为 'v'
 */
describe('heatmap color mapping field', () => {
  let canvasDom: HTMLCanvasElement;
  let vchart: VChart;

  beforeEach(() => {
    canvasDom = createCanvas();
    canvasDom.style.position = 'relative';
    canvasDom.style.width = '500px';
    canvasDom.style.height = '500px';
    canvasDom.width = 500;
    canvasDom.height = 500;
  });

  afterEach(() => {
    removeDom(canvasDom);
    vchart.release();
  });

  /**
   * 场景：构建 2x4 的热力图并渲染，读取系列颜色映射配置
   * 输入：x=['A','B']，y=[1..4]，v 为数值
   * 断言：颜色映射配置的 field 与度量字段均为 'v'
   */
  it('color attribute field equals valueField', async () => {
    const dataSet = new DataSet();
    dataSet.registerParser('csv', csvParser);
    const dataView = new DataView(dataSet);

    const data = `x,y,v\nA,1,10\nA,2,20\nA,3,30\nA,4,40\nB,1,50\nB,2,60\nB,3,70\nB,4,80`;
    dataView.parse(data, { type: 'csv' });

    vchart = new VChart(
      {
        type: 'heatmap',
        xField: 'x',
        yField: 'y',
        valueField: 'v',
        data: dataView,
        animation: false,
        tooltip: { visible: false }
      } as IHeatmapChartSpec,
      {
        renderCanvas: canvasDom,
        autoFit: true,
        animation: false
      }
    );

    await vchart.renderAsync();

    const series = vchart.getChart().getAllSeries()[0] as any;

    const measureField = series.getMeasureField()[0];
    expect(measureField).toBe('v');

    const colorAttr = series.getColorAttribute();
    expect(colorAttr && colorAttr.field).toBe('v');

    const datum = series.getViewData().latestData[0];
    const cellMark = series.getActiveMarks()[0];
    const fillValue = cellMark.getAttribute('fill', datum);
    expect(typeof fillValue === 'string' && fillValue.length > 0).toBe(true);
  });
});
