import { transform } from '../../../src/mark/transform/symbol-overlap';
import type { IMarkGraphic } from '../../../src/mark/interface';

const point = (position: number, group = 'a', forceShow = false) =>
  ({
    context: {
      data: [{ group }],
      finalAttrs: { x: position, y: position, size: 10, visible: true, forceShow }
    }
  } as unknown as IMarkGraphic);

test.each([1, 2])('overlap respects the current encoded visibility in direction %s', direction => {
  const graphics = [point(0), point(1)];
  transform({ direction }, graphics);
  expect(graphics[1].context.finalAttrs.visible).toBe(false);

  graphics[0].context.finalAttrs = { x: 0, y: 0, size: 10, visible: true };
  graphics[1].context.finalAttrs = { x: 100, y: 100, size: 10, visible: false };
  transform({ direction }, graphics);
  expect(graphics[1].context.finalAttrs.visible).toBe(false);

  graphics[1].context.finalAttrs = { x: 100, y: 100, size: 10, visible: true };
  transform({ direction }, graphics);
  expect(graphics[1].context.finalAttrs.visible).toBe(true);
});

test('overlap preserves grouping, sorting and forceShow', () => {
  const graphics = [point(50), point(0), point(1), point(2, 'a', true), point(0, 'b')];
  const order = graphics.slice();

  expect(transform({ direction: 1, sort: true, groupBy: 'group' }, graphics)).toBe(graphics);
  expect(graphics).toEqual(order);
  expect(graphics.map(g => g.context.finalAttrs.visible)).toEqual([true, true, false, true, true]);
});
