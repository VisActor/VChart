import VChart, { registerMosaicChart, type ICartesianSeries, type ISpec } from '../../../../src';
import type { LineCrosshair, RectCrosshair } from '@visactor/vrender-components';
import type { CartesianAxis } from '../../../../src/component/axis/cartesian';
import type { CrossHairStateByField } from '../../../../src/component/crosshair/interface';
import { createDiv, removeDom } from '../../../util/dom';

registerMosaicChart();

type CrosshairForTest = {
  _layoutCrosshair: (x: number, y: number) => void;
  _stateByField: CrossHairStateByField;
  getLayoutStartPoint: () => { x: number; y: number };
};

const values = [
  { category: 'Nail polish', country: 'Africa', value: 4229 },
  { category: 'Nail polish', country: 'EU', value: 4376 },
  { category: 'Nail polish', country: 'China', value: 3054 },
  { category: 'Nail polish', country: 'USA', value: 12814 },
  { category: 'Mascara', country: 'Africa', value: 18712 },
  { category: 'Mascara', country: 'EU', value: 6134 },
  { category: 'Mascara', country: 'China', value: 10419 },
  { category: 'Mascara', country: 'USA', value: 11261 }
];

describe('stacked crosshair', () => {
  let dom: HTMLElement;
  let chart: VChart;

  beforeEach(() => {
    dom = createDiv();
  });

  afterEach(() => {
    chart?.release();
    removeDom(dom);
  });

  const render = (spec: ISpec) => {
    chart = new VChart({ width: 500, height: 500, ...spec }, { dom, animation: false });
    chart.renderSync();
    const crosshair = chart.getComponents().find(c => c.type === 'cartesianCrosshair') as unknown as CrosshairForTest;
    const series = chart.getChart().getAllSeries()[0] as ICartesianSeries;
    const axes = chart.getComponents().filter(c => c.specKey === 'axes') as CartesianAxis[];
    return { crosshair, series, axes };
  };

  test.each([
    ['bar', 'vertical', false, false, 1],
    ['bar', 'horizontal', false, false, 1],
    ['bar', 'vertical', true, false, 1],
    ['bar', 'horizontal', true, false, 1],
    ['bar', 'vertical', false, false, -1],
    ['bar', 'vertical', false, true, 1],
    ['area', 'vertical', false, false, 1]
  ])('%s %s inverse=%s percent=%s sign=%s keeps the pointer value', (type, direction, inverse, percent, sign) => {
    const isHorizontal = direction === 'horizontal';
    const measureKey = isHorizontal ? 'x' : 'y';
    const dimensionKey = isHorizontal ? 'y' : 'x';
    const { crosshair, series, axes } = render({
      type,
      direction,
      percent,
      data: { values: values.map(d => ({ ...d, value: d.value * (sign as number) })) },
      xField: isHorizontal ? 'value' : 'category',
      yField: isHorizontal ? 'category' : 'value',
      seriesField: 'country',
      axes: [
        { orient: isHorizontal ? 'left' : 'bottom', type: 'band' },
        { orient: isHorizontal ? 'bottom' : 'left', type: 'linear', inverse },
        { orient: isHorizontal ? 'top' : 'right', type: 'linear', inverse }
      ],
      crosshair: {
        xField: { visible: true, label: { visible: true } },
        yField: { visible: true, label: { visible: true } }
      }
    } as ISpec);

    expect(series.getStack()).toBe(true);
    const pointerValue = percent ? 0.47 : 22000 * (sign as number);
    const point = { x: 0, y: 0 };
    const start = crosshair.getLayoutStartPoint();
    point[dimensionKey] =
      axes[0].getScale().scale('Mascara') + axes[0].getLayoutStartPoint()[dimensionKey] - start[dimensionKey];
    point[measureKey] =
      axes[1].getScale().scale(pointerValue) + axes[1].getLayoutStartPoint()[measureKey] - start[measureKey];
    const getViewData = jest.spyOn(series, 'getViewData');

    crosshair._layoutCrosshair(point.x, point.y);

    const state = crosshair._stateByField[`${measureKey}Field`];
    const labelKeys = isHorizontal ? ['bottom', 'top'] : ['left', 'right'];
    for (const labelKey of labelKeys) {
      expect(+state.cacheInfo.labels[labelKey].text).toBeCloseTo(pointerValue);
    }
    expect(state.cacheInfo.visible).toBe(true);
    const line = state.crosshairComp as LineCrosshair;
    expect(line.attribute.start[measureKey]).toBeCloseTo(point[measureKey] + start[measureKey]);
    expect(line.attribute.end[measureKey]).toBeCloseTo(point[measureKey] + start[measureKey]);
    expect(getViewData).not.toHaveBeenCalled();
    getViewData.mockRestore();
  });

  test.each([
    ['mosaic', 'vertical', false],
    ['mosaic', 'horizontal', true],
    ['histogram', 'vertical', true],
    ['histogram', 'horizontal', false]
  ])('%s %s inverse=%s retains dimension range highlighting', (type, direction, inverse) => {
    const isHorizontal = direction === 'horizontal';
    const dimensionKey = isHorizontal ? 'y' : 'x';
    const isMosaic = type === 'mosaic';
    const { crosshair, series, axes } = render({
      type,
      direction,
      data: {
        values: [
          { category: 'A', start: 0, end: 2, country: 'EU', value: 3 },
          { category: 'A', start: 0, end: 2, country: 'USA', value: 7 },
          { category: 'B', start: 2, end: 10, country: 'EU', value: 6 },
          { category: 'B', start: 2, end: 10, country: 'USA', value: 4 }
        ]
      },
      xField: isHorizontal ? 'value' : isMosaic ? 'category' : 'start',
      yField: isHorizontal ? (isMosaic ? 'category' : 'start') : 'value',
      ...(isMosaic ? {} : { [isHorizontal ? 'y2Field' : 'x2Field']: 'end' }),
      seriesField: 'country',
      axes: [
        { orient: isHorizontal ? 'left' : 'bottom', type: 'linear', inverse },
        { orient: isHorizontal ? 'bottom' : 'left', type: 'linear' }
      ],
      crosshair: {
        [`${dimensionKey}Field`]: { visible: true, line: { type: 'rect' }, label: { visible: true } }
      }
    } as ISpec);

    expect(series.getStack()).toBe(true);
    const datum = series.getViewData().latestData[0];
    const field1 = isHorizontal ? series.fieldY[0] : series.fieldX[0];
    const field2 = isHorizontal ? series.fieldY2 : series.fieldX2;
    const minValue = Math.min(datum[field1], datum[field2]);
    const maxValue = Math.max(datum[field1], datum[field2]);
    const start = crosshair.getLayoutStartPoint();
    const point = { x: 100, y: 100 };
    point[dimensionKey] =
      axes[0].getScale().scale((minValue + maxValue) / 2) +
      axes[0].getLayoutStartPoint()[dimensionKey] -
      start[dimensionKey];

    crosshair._layoutCrosshair(point.x, point.y);

    const state = crosshair._stateByField[`${dimensionKey}Field`];
    const labelKey = isHorizontal ? 'left' : 'bottom';
    const pos1 = axes[0].getScale().scale(minValue) + axes[0].getLayoutStartPoint()[dimensionKey];
    const pos2 = axes[0].getScale().scale(maxValue) + axes[0].getLayoutStartPoint()[dimensionKey];
    expect(state.cacheInfo.visible).toBe(true);
    expect(state.cacheInfo.labels[labelKey].text).toBe(`${minValue} ~ ${maxValue}`);
    const rect = state.crosshairComp as RectCrosshair;
    expect(rect.attribute.start[dimensionKey]).toBeCloseTo(Math.min(pos1, pos2));
    expect(rect.attribute.end[dimensionKey]).toBeCloseTo(Math.max(pos1, pos2));
  });
});
