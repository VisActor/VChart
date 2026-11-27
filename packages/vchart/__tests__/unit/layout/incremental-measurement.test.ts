import { LayoutItem } from '../../../src/layout/layout-item';
import { getItemLayoutWithTag } from '../../../src/layout/util';
import type { Layout } from '../../../src/layout/base-layout';
import type { ILayoutRect } from '../../../src/typings/layout';

// Title measurement temporarily installs the available space as its layout rect.
// A later incremental pass must reuse the measured size, not that temporary space.
describe('incremental layout after measurement', () => {
  test.each(['top', 'left'] as const)('retains measured dimensions for a %s item', orient => {
    const measured = { width: 100, height: 20 };
    const item = new LayoutItem(
      {
        getBoundsInRect: (available: ILayoutRect) => {
          item.setLayoutRect(available);
          return { x1: 0, y1: 0, x2: measured.width, y2: measured.height };
        }
      } as any,
      { layoutType: 'normal', layoutLevel: 1, layoutOrient: orient }
    );
    item.setLayoutRect(measured);
    const layout = {
      getItemComputeLayoutRect: () => ({ width: 700, height: 400 })
    } as unknown as Layout;
    const recompute = { recomputeWidth: false, recomputeHeight: false };
    const first = getItemLayoutWithTag(item, layout, recompute);
    expect(first.rect).toEqual(measured);
    expect(first.layoutTag).toBe(false);
    expect(recompute).toEqual({ recomputeWidth: false, recomputeHeight: false });
    expect(item.getLayoutRect()).toEqual(measured);

    item.clearWillLayoutTag();
    expect(getItemLayoutWithTag(item, layout, recompute).rect).toEqual(measured);
  });
});
