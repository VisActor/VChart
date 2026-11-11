import { GridLayout } from '../../../src/layout/grid-layout/grid-layout';
import { LayoutItem } from '../../../src/layout/layout-item';
import type { ElementSpec, IGridLayoutSpec, ILayoutItem } from '../../../src/layout/interface';
import type { ILayoutModel } from '../../../src/model/interface';

class TestGridLayout extends GridLayout {
  get colSizeLength() {
    return this._colSize.length;
  }

  get rowSizeLength() {
    return this._rowSize.length;
  }

  getGridInfo(item: ILayoutItem) {
    return this.getItemGridInfo(item);
  }
}

const createGridSpec = (elements: ElementSpec[] = []): IGridLayoutSpec => ({
  type: 'grid',
  col: 2,
  row: 2,
  elements
});

const createItem = (modelId: string): ILayoutItem =>
  ({
    model: {
      userId: modelId
    }
  } as ILayoutItem);

describe('grid layout bounds validation', () => {
  test('ignores out-of-range user-defined row and column sizes', () => {
    const spec = createGridSpec();
    spec.colWidth = [
      { index: -1, size: 10 },
      { index: 2, size: 20 }
    ];
    spec.rowHeight = [
      { index: -1, size: 10 },
      { index: 2, size: 20 }
    ];

    const layout = new TestGridLayout(spec, { onError: jest.fn() });

    expect(layout.colSizeLength).toBe(2);
    expect(layout.rowSizeLength).toBe(2);
  });

  test.each([
    { col: 2, row: 0 },
    { col: 0, row: 2 },
    { col: 1, colSpan: 2, row: 0 },
    { col: 0, row: 1, rowSpan: 2 }
  ])('reports and safely falls back for an invalid element spec: %p', invalidPosition => {
    const onError = jest.fn();
    const spec = createGridSpec([{ modelId: 'region', ...invalidPosition } as ElementSpec]);
    const layout = new TestGridLayout(spec, { onError });

    expect(layout.getGridInfo(createItem('region'))).toEqual({
      col: 0,
      colSpan: 1,
      row: 0,
      rowSpan: 1
    });
    expect(onError).toHaveBeenCalledWith('invalid grid layout element: row, col, rowSpan or colSpan is out of bounds');
  });

  test('keeps a valid element spec unchanged', () => {
    const element = { modelId: 'region', col: 0, colSpan: 2, row: 1 } as ElementSpec;
    const layout = new TestGridLayout(createGridSpec([element]), { onError: jest.fn() });

    expect(layout.getGridInfo(createItem('region'))).toBe(element);
  });
});

describe('grid layout bounds in layoutItems', () => {
  const chartLayoutRect = { x: 10, y: 20, width: 200, height: 100 };
  const chartViewBox = { x1: 0, y1: 0, x2: 220, y2: 140 };
  const errorMessage = 'invalid grid layout element: row, col, rowSpan or colSpan is out of bounds';
  const invalidPositions = [
    { col: 2, row: 0 },
    { col: 0, row: 2 },
    { col: 1, colSpan: 2, row: 0 },
    { col: 0, row: 1, rowSpan: 2 }
  ];

  const createLayoutItem = (layoutType: ILayoutItem['layoutType'], layoutOrient: ILayoutItem['layoutOrient']) =>
    new LayoutItem(
      {
        userId: 'target',
        getVisible: () => true,
        getBoundsInRect: () => ({ x1: 0, y1: 0, x2: 20, y2: 10 })
      } as unknown as ILayoutModel,
      { layoutType, layoutOrient, layoutLevel: 1 }
    );

  describe.each<[ILayoutItem['layoutType'], ILayoutItem['layoutOrient']]>([
    ['region', 'left'],
    ['normal', 'bottom'],
    ['region-relative', 'left']
  ])('%s item with %s orientation', (layoutType, layoutOrient) => {
    test.each(invalidPositions)('lays out and resizes the fallback cell for %p', invalidPosition => {
      const onError = jest.fn();
      const spec = createGridSpec([{ modelId: 'target', ...invalidPosition }]);
      // 固定两列、两行各占一半空间，直接断言真实布局结果与重新布局后的尺寸。
      spec.colWidth = [0, 1].map(index => ({ index, size: width => width / 2 }));
      spec.rowHeight = [0, 1].map(index => ({ index, size: height => height / 2 }));
      const layout = new GridLayout(spec, { onError });
      const item = createLayoutItem(layoutType, layoutOrient);
      const computeBounds = jest.spyOn(item, 'computeBoundsInRect');

      layout.layoutItems(null, [item], chartLayoutRect, chartViewBox);

      expect(item.getLayoutStartPoint()).toEqual({ x: 10, y: 20 });
      expect(computeBounds).toHaveBeenLastCalledWith({ width: 100, height: 50 });
      // 普通横向组件保留自身测量尺寸，region 及关联纵向组件使用单元格尺寸。
      expect(item.getLayoutRect()).toEqual(
        layoutType === 'normal' ? { width: 20, height: 10 } : { width: 100, height: 50 }
      );
      expect(onError).toHaveBeenCalledWith(errorMessage);

      layout.layoutItems(null, [item], { x: 30, y: 40, width: 400, height: 200 }, { x1: 0, y1: 0, x2: 460, y2: 280 });

      expect(item.getLayoutStartPoint()).toEqual({ x: 30, y: 40 });
      expect(computeBounds).toHaveBeenLastCalledWith({ width: 200, height: 100 });
      expect(item.getLayoutRect()).toEqual(
        layoutType === 'normal' ? { width: 20, height: 10 } : { width: 200, height: 100 }
      );
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  test('throws the default configuration error before computing item bounds', () => {
    const layout = new GridLayout(createGridSpec([{ modelId: 'target', col: 2, row: 0 }]), {});
    const item = createLayoutItem('region', 'left');
    const computeBounds = jest.spyOn(item, 'computeBoundsInRect');

    expect(() => layout.layoutItems(null, [item], chartLayoutRect, chartViewBox)).toThrow(errorMessage);
    expect(computeBounds).not.toHaveBeenCalled();
  });

  test('propagates a throwing onError without continuing layout', () => {
    const expectedError = new Error('layout rejected');
    const onError = jest.fn(() => {
      throw expectedError;
    });
    const layout = new GridLayout(createGridSpec([{ modelId: 'target', col: 0, row: 1, rowSpan: 2 }]), {
      onError
    });
    const item = createLayoutItem('region', 'left');
    const computeBounds = jest.spyOn(item, 'computeBoundsInRect');

    expect(() => layout.layoutItems(null, [item], chartLayoutRect, chartViewBox)).toThrow(expectedError);
    expect(onError).toHaveBeenCalledWith(errorMessage);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(computeBounds).not.toHaveBeenCalled();
  });

  test('does not subtract invalid row and column sizes from a valid spanning item', () => {
    const spec = createGridSpec([{ modelId: 'target', col: 0, row: 0, colSpan: 2, rowSpan: 2 }]);
    spec.colWidth = [{ index: 2, size: 80 }];
    spec.rowHeight = [{ index: 2, size: 40 }];
    const onError = jest.fn();
    const layout = new GridLayout(spec, { onError });
    const item = createLayoutItem('region', 'left');

    layout.layoutItems(null, [item], chartLayoutRect, chartViewBox);

    expect(item.getLayoutStartPoint()).toEqual({ x: 10, y: 20 });
    expect(item.getLayoutRect()).toEqual({ width: 200, height: 100 });
    expect(onError).not.toHaveBeenCalled();
  });
});
