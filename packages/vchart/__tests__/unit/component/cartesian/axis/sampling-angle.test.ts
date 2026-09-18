import VChart from '../../../../../src';
import type { CartesianBandAxis, ILineChartSpec } from '../../../../../src';
import { createCanvas, removeDom } from '../../../../util/dom';

const createSpec = (prefix: string, angle: number): ILineChartSpec => ({
  type: 'line',
  width: 500,
  height: 400,
  animation: false,
  data: { values: Array.from({ length: 80 }, (_, i) => ({ x: `${prefix}${i}`, y: 10 + (i % 3) })) },
  xField: 'x',
  yField: 'y',
  axes: [
    { orient: 'left', visible: false },
    {
      id: 'x-axis',
      orient: 'bottom',
      type: 'band',
      sampling: true,
      label: {
        autoRotate: false,
        autoHide: false,
        lastVisible: true,
        style: { angle, fontSize: 14, fontFamily: 'monospace' }
      }
    }
  ]
});

describe('axis sampling angle', () => {
  let canvas: HTMLCanvasElement;
  let chart: VChart;

  beforeEach(() => {
    canvas = createCanvas();
    canvas.width = 500;
    canvas.height = 400;
  });

  afterEach(() => {
    chart?.release();
    removeDom(canvas);
  });

  const getAxis = () => chart.getComponents().find(c => c.userId === 'x-axis') as CartesianBandAxis;
  const getIndices = () => {
    const axis = getAxis();
    const domain = axis.getScale().domain();
    return axis
      .getTickData()
      .getLatestData()
      .map((tick: { value: string }) => domain.indexOf(tick.value));
  };

  it.each([90, -90])('samples vertical labels consistently at %s degrees', angle => {
    const shortSpec = createSpec('A', angle);
    chart = new VChart(shortSpec, { renderCanvas: canvas, animation: false });
    chart.renderSync();
    const expectedIndices = getIndices();

    const longSpec = createSpec('这是一段较长的标签', angle);
    chart.updateSpecSync(longSpec);
    expect(getIndices()).toEqual(expectedIndices);
    expect(expectedIndices[expectedIndices.length - 1]).toBe(79);

    chart.updateSpecSync(createSpec('这是一段较长的标签', 0));
    expect(getIndices().length).toBeLessThan(expectedIndices.length);

    chart.updateSpecSync(longSpec);
    expect(getIndices()).toEqual(expectedIndices);
    expect((getAxis().getSpec().label.style as { angle: number }).angle).toBe(angle);
    expect((shortSpec.axes[1].label.style as { angle: number }).angle).toBe(angle);
    expect((longSpec.axes[1].label.style as { angle: number }).angle).toBe(angle);
  });
});
