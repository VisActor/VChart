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

  const createPlainRelatedSpec = () => ({
    type: 'sankey',
    width: 500,
    height: 300,
    data: [
      {
        values: [
          {
            nodes: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
            links: [
              { source: 'A', target: 'B', value: 6 },
              { source: 'A', target: 'C', value: 4 },
              { source: 'B', target: 'D', value: 6 },
              { source: 'C', target: 'D', value: 4 }
            ]
          }
        ]
      }
    ],
    nodeKey: 'name',
    categoryField: 'name',
    sourceField: 'source',
    targetField: 'target',
    valueField: 'value',
    nodeWidth: 20,
    nodeGap: 20,
    label: { visible: true },
    node: {
      state: {
        selected: { fillOpacity: 1 },
        blur: { fillOpacity: 0.08 }
      }
    },
    link: {
      state: {
        selected: { fillOpacity: 0.9 },
        blur: { fillOpacity: 0.05 }
      }
    },
    emphasis: { enable: true, trigger: 'hover', effect: 'related' }
  });

  const hoverRelated = (targetChart, series, graphic, mark) => {
    const nested = graphic?.getSubGraphic?.()?.[0];
    const item = graphic
      ? findMarkGraphic(targetChart.getCompiler().getRootGroup(), nested ?? graphic) ?? graphic
      : undefined;
    series.event.emit('pointerover', { item, mark: item ? mark : undefined }, Event_Bubble_Level.chart);
  };

  const expectPlainRelated = (series, selectedNodes, selectedLinks) => {
    const nodes = series._nodeMark.getGraphics();
    const links = series._linkMark.getGraphics();
    expect(nodes.length).toBeGreaterThan(0);
    expect(links.length).toBeGreaterThan(0);
    nodes.forEach(node => {
      const key = node.context.data[0].key;
      const selected = selectedNodes.includes(key);
      expect(node.currentStates).toContain(selected ? 'selected' : 'blur');
      expect(node.currentStates).not.toContain(selected ? 'blur' : 'selected');
      expect(node.attribute.fillOpacity).toBe(selected ? 1 : 0.08);
    });
    links.forEach(link => {
      const { source, target } = link.context.data[0];
      const selected = selectedLinks.some(([linkSource, linkTarget]) => linkSource === source && linkTarget === target);
      expect(link.currentStates).toContain(selected ? 'selected' : 'blur');
      expect(link.currentStates).not.toContain(selected ? 'blur' : 'selected');
      expect(link.attribute.fillOpacity).toBe(selected ? 0.9 : 0.05);
    });
  };

  test('plain node-link related hover highlights the fork and merge path', () => {
    chart = new VChart(createPlainRelatedSpec(), { dom, animation: false });
    chart.renderSync();
    const series = chart.getChart().getAllSeries()[0];
    const nodeMark = series._nodeMark;
    const linkMark = series._linkMark;
    const node = name => nodeMark.getGraphics().find(g => g.context.data[0].key === name);
    const link = (source, target) =>
      linkMark.getGraphics().find(g => g.context.data[0].source === source && g.context.data[0].target === target);
    const nodeA = node('A');
    const linkAB = link('A', 'B');
    expect(nodeMark.getGraphics()).toHaveLength(4);
    expect(linkMark.getGraphics()).toHaveLength(4);
    const initialNodeOpacity = nodeA.attribute.fillOpacity;
    const initialLinkOpacity = linkAB.attribute.fillOpacity;

    hoverRelated(chart, series, nodeA, nodeMark);
    expectPlainRelated(
      series,
      ['A', 'B', 'C', 'D'],
      [
        ['A', 'B'],
        ['A', 'C'],
        ['B', 'D'],
        ['C', 'D']
      ]
    );

    hoverRelated(chart, series, node('B'), nodeMark);
    expectPlainRelated(
      series,
      ['A', 'B', 'D'],
      [
        ['A', 'B'],
        ['B', 'D']
      ]
    );

    hoverRelated(chart, series, link('A', 'C'), linkMark);
    expectPlainRelated(
      series,
      ['A', 'C', 'D'],
      [
        ['A', 'C'],
        ['C', 'D']
      ]
    );

    hoverRelated(chart, series, link('B', 'D'), linkMark);
    expectPlainRelated(
      series,
      ['A', 'B', 'D'],
      [
        ['A', 'B'],
        ['B', 'D']
      ]
    );

    hoverRelated(chart, series);
    series._nodeMark.getGraphics().forEach(g => {
      expect(g.currentStates).toEqual([]);
    });
    series._linkMark.getGraphics().forEach(g => {
      expect(g.currentStates).toEqual([]);
    });
    expect(nodeA.attribute.fillOpacity).toBe(initialNodeOpacity);
    expect(linkAB.attribute.fillOpacity).toBe(initialLinkOpacity);

    hoverRelated(chart, series, node('D'), nodeMark);
    expectPlainRelated(
      series,
      ['A', 'B', 'C', 'D'],
      [
        ['A', 'B'],
        ['A', 'C'],
        ['B', 'D'],
        ['C', 'D']
      ]
    );
  });

  test('plain node-link related hover follows paths longer than two hops', () => {
    chart = new VChart(
      {
        type: 'sankey',
        width: 500,
        height: 300,
        data: [
          {
            values: [
              {
                nodes: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }],
                links: [
                  { source: 0, target: 1, value: 1 },
                  { source: 1, target: 2, value: 1 },
                  { source: 2, target: 3, value: 1 },
                  { source: 4, target: 2, value: 1 }
                ]
              }
            ]
          }
        ],
        categoryField: 'name',
        sourceField: 'source',
        targetField: 'target',
        valueField: 'value',
        nodeWidth: 20,
        nodeGap: 20,
        node: {
          state: {
            selected: { fillOpacity: 1 },
            blur: { fillOpacity: 0.08 }
          }
        },
        link: {
          state: {
            selected: { fillOpacity: 0.9 },
            blur: { fillOpacity: 0.05 }
          }
        },
        emphasis: { enable: true, trigger: 'hover', effect: 'related' }
      },
      { dom, animation: false }
    );
    chart.renderSync();
    const series = chart.getChart().getAllSeries()[0];
    const nodeMark = series._nodeMark;
    const linkMark = series._linkMark;
    const node = key => nodeMark.getGraphics().find(g => g.context.data[0].key === key);
    const link = (source, target) =>
      linkMark.getGraphics().find(g => g.context.data[0].source === source && g.context.data[0].target === target);

    expect(nodeMark.getGraphics()).toHaveLength(5);
    expect(linkMark.getGraphics()).toHaveLength(4);

    hoverRelated(chart, series, node(0), nodeMark);
    expectPlainRelated(
      series,
      [0, 1, 2, 3],
      [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    );

    hoverRelated(chart, series, link(1, 2), linkMark);
    expectPlainRelated(
      series,
      [0, 1, 2, 3],
      [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    );

    hoverRelated(chart, series, node(2), nodeMark);
    expectPlainRelated(
      series,
      [0, 1, 2, 3, 4],
      [
        [0, 1],
        [1, 2],
        [2, 3],
        [4, 2]
      ]
    );
  });
});
