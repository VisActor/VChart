import { VChart } from '../../../src/vchart-all';
import { createDiv, removeDom } from '../../util/dom';

type Tap = { name: string; fn: () => void };

const SVG_MASK =
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="50"/></svg>';

const spec = {
  type: 'wordCloud',
  nameField: 'name',
  valueField: 'value',
  maskShape: SVG_MASK,
  data: [
    {
      id: 'wordCloud',
      values: [
        { name: 'foo', value: 30 },
        { name: 'bar', value: 20 },
        { name: 'baz', value: 10 }
      ]
    }
  ],
  animation: false
};

describe('word cloud shape afterRender tap', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;

  const getWordCloudTaps = () =>
    ((vchart.getStage() as any).hooks.afterRender.taps as Tap[]).filter(tap => tap.name === 'afterWordcloudShapeDraw');

  const createChart = () => {
    vchart = new VChart(spec as any, { dom, animation: false });
    vchart.renderSync();
    return vchart.getChart().getAllSeries()[0] as any;
  };

  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterEach(() => {
    vchart?.release();
  });

  afterAll(() => {
    removeDom(container);
  });

  it('should be removed together with the series', () => {
    const series = createChart();
    series._wordCloudShapeTransformOption().onLayoutFinished();
    expect(getWordCloudTaps().length).toBe(1);

    const tap = getWordCloudTaps()[0];
    series.release();

    expect(getWordCloudTaps().length).toBe(0);
    // series 已经 release，_option 为空，这个 tap 即使被别处留住也不能再抛错
    expect(() => tap.fn()).not.toThrow();
  });

  it('should not be registered twice when the layout finishes more than once', () => {
    const series = createChart();
    const option = series._wordCloudShapeTransformOption();
    option.onLayoutFinished();
    option.onLayoutFinished();

    expect(getWordCloudTaps().length).toBe(1);
  });
});
