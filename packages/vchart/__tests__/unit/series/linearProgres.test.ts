import { DataSet, csvParser, dataViewParser } from '@visactor/vdataset';
import type { ISeriesOption } from '../../../src/series/interface';
import { initChartDataSet, seriesOption } from '../../util/context';
import { LinearProgressSeries } from '../../../src';
import type { IGroupMark } from '../../../src/mark/group';

const dataSet = new DataSet();
initChartDataSet(dataSet);
dataSet.registerParser('csv', csvParser);
let ctx: ISeriesOption;
describe('[Domain-Series-LinearProgress] LinearProgress Series', () => {
  beforeEach(() => {
    ctx = seriesOption({ dataSet });
  });

  test('linearProgress series init', () => {
    const linearProgress = new LinearProgressSeries<any>({}, ctx);
    linearProgress.init({});
  });

  test('linearProgress series mark', () => {
    const linearProgress = new LinearProgressSeries<any>({}, ctx);
    linearProgress.created();
    linearProgress.init({});

    const marks = linearProgress.getMarks();
    expect(marks.length).toEqual(4);

    const groupMark = marks[1] as IGroupMark;
    expect(groupMark.type).toEqual('group');
    expect(groupMark.name).toEqual('group');
    expect(groupMark.getMarks().length).toEqual(2);

    const backgroundMark = groupMark.getMarks()[0];
    expect(backgroundMark.type).toEqual('rect');
    expect(backgroundMark.name).toEqual('track');

    const progressMark = groupMark.getMarks()[1];
    expect(progressMark.type).toEqual('rect');
    expect(progressMark.name).toEqual('progress');
  });
});
