import { hierarchyDimensionStatistics } from '../../../src/data/transforms/hierarchy-dimension-statistics';
import { disk } from '../../data/disk';

describe('hierarchy data statistic test', () => {
  test('test hierarchy dimension statistic', () => {
    const result = hierarchyDimensionStatistics([{ latestData: disk } as any], {
      fields: [
        {
          key: 'name',
          operations: ['values']
        },
        {
          key: 'value',
          operations: ['max', 'min']
        }
      ]
    }) as any;
    expect(result.name.values.length).toEqual(1995);
    expect(result.value.max).toEqual(1512668);
    expect(result.value.min).toEqual(0);
  });
});
