// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import VChart from '../../../src';
import { Event_Bubble_Level } from '../../../src/constant/event';
import { findMarkGraphic } from '../../../src/util/mark';
import { createDiv, removeDom } from '../../util/dom';
import { createRelatedSpec, ribbonThickness } from './fixtures/sankey-related';

const createSpec = () => ({
  type: 'sankey',
  width: 500,
  height: 300,
  data: [
    {
      values: [
        {
          nodes: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
          links: [
            { source: 'A', target: 'B', value: 10, color: '#dddddd' },
            { source: 'C', target: 'B', value: 5, color: '#dddddd' },
            { source: 'B', target: 'D', value: 8, color: 'orange' }
          ]
        }
      ]
    }
  ],
  categoryField: 'name',
  valueField: 'value',
  sourceField: 'source',
  targetField: 'target',
  nodeAlign: 'justify',
  nodeGap: 8,
  nodeWidth: 15,
  minNodeHeight: 4,
  nodeKey: datum => datum.name,
  iterations: 20,
  node: {
    style: {
      fill: '#b9b9b9'
    },
    state: {
      selected: {
        fill: '#dddddd',
        fillOpacity: 1
      },
      blur: {
        fillOpacity: 0.05
      }
    }
  },
  link: {
    style: {
      fill: data => data.color ?? data.datum?.color,
      fillOpacity: 1
    },
    state: {
      selected: {
        fillOpacity: 1
      },
      blur: {
        fillOpacity: 0.05
      }
    }
  },
  emphasis: {
    enable: true,
    effect: 'adjacency'
  }
});

describe('sankey emphasis state', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let chart: VChart;

  beforeEach(() => {
    container = createDiv();
    dom = createDiv(container);
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '300px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterEach(() => {
    chart?.release();
    removeDom(container);
  });

  test('link sub graphic click should apply blur opacity to non-adjacent links', () => {
    chart = new VChart(createSpec(), {
      dom,
      animation: false
    });
    chart.renderSync();

    const series = chart.getChart().getAllSeries()[0] as any;
    const linkMark = series._linkMark;
    const links = linkMark.getGraphics();
    const clicked = links[2];
    const other = links[0];
    const eventTarget = clicked.getSubGraphic()[0];
    const item = findMarkGraphic(chart.getCompiler().getRootGroup(), eventTarget);
    const mark = chart.getChart().getMarkById(item.context.markId);

    series.event.emit(
      'pointerdown',
      {
        item,
        mark
      },
      Event_Bubble_Level.chart
    );

    expect(item).toBe(clicked);
    expect(mark).toBe(linkMark);
    expect(other.currentStates).toContain('blur');
    expect(other.attribute.fillOpacity).toBe(0.05);
    expect(other.getSubGraphic()[0].attribute.fillOpacity).toBe(0.05);
    expect(other.getSubGraphic()[1].attribute.fillOpacity).toBe(0.05);
  });

  test.each([false, true])(
    'related selection changes actual ribbon thickness and restores it (vertical=%s)',
    vertical => {
      chart = new VChart(
        { ...createRelatedSpec(), direction: vertical ? 'vertical' : 'horizontal' },
        { dom, animation: false }
      );
      chart.renderSync();
      const series = chart.getChart().getAllSeries()[0] as any;
      const linkMark = series._linkMark;
      const links = linkMark.getGraphics();
      const findLink = (source: string, target: string) =>
        links.find(g => {
          const datum = g.context.data[0];
          return datum.source === source && datum.target === target;
        });
      const target = findLink('top', '00');
      const front = target.getSubGraphic().find(g => g.name === 'front');
      const back = target.getSubGraphic().find(g => g.name === 'back');
      const initialPath = front.attribute.path;
      const click = (g?: any) => {
        const item = g && findMarkGraphic(chart.getCompiler().getRootGroup(), g.getSubGraphic()[0]);
        series.event.emit('pointerdown', { item, mark: item && linkMark }, Event_Bubble_Level.chart);
      };
      for (const [source, ratio] of [
        ['A', 15 / 115],
        ['B', 100 / 115],
        ['A', 15 / 115]
      ]) {
        click(findLink(source, 'top'));
        expect(target.attribute.ratio).toBeCloseTo(ratio);
        for (const thickness of ribbonThickness(front.attribute.path, vertical)) {
          expect(thickness).toBeCloseTo(target.attribute.thickness * ratio);
        }
        for (const thickness of ribbonThickness(back.attribute.path, vertical)) {
          expect(thickness).toBeCloseTo(target.attribute.thickness);
        }
        expect(back.attribute.path).toBe(initialPath);
        expect(back.attribute.fill).toBe('#e8e8e8');
      }
      click();
      expect(target.currentStates).toEqual([]);
      expect(target.attribute.ratio).toBeUndefined();
      expect(target.attribute.backgroundStyle).toBeUndefined();
      expect(front.attribute.path).toBe(initialPath);
      expect(back.attribute.path).toBe('');
    }
  );

  test.each(['data', 'spec'])('re-encodes related selection after a %s update', update => {
    chart = new VChart(createRelatedSpec(), { dom, animation: false });
    chart.renderSync();
    const selectA = () => {
      const series = chart.getChart().getAllSeries()[0] as any;
      const mark = series._linkMark;
      const links = mark.getGraphics();
      const a = links.find(g => g.context.data[0].source === 'A' && g.context.data[0].target === 'top');
      series.event.emit('pointerdown', { item: a, mark }, Event_Bubble_Level.chart);
      return links.find(g => g.context.data[0].source === 'top' && g.context.data[0].target === '00');
    };
    expect(selectA().attribute.ratio).toBeCloseTo(15 / 115);
    const next = createRelatedSpec();
    next.data[0].values[0].nodes[0].children[0].children[0].value = 30;
    if (update === 'data') {
      chart.updateDataSync('data', next.data[0].values);
    } else {
      next.width = 900;
      chart.updateSpecSync(next);
    }
    const target = selectA();
    expect(target.attribute.ratio).toBeCloseTo(30 / 130);
    const front = target.getSubGraphic().find(g => g.name === 'front');
    for (const thickness of ribbonThickness(front.attribute.path)) {
      expect(thickness).toBeCloseTo((target.attribute.thickness * 30) / 130);
    }
  });
});
