import { DataSet, DataView } from '@visactor/vdataset';
import { get } from '@visactor/vutils';
import type { ISeriesOption } from '../../../src/series/interface';
import { initChartDataSet, seriesOption } from '../../util/context';
import { RoseSeries, type IRoseSeriesSpec } from '../../../src';

const dataSet = new DataSet();
initChartDataSet(dataSet);

let ctx: ISeriesOption;

class TestRoseSeries extends RoseSeries<IRoseSeriesSpec> {
  protected _computeLayoutRadius() {
    return 100;
  }
}

describe('[Domain-Series-Rose] Rose Series', () => {
  beforeEach(() => {
    ctx = seriesOption({ dataSet });
  });

  test('non-stacked rose respects innerRadius', () => {
    const dataView = new DataView(dataSet);
    dataView.parse(
      [
        { type: 'A', group: 'g1', value: 10 },
        { type: 'B', group: 'g2', value: 20 }
      ],
      {
        type: 'array'
      }
    );

    const rose = new TestRoseSeries(
      {
        type: 'rose',
        data: dataView,
        categoryField: ['type', 'group'],
        valueField: 'value',
        seriesField: 'group',
        stack: false,
        innerRadius: 0.6
      },
      ctx
    );
    rose.created();
    rose.init({});

    const roseMark = rose.getMarks().find(mark => mark.name === 'rose');
    const innerRadiusStyle = get(roseMark?.stateStyle.normal, 'innerRadius.style');

    expect(innerRadiusStyle({ value: 10 })).toBe(60);
  });
});
