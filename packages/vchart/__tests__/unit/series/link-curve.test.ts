import VChart, { type ICommonChartSpec } from '../../../src';
import { LinkType, type ILinkSeriesSpec, registerLinkSeries } from '../../../../vchart-extension/src/series/link';
import { type IDotSeriesSpec, registerDotSeries } from '../../../../vchart-extension/src/series/dot';

registerDotSeries();
registerLinkSeries();
type ILinkChartSpec = Omit<ICommonChartSpec, 'series'> & { series: (IDotSeriesSpec | ILinkSeriesSpec)[] };
import { createDiv, removeDom } from '../../util/dom';

const makeSpec = (link?: ILinkSeriesSpec['link']): ILinkChartSpec => {
  const dot = {
    type: 'dot' as const,
    name: 'events',
    dataId: 'events',
    xField: 'time',
    yField: 'user',
    titleField: 'user',
    leftAppendPadding: 0,
    title: { visible: false },
    subTitle: { visible: false },
    symbol: { visible: false }
  };
  return {
    type: 'common',
    width: 600,
    height: 400,
    data: [
      {
        id: 'events',
        values: [
          { user: 'U1', dots: [{ node_name: 'a', time: 10 }] },
          { user: 'U2', dots: [{ node_name: 'b', time: 30 }] }
        ]
      },
      {
        id: 'links',
        values: [
          { from: 'a', to: 'b' },
          { from: 'a', to: 'b' }
        ]
      }
    ],
    series: [
      {
        type: 'link',
        dataId: 'links',
        dotSeriesIndex: 1,
        dotSeriesSpec: dot,
        fromField: 'from',
        toField: 'to',
        linkType: LinkType.curve,
        leftAppendPadding: 0,
        link
      },
      dot
    ],
    axes: [
      { type: 'linear', orient: 'bottom', min: 0, max: 80, nice: false },
      { type: 'band', orient: 'left', domain: ['U1', 'U2'] }
    ]
  };
};

describe('curve link rendering', () => {
  let dom: HTMLElement;
  let chart: VChart;
  beforeEach(() => {
    dom = createDiv();
  });
  afterEach(() => {
    chart?.release();
    removeDom(dom);
  });
  const series = () =>
    chart
      .getChart()
      .getAllSeries()
      .find(s => s.type === 'link');
  const mark = () =>
    series()
      .getMarksWithoutRoot()
      .find(m => m.type === 'path');
  const paths = () =>
    series()
      .getViewData()
      .latestData.map((d: Record<string, unknown>) => mark().getAttribute('path', d));

  it('keeps duplicate curves distinct and stable through reevaluation, resize and data updates', () => {
    chart = new VChart(makeSpec(), { dom, animation: false });
    chart.renderSync();
    const initial = paths();
    expect(initial).toHaveLength(2);
    expect(initial[0]).not.toBe(initial[1]);
    expect(paths()).toEqual(initial);
    chart.resize(800, 500);
    const resized = paths();
    expect(resized).not.toEqual(initial);
    expect(paths()).toEqual(resized);
    chart.resize(600, 400);
    expect(paths()).toEqual(initial);
    chart.updateDataSync('links', [{ from: 'a', to: 'b' }]);
    expect(paths()).toEqual([initial[0]]);
    chart.updateFullDataSync([
      {
        id: 'events',
        values: [
          { user: 'U1', dots: [{ node_name: 'a', time: 40 }] },
          { user: 'U2', dots: [{ node_name: 'b', time: 60 }] }
        ]
      },
      {
        id: 'links',
        values: [
          { from: 'a', to: 'b' },
          { from: 'a', to: 'b' }
        ]
      }
    ]);
    const updated = paths();
    expect(updated).not.toEqual(initial);
    expect(updated[0]).not.toBe(updated[1]);
    expect(paths()).toEqual(updated);
    chart.updateFullDataSync(makeSpec().data as any);
    expect(paths()).toEqual(initial);
  });

  it('applies public link visibility, styles and states on initialization and updateSpec', () => {
    const config = {
      visible: false,
      style: { stroke: '#123456', lineWidth: 3 },
      state: { custom_unSelected: { strokeOpacity: 0.25 } }
    };
    chart = new VChart(makeSpec(config), { dom, animation: false });
    chart.renderSync();
    const datum = series().getViewData().latestData[0];
    expect(mark().getVisible()).toBe(false);
    expect(mark().name).toBe('link');
    expect(mark().getAttribute('stroke', datum)).toBe('#123456');
    expect(mark().getAttribute('strokeOpacity', datum, 'custom_unSelected')).toBe(0.25);
    chart.updateSpecSync(
      makeSpec({
        visible: true,
        style: { stroke: '#654321', lineWidth: 4 },
        state: { custom_unSelected: { strokeOpacity: 0.75 } }
      })
    );
    expect(mark().getVisible()).toBe(true);
    expect(mark().getAttribute('stroke', datum)).toBe('#654321');
    expect(mark().getAttribute('lineWidth', datum)).toBe(4);
    expect(mark().getAttribute('strokeOpacity', datum, 'custom_unSelected')).toBe(0.75);
    expect(mark().getGraphics()).toHaveLength(2);
  });
});
