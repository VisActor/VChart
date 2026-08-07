import { getLegendAttributes } from '../../../../src/component/legend/discrete/util';

describe('Discrete legend getLegendAttributes layout callbacks', () => {
  const rect = { width: 200, height: 80 };

  test('should evaluate function `maxRow` against the layout rect', () => {
    const attrs = getLegendAttributes(
      {
        type: 'discrete',
        orient: 'bottom',
        id: 'l1',
        maxRow: (ctx: any) => Math.floor(ctx.rect.height / 20)
      } as any,
      rect as any
    );

    expect(attrs.maxRow).toBe(4);
  });

  test('should evaluate function `maxCol` and pass rect / orient / id in the context', () => {
    let received: any;
    const attrs = getLegendAttributes(
      {
        type: 'discrete',
        orient: 'right',
        id: 'l2',
        maxCol: (ctx: any) => {
          received = ctx;
          return 3;
        }
      } as any,
      rect as any
    );

    expect(attrs.maxCol).toBe(3);
    expect(received.rect).toBe(rect);
    expect(received.orient).toBe('right');
    expect(received.id).toBe('l2');
  });

  test('should keep numeric `maxRow` / `maxCol` unchanged', () => {
    const attrs = getLegendAttributes({ type: 'discrete', maxRow: 2, maxCol: 1 } as any, rect as any);

    expect(attrs.maxRow).toBe(2);
    expect(attrs.maxCol).toBe(1);
  });

  test('should pass the resolved `left` orient to the callback when `spec.orient` is unset', () => {
    let received: any;
    getLegendAttributes(
      {
        type: 'discrete',
        maxCol: (ctx: any) => {
          received = ctx;
          return 1;
        }
      } as any,
      rect as any
    );

    expect(received.orient).toBe('left');
  });

  test('should prefer the layout-resolved orient over `spec.orient`', () => {
    let received: any;
    getLegendAttributes(
      {
        type: 'discrete',
        orient: 'left',
        maxRow: (ctx: any) => {
          received = ctx;
          return 1;
        }
      } as any,
      rect as any,
      'bottom'
    );

    expect(received.orient).toBe('bottom');
  });

  test('should evaluate `pager.layout` after maxRow/maxCol are resolved', () => {
    let received: any;
    const attrs = getLegendAttributes(
      {
        type: 'discrete',
        orient: 'bottom',
        id: 'l3',
        maxRow: () => 3,
        maxCol: 1,
        pager: {
          layout: (ctx: any) => {
            received = ctx;
            return ctx.maxRow > 1 ? 'vertical' : 'horizontal';
          }
        }
      } as any,
      rect as any,
      'top'
    );

    expect(attrs.pager.layout).toBe('vertical');
    expect(received.rect).toBe(rect);
    expect(received.orient).toBe('top');
    expect(received.id).toBe('l3');
    expect(received.maxRow).toBe(3);
    expect(received.maxCol).toBe(1);
  });

  test('should keep a static `pager.layout` unchanged', () => {
    const attrs = getLegendAttributes(
      { type: 'discrete', pager: { layout: 'horizontal' } } as any,
      rect as any
    );

    expect(attrs.pager.layout).toBe('horizontal');
  });

  test('should evaluate `pager.position` after maxRow/maxCol are resolved', () => {
    let received: any;
    const attrs = getLegendAttributes(
      {
        type: 'discrete',
        orient: 'bottom',
        id: 'l4',
        maxRow: () => 3,
        maxCol: 1,
        pager: {
          position: (ctx: any) => {
            received = ctx;
            return ctx.maxRow > 1 ? 'start' : 'middle';
          }
        }
      } as any,
      rect as any
    );

    expect(attrs.pager.position).toBe('start');
    expect(received.rect).toBe(rect);
    expect(received.orient).toBe('bottom');
    expect(received.id).toBe('l4');
    expect(received.maxRow).toBe(3);
    expect(received.maxCol).toBe(1);
  });

  test('should keep a static `pager.position` unchanged', () => {
    const attrs = getLegendAttributes(
      { type: 'discrete', pager: { position: 'middle' } } as any,
      rect as any
    );

    expect(attrs.pager.position).toBe('middle');
  });
});
