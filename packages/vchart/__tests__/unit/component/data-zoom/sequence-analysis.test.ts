import { DataSet, DataView } from '@visactor/vdataset';
import { BandScale, LinearScale, type IBandLikeScale } from '@visactor/vscale';
import { DataZoom } from '../../../../src/component/data-zoom/data-zoom/data-zoom';
import { dataFilterWithNewDomain } from '../../../../src/component/data-zoom/util';

describe('sequence analysis DataZoom', () => {
  it('keeps nested dot domains and link filter fields without summing numeric-looking user IDs', () => {
    const dataSet = new DataSet();
    const data = new DataView(dataSet).parse([{ user: '123456xxxx', dots: [{ step: 'A' }, { step: 'B' }] }]);
    const xScale = new BandScale().domain(['A', 'B']).range([0, 100]);
    const yScale = new BandScale().domain(['123456xxxx']).range([0, 100]);
    const series = {
      id: 1,
      type: 'dot',
      coordinate: 'cartesian',
      getRawData: () => data,
      getRawDataStatisticsByField: (): undefined => undefined,
      getSpec: () => ({ xField: 'step', yField: 'user' }),
      getXAxisHelper: () => ({ getAxisId: () => 10, getScale: () => xScale }),
      getYAxisHelper: () => ({ getAxisId: () => 11, getScale: () => yScale })
    };
    const zoom: any = new DataZoom({}, { dataSet } as any);
    zoom._relatedAxisComponent = { id: 10 };
    zoom._regions = [
      { getSeries: () => [{ ...series, id: 2, type: 'link', getSpec: () => ({ fromField: 'from' }) }, series] }
    ];
    zoom._stateField = 'state';
    zoom._valueField = 'value';
    zoom._stateScale = new BandScale();
    zoom._handleChange = jest.fn();
    zoom._initData();
    expect(zoom._parseFieldOfSeries({ id: 2 })).toEqual(['from_xField']);
    expect(zoom._data.getLatestData()).toEqual([
      { state: 'A', value: 0 },
      { state: 'B', value: 0 }
    ]);

    data.parse([{ user: '123456xxxx', dots: [{ step: 'B' }, { step: 'C' }] }]);
    zoom.onDataUpdate();
    expect(zoom._data.getLatestData()).toEqual([
      { state: 'B', value: 0 },
      { state: 'C', value: 0 }
    ]);
    expect(zoom.stateScale.domain()).toEqual(['B', 'C']);
    dataSet.destroy();
  });

  it('keeps continuous preview values aligned when a categorical dot series comes first', () => {
    const dataSet = new DataSet();
    const events = new DataView(dataSet).parse([{ user: '123456xxxx', dots: [{ time: 10 }, { time: 20 }] }]);
    const counts = new DataView(dataSet).parse([
      { time: 10, count: 2 },
      { time: 20, count: 3 }
    ]);
    const xScale = new LinearScale().domain([0, 30]);
    const series = (id: number, type: string, data: DataView, yField: string, yScale: any) => ({
      id,
      type,
      coordinate: 'cartesian',
      getRawData: () => data,
      getSpec: () => ({ xField: 'time', yField }),
      getXAxisHelper: () => ({ getAxisId: () => 10, getScale: () => xScale }),
      getYAxisHelper: () => ({ getAxisId: () => id + 10, getScale: () => yScale })
    });
    const zoom: any = new DataZoom({}, { dataSet } as any);
    zoom._relatedAxisComponent = { id: 10 };
    zoom._regions = [
      {
        getSeries: () => [
          series(1, 'dot', events, 'user', new BandScale()),
          series(2, 'bar', counts, 'count', new LinearScale())
        ]
      }
    ];
    zoom._stateField = 'state';
    zoom._valueField = 'value';
    zoom._stateScale = new LinearScale();
    zoom._handleChange = jest.fn();
    zoom._initData();
    expect(zoom._data.getLatestData()).toEqual([
      { state: 10, value: 2 },
      { state: 20, value: 3 }
    ]);
    counts.parse([
      { time: 10, count: 4 },
      { time: 20, count: 5 }
    ]);
    zoom.onDataUpdate();
    expect(zoom._data.getLatestData()).toEqual([
      { state: 10, value: 4 },
      { state: 20, value: 5 }
    ]);
    dataSet.destroy();
  });

  it.each([
    ['from', 'x'],
    ['source', 'x'],
    ['from', 'y'],
    ['source', 'y']
  ])('filters links with fromField = %s on the %s axis', (fromField, dimension) => {
    // 主包只消费系列提供的字段；扩展包负责验证原始连线到这些字段的转换及图表过滤。
    const data = [
      { [fromField]: 'a', [`${fromField}_xField`]: 10, [`${fromField}_yField`]: 20 },
      { [fromField]: 'b', [`${fromField}_xField`]: 30, [`${fromField}_yField`]: 50 },
      { [fromField]: 'c', [`${fromField}_xField`]: 50, [`${fromField}_yField`]: 30 }
    ];
    const series = {
      id: 1,
      type: 'link',
      coordinate: 'cartesian',
      getSpec: () => ({ fromField }),
      getXAxisHelper: () => ({ getAxisId: () => 10 }),
      getYAxisHelper: () => ({ getAxisId: () => 11 })
    };
    const zoom: any = new DataZoom({}, {} as any);
    zoom._relatedAxisComponent = { id: dimension === 'x' ? 10 : 11 };
    zoom._regions = [{ getSeries: () => [series] }];
    expect(zoom._collectDataInfo().dataCollection).toEqual([]);
    const filtered = dataFilterWithNewDomain(data, {
      field: () => zoom._parseFieldOfSeries(series),
      getNewDomain: () => [10, 40],
      isContinuous: () => true
    });
    expect(filtered.map(d => d[fromField])).toEqual(dimension === 'x' ? ['a', 'b'] : ['a', 'c']);
  });

  it.each([false, true])('synchronizes linked axes with reversed range = %s', reverse => {
    const scale = new BandScale().domain(['A', 'B', 'C']).range(reverse ? [100, 0] : [0, 100]);
    const linkedScale = scale.clone();
    const axis = (axisScale: IBandLikeScale) => ({
      getScale: () => axisScale,
      getInverse: () => false,
      scaleRangeFactorStart: (value: number) => axisScale.rangeFactorStart(value),
      scaleRangeFactorEnd: (value: number) => axisScale.rangeFactorEnd(value)
    });
    const zoom: any = new DataZoom({}, {} as any);
    zoom._relatedAxisComponent = axis(scale);
    zoom._linkedAxisComponent = axis(linkedScale);
    zoom._isHorizontal = true;
    zoom._start = 0.2;
    zoom._end = 0.6;
    zoom._updateRangeFactor();
    const expected = reverse ? [0.4, 0.8] : [0.2, 0.6];
    expect(scale.rangeFactor()).toEqual(expected);
    expect(linkedScale.rangeFactor()).toEqual(expected);
  });
});
