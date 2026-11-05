import { GridLayout } from '../../../src/layout/grid-layout/grid-layout';
import type { ElementSpec, IGridLayoutSpec, ILayoutItem } from '../../../src/layout/interface';

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
