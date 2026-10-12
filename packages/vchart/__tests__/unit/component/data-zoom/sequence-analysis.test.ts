import { DataSet, DataView } from '@visactor/vdataset';
import { BandScale, type IBandLikeScale } from '@visactor/vscale';
import { DataZoom } from '../../../../src/component/data-zoom/data-zoom/data-zoom';

describe('sequence analysis DataZoom', () => {
  it('keeps nested dot domains after data updates and excludes link data', () => {
    const dataSet = new DataSet();
    const data = new DataView(dataSet).parse([{ user: 'U1', dots: [{ step: 'A' }, { step: 'B' }] }]);
    const xScale = new BandScale().domain(['A', 'B']).range([0, 100]);
    const yScale = new BandScale().domain(['U1']).range([0, 100]);
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
    zoom._regions = [{ getSeries: () => [{ type: 'link' }, series] }];
    zoom._stateField = 'state';
    zoom._valueField = 'value';
    zoom._stateScale = new BandScale();
    zoom._handleChange = jest.fn();
    zoom._initData();
    expect(zoom._data.getLatestData()).toEqual([
      { state: 'A', value: 1 },
      { state: 'B', value: 1 }
    ]);

    data.parse([{ user: 'U1', dots: [{ step: 'B' }, { step: 'C' }] }]);
    zoom.onDataUpdate();
    expect(zoom._data.getLatestData()).toEqual([
      { state: 'B', value: 1 },
      { state: 'C', value: 1 }
    ]);
    expect(zoom.stateScale.domain()).toEqual(['B', 'C']);
    dataSet.destroy();
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
