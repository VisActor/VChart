import { GlobalScale } from '../../../src/scale/global-scale';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';
import type { ILineChartSpec } from '../../../src/chart/line/interface';
import { LineChart, registerLineChart } from '../../../src/chart/line/line';
import { EventDispatcher } from '../../../src/event/event-dispatcher';
import { MarkTypeEnum } from '../../../src/mark/interface/type';
import type { IMark } from '../../../src/mark/interface';
import type { IMarkGraphic } from '../../../src/mark/interface/common';
import { getTestCompiler } from '../../util/factory/compiler';
import { getTheme, initChartDataSet } from '../../util/context';

registerLineChart();

const dataSet = new DataSet();
initChartDataSet(dataSet);
dataSet.registerParser('csv', csvParser);

function createLineChart() {
  const dataView = new DataView(dataSet);
  dataView.parse(
    `x,type,y
1,1,850
2,2,740
3,3,900`,
    {
      type: 'csv'
    }
  );
  const spec = {
    type: 'line',
    data: dataView,
    xField: 'x',
    yField: 'y',
    animation: false
  };
  const transformer = new LineChart.transformerConstructor({
    type: 'line',
    seriesType: 'line',
    getTheme: getTheme,
    mode: 'desktop-browser'
  });
  const info = transformer.initChartSpec(spec as any);
  const chart = new LineChart(
    spec as any,
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      eventDispatcher: new EventDispatcher({} as any, { addEventListener: () => {} } as any),
      globalInstance: {
        isAnimationEnable: () => true,
        getContainer: () => ({}),
        getTooltipHandlerByUser: (() => undefined) as () => undefined
      },
      render: {} as any,
      dataSet,
      map: new Map(),
      container: null,
      mode: 'desktop-browser',
      getCompiler: getTestCompiler,
      globalScale: new GlobalScale([], { getAllSeries: () => [] as any[] } as any),
      getTheme: getTheme,
      onError: () => {},
      getSpecInfo: () => info
    } as any
  );
  chart.created(transformer);
  chart.init();
  return chart;
}

function findMark(chart: LineChart<ILineChartSpec>, type: string): IMark {
  const mark = chart
    .getAllSeries()[0]
    .getMarks()
    .find(m => m.type === type);
  if (!mark) {
    throw new Error(`Expected ${type} mark to exist`);
  }
  return mark;
}

describe('filterGraphicsByDatum collection marks', () => {
  const lineData = [
    { time: '2:00', value: 8, series: 'sys' },
    { time: '4:00', value: 9, series: 'sys' },
    { time: '6:00', value: 11, series: 'sys' }
  ];
  const otherSeriesDatum = { time: '2:00', value: 6, series: 'dia' };
  const unmatchedDatum = { time: '20:00', value: 12, series: 'sys' };

  test('does not throw when hovered datums are longer than a collection mark datum array', () => {
    const chart = createLineChart();
    const lineMark = findMark(chart, MarkTypeEnum.line);
    const lineGraphic = { id: 'line-graphic' } as unknown as IMarkGraphic;
    jest.spyOn(lineMark, 'getGraphics').mockReturnValue([lineGraphic]);

    expect(() =>
      chart.filterGraphicsByDatum([...lineData, unmatchedDatum], {
        getDatum: () => lineData
      })
    ).not.toThrow();
  });

  test('ignores unmatched extra datums on collection marks and still picks an exact match', () => {
    const chart = createLineChart();
    const lineMark = findMark(chart, MarkTypeEnum.line);
    const lineGraphic = { id: 'line-graphic' } as unknown as IMarkGraphic;
    jest.spyOn(lineMark, 'getGraphics').mockReturnValue([lineGraphic]);

    const unmatched = chart.filterGraphicsByDatum([...lineData, unmatchedDatum], {
      getDatum: () => lineData
    });
    expect(unmatched).toEqual([]);

    const matched = chart.filterGraphicsByDatum(lineData, {
      getDatum: () => lineData
    });
    expect(matched).toEqual([lineGraphic]);
  });

  test('skips a shorter collection mark and still highlights matched point graphics', () => {
    const chart = createLineChart();
    const lineMark = findMark(chart, MarkTypeEnum.line);
    const pointMark = findMark(chart, MarkTypeEnum.symbol);
    const lineGraphic = { id: 'line-graphic' } as unknown as IMarkGraphic;
    const sysPoint = { id: 'sys-point' } as unknown as IMarkGraphic;
    const diaPoint = { id: 'dia-point' } as unknown as IMarkGraphic;

    jest.spyOn(lineMark, 'getGraphics').mockReturnValue([lineGraphic]);
    jest.spyOn(pointMark, 'getGraphics').mockReturnValue([sysPoint, diaPoint]);

    const hovered = [lineData[0], otherSeriesDatum];
    const picked = chart.filterGraphicsByDatum(hovered, {
      filter: (_series, mark) => mark === lineMark || mark === pointMark,
      getDatum: (el, mark) => {
        if (mark.type === MarkTypeEnum.line) {
          // Collection marks often have fewer datums than a multi-series hover list.
          return [lineData[0]];
        }
        return el === sysPoint ? lineData[0] : otherSeriesDatum;
      }
    });

    expect(picked).toEqual([sysPoint, diaPoint]);
  });
});
