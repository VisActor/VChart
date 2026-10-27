import { getExternalViewportBounds, isPointInExternalViewport } from '../../../src/util/external-viewport';

describe('external viewport', () => {
  const viewport = {
    transform: { a: 0, b: 2, c: -3, d: 0, e: 400, f: 50 },
    clip: { x1: 150, y1: 80, x2: 380, y2: 220 }
  };

  test('uses the full affine transform and visible clip for hit boundaries', () => {
    expect(getExternalViewportBounds(viewport, 100, 80)).toEqual({ x1: 160, y1: 50, x2: 400, y2: 250 });
    expect(isPointInExternalViewport(viewport, 100, 80, 250, 150)).toBe(true);
    expect(isPointInExternalViewport(viewport, 100, 80, 390, 150)).toBe(false);
    expect(isPointInExternalViewport(viewport, 100, 80, 155, 150)).toBe(false);
  });

  test('a collapsed chart has no hittable client area', () => {
    const collapsed = { transform: { a: 0, b: 0, c: 0, d: 0, e: 50, f: 60 } };
    expect(isPointInExternalViewport(collapsed, 100, 80, 50, 60)).toBe(false);
  });
});
