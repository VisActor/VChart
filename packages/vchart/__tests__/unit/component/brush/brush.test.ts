import { createPolygon, type IGraphic } from '@visactor/vrender-core';
import { default as VChartConstructor } from '../../../../src';
import { createCanvas, removeDom } from '../../../util/dom';

type TestMark = {
  getGraphics: () => IGraphic[];
};
type TestSeries = {
  getActiveMarks: () => TestMark[];
};
type GraphicWithDatum = IGraphic & {
  context: {
    data: unknown[];
  };
};
type BrushEndValue = {
  inBrushData: unknown[];
};
type BrushEndParams = {
  value?: BrushEndValue;
};
type BrushVRenderComponent = {
  _dispatchEvent: (eventType: string, detail: { operateMask: ReturnType<typeof createPolygon>; event: object }) => void;
};
type BrushModel = {
  type: string;
  getVRenderComponents: () => BrushVRenderComponent[];
};

const scatterValues = [
  { x: 936196, size: 83431, y: 1371, type: '技术', area: '东北' },
  { x: 1270911, size: 219815, y: 5590, type: '办公用品', area: '中南' },
  { x: 453898, size: 19061, y: 727, type: '技术', area: '西南' },
  { x: 919743, size: 148800, y: 1199, type: '家具', area: '华北' },
  { x: 1676224, size: 163453, y: 2517, type: '家具', area: '华东' },
  { x: 1466575, size: 251487, y: 2087, type: '技术', area: '中南' },
  { x: 824673, size: 86067, y: 3622, type: '办公用品', area: '东北' },
  { x: 230956, size: 24016, y: 347, type: '技术', area: '西北' },
  { x: 1599653, size: 228179, y: 2183, type: '技术', area: '华东' },
  { x: 745813, size: 137265, y: 3020, type: '办公用品', area: '华北' },
  { x: 267870, size: 49633, y: 970, type: '办公用品', area: '西北' },
  { x: 1408628, size: 215585, y: 6341, type: '办公用品', area: '华东' },
  { x: 781743, size: 144986, y: 927, type: '技术', area: '华北' },
  { x: 501533, size: 29303, y: 814, type: '家具', area: '西南' },
  { x: 920698, size: 72692, y: 1470, type: '家具', area: '东北' },
  { x: 316212, size: 24903, y: 468, type: '家具', area: '西北' },
  { x: 1399928, size: 199582, y: 2023, type: '家具', area: '中南' },
  { x: 347692, size: 49272, y: 1858, type: '办公用品', area: '西南' }
];

describe('brush component', () => {
  let canvasDom: HTMLCanvasElement;
  let vchart: InstanceType<typeof VChartConstructor> | undefined;

  beforeEach(() => {
    canvasDom = createCanvas();
    canvasDom.style.position = 'relative';
    canvasDom.style.width = '500px';
    canvasDom.style.height = '500px';
    canvasDom.width = 500;
    canvasDom.height = 500;
  });

  afterEach(() => {
    removeDom(canvasDom);
    vchart?.release();
  });

  test('should update selected elements when polygon brush ends after activation', () => {
    vchart = new VChartConstructor(
      {
        type: 'scatter',
        data: [{ values: scatterValues }],
        xField: 'x',
        yField: 'y',
        seriesField: 'type',
        sizeField: 'size',
        size: [10, 25],
        shapeField: 'type',
        shape: ['circle', 'triangle'],
        axes: [
          { orient: 'left', range: { min: 0 }, type: 'linear' },
          { orient: 'bottom', label: { visible: true }, type: 'linear' }
        ],
        legends: [
          {
            visible: true,
            orient: 'left',
            position: 'start',
            title: {
              visible: true,
              style: {
                text: '标题'
              }
            },
            item: {
              visible: true
            }
          }
        ],
        direction: 'horizontal',
        brush: {
          brushType: 'polygon',
          inBrush: {
            colorAlpha: 1
          },
          outOfBrush: {
            colorAlpha: 0.2
          }
        }
      } as ConstructorParameters<typeof VChartConstructor>[0],
      {
        renderCanvas: canvasDom,
        animation: false
      }
    );
    vchart.renderSync();

    const chartModel = vchart.getChart();
    const series = chartModel?.getAllSeries()[0] as unknown as TestSeries;
    const selectedGraphic = series
      .getActiveMarks()
      .flatMap(mark => mark.getGraphics())
      .find((graphic: IGraphic) => graphic.type === 'symbol') as GraphicWithDatum;
    expect(selectedGraphic).toBeDefined();

    const { x1, x2, y1, y2 } = selectedGraphic.globalAABBBounds;
    const operateMask = createPolygon({
      points: [
        { x: x1 - 2, y: y1 - 2 },
        { x: x2 + 2, y: y1 - 2 },
        { x: x2 + 2, y: y2 + 2 },
        { x: x1 - 2, y: y2 + 2 }
      ]
    });
    operateMask.name = 'brush-test';

    let brushEndValue: BrushEndValue | undefined;
    vchart.on('brushEnd', (params: BrushEndParams) => {
      brushEndValue = params.value;
    });

    const brushModel = vchart.getComponents().find(component => component.type === 'brush') as unknown as BrushModel;
    const brushComponent = brushModel.getVRenderComponents()[0];
    brushComponent._dispatchEvent('brushActive', { operateMask, event: {} });
    brushComponent._dispatchEvent('drawEnd', { operateMask, event: {} });

    expect(brushEndValue?.inBrushData).toContainEqual(selectedGraphic.context.data[0]);
  });
});
