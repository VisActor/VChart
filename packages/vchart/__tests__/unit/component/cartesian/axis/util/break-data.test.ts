/**
 *  break-data 的测试用例
 */
import { breakData } from '../../../../../../src/component/axis/mixin/util/break-data';

describe('break data ', () => {
  it('break data by break points', () => {
    const data = [
      44, 108, 128, 266, 180, 344, 345, 753, 3050, 6170, 3590, 7130, 3840, 7715, 3630, 7050, 3120, 3840, 420, 740, 240,
      400, 80, 100
    ];
    const breakPoints = [500, 3000];
    const { domain, scope } = breakData(data, breakPoints);

    expect(domain).toStrictEqual([
      [44, 500],
      [500, 3000],
      [3000, 7715]
    ]);

    expect(scope).toStrictEqual([
      [0, 0.5],
      [0.5, 0.58],
      [0.58, 1]
    ]);
  });
});
