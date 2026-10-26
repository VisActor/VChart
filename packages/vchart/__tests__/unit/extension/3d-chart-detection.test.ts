import { is3DChart } from '../../../../vchart-extension/src/charts/3d/util';

describe('3D chart detection', () => {
  test.each([
    { type: 'bar', xField: 'category', yField: 'value' },
    { type: 'line', xField: 'category', yField: 'value' },
    { type: 'common', series: [], customMark: [{ type: 'group', style: { scaleX: 0.9, scaleY: 0.9 } }] },
    { type: 'common', series: [{ type: 'bar' }, { type: 'line' }] }
  ])('keeps 2D charts out of the camera rendering path: %o', spec => {
    expect(is3DChart(spec)).toBe(false);
  });

  test.each(['bar3d', 'histogram3d', 'rangeColumn3d', 'pie3d', 'wordCloud3d', 'funnel3d'])(
    'recognizes %s charts',
    type => {
      expect(is3DChart({ type })).toBe(true);
    }
  );

  test('recognizes 3D series in a combination chart', () => {
    expect(is3DChart({ type: 'common', series: [{ type: 'line' }, { type: 'bar3d' }] })).toBe(true);
  });

  test('recognizes a 3D axis declared by zField', () => {
    expect(is3DChart({ type: 'scatter', xField: 'x', yField: 'y', zField: 'z' })).toBe(true);
    expect(is3DChart({ type: 'common', series: [{ type: 'line', zField: 'z' }] })).toBe(true);
  });
});
