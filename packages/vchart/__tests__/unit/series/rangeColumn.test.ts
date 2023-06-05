import { DataSet, csvParser, dataViewParser } from '@visactor/vdataset';
import type { ISeriesOption } from '../../../src/series/interface';
import { seriesOption } from '../../util/context';
import { RangeColumnSeries } from '../../../src';

const dataSet = new DataSet();
dataSet.registerParser('csv', csvParser);
dataSet.registerParser('dataview', dataViewParser);
let ctx: ISeriesOption;
describe('[Domain-Series-RangeColumn] RangeColumn Series', () => {
  beforeEach(() => {
    ctx = seriesOption({ dataSet });
  });

  test('rangeColumn series init', () => {
    const rangeColumn = new RangeColumnSeries({}, ctx);
    rangeColumn.init({});
  });

  test('rangeColumn series mark', () => {
    const rangeColumn = new RangeColumnSeries({}, ctx);
    rangeColumn.created();
    rangeColumn.init({});

    const marks = rangeColumn.getMarks();
    expect(marks.length).toEqual(2);

    const barMark = marks[1];
    expect(barMark.type).toEqual('rect');
    expect(barMark.name).toEqual('bar');
  });
});
