import { getLegendAttributes } from '../../../../../src/component/legend/discrete/util';

describe('DiscreteLegend maxWidth', () => {
  it('should keep percentage maxWidth as string', () => {
    const spec: any = {
      visible: true,
      item: {
        maxWidth: '50%'
      }
    };
    const rect = { width: 200, height: 100, x: 0, y: 0 };

    const attrs = getLegendAttributes(spec, rect);

    expect(attrs.item.maxWidth).toBe('50%');
  });
});
