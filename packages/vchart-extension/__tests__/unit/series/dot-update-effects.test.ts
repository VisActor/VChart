import VChart, { type ICommonChartSpec } from '@visactor/vchart';
import { registerDotSeries, type IDotSeriesSpec } from '../../../src/series/dot';
import { createDiv, removeDom } from '../../util/dom';

registerDotSeries();

type IDotChartSpec = Omit<ICommonChartSpec, 'series'> & { series: IDotSeriesSpec[] };

const spyOnDataStages = (chart: VChart) => {
  const chartModel = chart.getChart() as ReturnType<VChart['getChart']> & { updateDataSpec: () => void };

  return {
    chartModel,
    updateDataSpec: jest.spyOn(chartModel, 'updateDataSpec'),
    updateGlobalScaleDomain: jest.spyOn(chartModel, 'updateGlobalScaleDomain')
  };
};

const expectDataStagesSkipped = (spies: ReturnType<typeof spyOnDataStages>) => {
  expect(spies.updateDataSpec).not.toHaveBeenCalled();
  expect(spies.updateGlobalScaleDomain).not.toHaveBeenCalled();
};

const spyOnFirstSeriesReInit = (chartModel: ReturnType<VChart['getChart']>) =>
  jest.spyOn(chartModel.getAllSeries()[0], 'reInit');

const createDotHighlightSpec = (
  highLightSeriesGroup: string,
  titleField = 'type',
  subTitleField = 'id',
  gridFillOpacity = 0.4
): IDotChartSpec => ({
  type: 'common',
  data: [
    {
      id: 'data',
      values: [
        {
          row: 'A',
          type: 'IP',
          titleBefore: 'before-a',
          titleAfter: 'after-a',
          subTitleBefore: 'sub-before-a',
          subTitleAfter: 'sub-after-a',
          dots: [
            {
              event_time: 1,
              id: 'A',
              type: 'IP',
              action_type: 'request'
            }
          ]
        },
        {
          row: 'B',
          type: 'DB',
          titleBefore: 'before-b',
          titleAfter: 'after-b',
          subTitleBefore: 'sub-before-b',
          subTitleAfter: 'sub-after-b',
          dots: [
            {
              event_time: 2,
              id: 'B',
              type: 'DB',
              action_type: 'query'
            }
          ]
        }
      ]
    }
  ],
  series: [
    {
      type: 'dot',
      dataId: 'data',
      xField: 'event_time',
      yField: 'id',
      seriesGroupField: 'type',
      titleField,
      subTitleField,
      dotTypeField: 'action_type',
      name: 'id',
      highLightSeriesGroup,
      clipHeight: 1000,
      grid: {
        background: {
          fill: '#000',
          fillOpacity: gridFillOpacity
        }
      }
    }
  ],
  axes: [
    {
      orient: 'bottom',
      type: 'linear'
    },
    {
      orient: 'left',
      type: 'band'
    }
  ]
});

const getSeriesMarkGraphics = (chart: VChart, seriesType: string, markName: string) => {
  const series = chart
    .getChart()
    ?.getAllSeries()
    .find(seriesItem => seriesItem.type === seriesType);
  const mark = series?.getMarks().find(markItem => markItem.name === markName);
  const graphics = mark?.getGraphics() as Array<{ attribute: Record<string, unknown> }> | undefined;

  expect(graphics?.length).toBeGreaterThan(0);
  return graphics as Array<{ attribute: Record<string, unknown> }>;
};

describe('dot scoped update effects', () => {
  let dom: HTMLElement;

  beforeEach(() => {
    dom = createDiv();
  });

  afterEach(() => {
    removeDom(dom);
  });

  it('skips chart data stages and reapplies dot highLightSeriesGroup updates', () => {
    const chart = new VChart(createDotHighlightSpec('IP'), { dom, animation: false });

    try {
      chart.renderSync();

      expect(
        getSeriesMarkGraphics(chart, 'dot', 'gridBackground').some(graphic => graphic.attribute.fillOpacity === 0.4)
      ).toBe(true);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createDotHighlightSpec('NONE'));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(
        getSeriesMarkGraphics(chart, 'dot', 'gridBackground').some(graphic => graphic.attribute.fillOpacity === 0.4)
      ).toBe(false);
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages and reapplies dot titleField updates', () => {
    const chart = new VChart(createDotHighlightSpec('IP', 'titleBefore'), { dom, animation: false });

    try {
      chart.renderSync();

      expect(getSeriesMarkGraphics(chart, 'dot', 'title').map(graphic => graphic.attribute.text)).toContain('before-a');

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createDotHighlightSpec('IP', 'titleAfter'));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(getSeriesMarkGraphics(chart, 'dot', 'title').map(graphic => graphic.attribute.text)).toContain('after-a');
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages and reapplies dot subTitleField updates', () => {
    const chart = new VChart(createDotHighlightSpec('IP', 'type', 'subTitleBefore'), { dom, animation: false });

    try {
      chart.renderSync();

      expect(getSeriesMarkGraphics(chart, 'dot', 'subTitle').map(graphic => graphic.attribute.text)).toContain(
        'sub-before-a'
      );

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createDotHighlightSpec('IP', 'type', 'subTitleAfter'));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(getSeriesMarkGraphics(chart, 'dot', 'subTitle').map(graphic => graphic.attribute.text)).toContain(
        'sub-after-a'
      );
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages and reapplies dot grid background updates', () => {
    const chart = new VChart(createDotHighlightSpec('IP'), { dom, animation: false });

    try {
      chart.renderSync();

      expect(
        getSeriesMarkGraphics(chart, 'dot', 'gridBackground').some(graphic => graphic.attribute.fillOpacity === 0.4)
      ).toBe(true);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createDotHighlightSpec('IP', 'type', 'id', 0.7));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(
        getSeriesMarkGraphics(chart, 'dot', 'gridBackground').some(graphic => graphic.attribute.fillOpacity === 0.7)
      ).toBe(true);
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });
});
