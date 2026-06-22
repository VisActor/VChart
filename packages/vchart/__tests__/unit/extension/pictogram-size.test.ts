import { Bounds } from '../../../src';
import { PictogramSeries } from '../../../../vchart-extension/src/charts/pictogram/series/pictogram';

const createBounds = (x1: number, y1: number, x2: number, y2: number) => new Bounds().setValue(x1, y1, x2, y2);

describe('pictogram size', () => {
  test('should not refit svg size when legend filtering changes current bounds only', () => {
    const root = {
      AABBBounds: createBounds(0, 0, 100, 50),
      scale: jest.fn(),
      translate: jest.fn()
    };
    const series = Object.create(PictogramSeries.prototype) as any;

    series.getLayoutRect = () => ({ width: 200, height: 100 });
    series.getPictogramRootGraphic = () => root;

    series.updateSVGSize();
    root.AABBBounds = createBounds(0, 0, 40, 50);
    series.updateSVGSize();

    expect(root.scale).toHaveBeenCalledTimes(1);
    expect(root.translate).toHaveBeenCalledTimes(1);
  });
});
