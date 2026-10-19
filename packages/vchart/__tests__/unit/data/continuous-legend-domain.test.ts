import { continuousLegendDataMake } from '../../../src/data/transforms/legend-data/continuous/continuous';
import { LinearScale } from '@visactor/vscale';

describe('continuous legend scale extent', () => {
  it.each([
    { domain: [-1, 0, 1], extent: [-1, 1] },
    { domain: [1, 0, -1], extent: [-1, 1] },
    { domain: [0, 100], extent: [0, 100] }
  ])('uses the full scale domain $domain', ({ domain, extent }) => {
    const scale = new LinearScale().domain(domain);
    expect(
      continuousLegendDataMake([], {
        series: () => [],
        field: () => undefined,
        scale: () => scale
      })
    ).toEqual(extent);
  });
});
