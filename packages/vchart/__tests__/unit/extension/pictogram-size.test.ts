import { Bounds, Matrix } from '../../../src';
import { PictogramSeries } from '../../../../vchart-extension/src/charts/pictogram/series/pictogram';

const createBounds = (x1: number, y1: number, x2: number, y2: number) => new Bounds().setValue(x1, y1, x2, y2);

describe('pictogram size', () => {
  const createSeries = () => {
    const series = Object.create(PictogramSeries.prototype) as any;

    series.getLayoutRect = () => ({ width: 200, height: 100 });
    series._parsedSvgResult = {
      root: {
        attributes: {},
        transform: new Matrix()
      },
      viewBoxRect: {
        x: 0,
        y: 0,
        width: 100,
        height: 50
      }
    };

    return series;
  };

  test('should fit from svg viewBox when legend filtering resets graphic matrix', () => {
    const root = {
      AABBBounds: createBounds(0, 0, 40, 50),
      setAttributes: jest.fn(),
      scale: jest.fn(),
      translate: jest.fn()
    };
    const series = createSeries();

    series.getPictogramRootGraphic = () => root;
    series.updateSVGSize();

    expect(root.setAttributes).toHaveBeenCalledTimes(1);
    expect(root.setAttributes).toHaveBeenCalledWith({
      postMatrix: expect.objectContaining({ a: 2, b: 0, c: 0, d: 2, e: 0, f: 0 })
    });
    expect(root.scale).not.toHaveBeenCalled();
    expect(root.translate).not.toHaveBeenCalled();
  });

  test('should fit from svg width and height when viewBox is missing', () => {
    const root = {
      AABBBounds: createBounds(0, 0, 100, 200),
      setAttributes: jest.fn(),
      scale: jest.fn(),
      translate: jest.fn()
    };
    const series = createSeries();

    series._parsedSvgResult = {
      root: {
        attributes: {},
        transform: new Matrix()
      },
      width: 100,
      height: 200
    };
    series.getPictogramRootGraphic = () => root;
    series.updateSVGSize();

    expect(root.setAttributes).toHaveBeenCalledTimes(1);
    expect(root.setAttributes).toHaveBeenCalledWith({
      postMatrix: expect.objectContaining({ a: 0.5, b: 0, c: 0, d: 0.5, e: 75, f: 0 })
    });
    expect(root.scale).not.toHaveBeenCalled();
    expect(root.translate).not.toHaveBeenCalled();
  });

  test('should keep fitted postMatrix in root mark style after legend filtering rerenders marks', () => {
    const series = createSeries();

    series._pictogramMark = {
      setMarkConfig: jest.fn()
    };
    series._mapViewData = {
      getDataView: () => ({
        latestData: [] as any[]
      })
    };
    series.setMarkStyle = jest.fn();
    series.initLabelMarkStyle = jest.fn();

    series.initMarkStyle();

    const postMatrixStyle = series.setMarkStyle.mock.calls.find((call: any[]) => call[1]?.postMatrix)?.[1].postMatrix;
    expect(postMatrixStyle()).toEqual(expect.objectContaining({ a: 2, b: 0, c: 0, d: 2, e: 0, f: 0 }));
  });
});
