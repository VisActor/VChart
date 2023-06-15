import { DataSet, DataView, csvParser, dataViewParser } from '@visactor/vdataset';
import { VChart } from '../../../src/vchart-all';
import type { ITheme } from '../../../src/theme';
// eslint-disable-next-line no-duplicate-imports
import { ThemeManager } from '../../../src/theme';
import { createCanvas, removeDom } from '../../util/dom';
import type { ILineChartSpec } from '../../../src';

describe('theme switch test', () => {
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

  it('theme switch', async () => {
    const dataSet = new DataSet();
    dataSet.registerParser('csv', csvParser);
    dataSet.registerParser('dataview', dataViewParser);
    const dataView = new DataView(dataSet);
    const data = `x,type,y
    1,1,850
    2,2,740
    3,3,900
    4,4,570
    5,5,670`;
    dataView.parse(data, {
      type: 'csv'
    });
    const spec: ILineChartSpec = {
      type: 'line',
      xField: 'x',
      yField: 'y',
      data: dataView,
      animation: false,
      tooltip: {
        visible: false
      }
    };

    vchart = new VChart(spec, {
      renderCanvas: canvasDom,
      background: 'yellow',
      autoFit: true
    });

    await vchart.renderAsync();

    const newTheme: ITheme = {
      colorScheme: {
        default: ['red', 'yellow', 'blue']
      },
      series: {
        line: {
          label: {
            visible: false,
            offset: 30,
            style: {}
          },
          point: {
            style: {
              size: 20
            }
          }
        }
      }
    };

    ThemeManager.registerTheme('tmp', newTheme);
    await vchart.setCurrentTheme('tmp');
    const series = vchart?.getChart()?.getAllSeries()?.[0];

    // sepc
    expect(vchart.getCurrentTheme().series?.line?.point?.style?.size).toBe(20);
    expect(series?.getSpec()?.point?.style?.size).toBe(20);

    // mark spec
    expect(vchart.getCurrentTheme().series?.line?.label?.offset).toBe(30);
    expect(series?.getSpec()?.label?.offset).toBe(30);

    // color scheme
    expect(vchart.getCurrentTheme().colorScheme?.default[0]).toBe('red');
    expect(series?.getSeriesInfoList()[0].style('fill')).toBe('red');
  });
});
