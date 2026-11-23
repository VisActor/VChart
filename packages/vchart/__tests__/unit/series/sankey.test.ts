import type { SankeyLayoutResult } from '@visactor/vlayouts';
import VChart from '../../../src';
import type { ISankeyChartSpec } from '../../../src/chart/sankey/interface';
import { SankeySeriesTooltipHelper } from '../../../src/series/sankey/tooltip-helper';
import type { Datum } from '../../../src/typings';
import { createDiv, removeDom } from '../../util/dom';

const createMockSeries = () =>
  ({
    id: 'sankey-series',
    type: 'sankey',
    getSpec: () => ({
      categoryField: 'nodeName'
    }),
    getSeriesField: () => 'nodeName',
    getSeriesKeys: () => ["Agricultural 'waste'", 'Bio-conversion', 'CCCCC', 'DDD'],
    getDimensionField: () => ['nodeName'],
    getMeasureField: () => ['value'],
    getSeriesStyle:
      (): any =>
      (_: string): any =>
        undefined,
    getDefaultShapeType: () => 'square'
  } as any);

describe('[Series-Sankey] tooltip helper', () => {
  test('should resolve link title when source is 0', () => {
    const helper = new SankeySeriesTooltipHelper(createMockSeries());

    expect(
      helper.dimensionTooltipTitleCallback({
        source: 0,
        target: 2,
        value: 124.729,
        datum: {
          source: 0,
          target: 2,
          value: 124.729
        }
      } as any)
    ).toBe("Agricultural 'waste' => CCCCC");
  });
});

describe('[Series-Sankey] legend filter', () => {
  let chart: VChart;
  let dom: HTMLElement;

  function render(spec: Partial<ISankeyChartSpec>) {
    dom = createDiv();
    chart = new VChart(
      {
        type: 'sankey',
        width: 600,
        height: 400,
        animation: false,
        categoryField: 'name',
        valueField: 'value',
        legends: { visible: true },
        ...spec
      },
      { dom }
    );
    chart.renderSync();
  }

  function visibleGraph() {
    const { nodes, links } = chart.getChart().getAllSeries()[0].getViewData()
      .latestData[0] as SankeyLayoutResult[number];
    return {
      nodes: nodes.map(node => (node.datum as Datum).name),
      links: links.map(link => [link.source, link.target])
    };
  }

  afterEach(() => {
    chart.release();
    removeDom(dom);
  });

  test('selects nodes by seriesField and retains links between selected nodes', () => {
    render({
      seriesField: 'group',
      sourceField: 'source',
      targetField: 'target',
      data: {
        values: [
          {
            nodes: [
              { name: 'A', group: 1 },
              { name: 'B', group: 0 },
              { name: 'C', group: 0 }
            ],
            links: [
              { source: 0, target: 1, value: 6 },
              { source: 1, target: 2, value: 6 }
            ]
          }
        ]
      }
    });

    expect(chart.getLegendSelectedDataByIndex()).toEqual([1, 0]);
    chart.setLegendSelectedDataByIndex(0, [0]);
    expect(visibleGraph()).toEqual({ nodes: ['B', 'C'], links: [[1, 2]] });
  });

  test('selects hierarchy nodes by name when layout keys are generated', () => {
    render({
      data: {
        values: [
          {
            nodes: [
              {
                name: 'A',
                children: [
                  { name: 'B', value: 6 },
                  { name: 'C', value: 4 }
                ]
              }
            ]
          }
        ]
      }
    });

    expect(chart.getLegendSelectedDataByIndex()).toEqual(['A', 'B', 'C']);
    chart.setLegendSelectedDataByIndex(0, ['A', 'C']);
    expect(visibleGraph()).toEqual({ nodes: ['A', 'C'], links: [['0-0', '0-0-1']] });
  });
});
