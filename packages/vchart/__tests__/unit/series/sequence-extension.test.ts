import { BaseChart, Factory } from '../../../src';
import { DotSeries } from '../../../../vchart-extension/src/series/dot';
import { LinkSeries } from '../../../../vchart-extension/src/series/link';
import { factoryRegistry } from '../../../src/core/factory-registry';
import {
  SequenceChart,
  SequenceChartSpecTransformer,
  registerSequenceChart
} from '../../../../vchart-extension/src/charts/sequence';
import { registerSequenceAnalysis } from '../../../../vchart-extension/src/charts/sequence-analysis/sequence-analysis';

describe('sequence chart extension migration', () => {
  it('keeps sequence and dot/link opt-in in the full core bundle', () => {
    const savedCharts = { ...factoryRegistry.charts };
    const savedSeries = { ...factoryRegistry.series };
    try {
      delete factoryRegistry.charts.sequence;
      delete factoryRegistry.series.dot;
      delete factoryRegistry.series.link;
      // Electron 测试共享全局 Factory；重新加载主包，验证它自身的导出和注册副作用。
      jest.isolateModules(() => {
        const core = require('../../../src');
        for (const name of ['DotSeries', 'LinkSeries', 'registerDotSeries', 'registerLinkSeries']) {
          expect(core).not.toHaveProperty(name);
        }
        expect(core.Factory.getChart('sequence')).toBeUndefined();
        expect(core.Factory.getSeriesInType('dot')).toBeUndefined();
        expect(core.Factory.getSeriesInType('link')).toBeUndefined();
      });
      registerSequenceChart();
      expect(Factory.getChart('sequence')).toBe(SequenceChart);
    } finally {
      Object.keys(factoryRegistry.charts).forEach(key => delete factoryRegistry.charts[key]);
      Object.keys(factoryRegistry.series).forEach(key => delete factoryRegistry.series[key]);
      Object.assign(factoryRegistry.charts, savedCharts);
      Object.assign(factoryRegistry.series, savedSeries);
    }
  });

  it('registers the series, axes, grid layout and scrollbar needed by legacy specs', () => {
    const keys = ['series', 'components', 'layout'] as const;
    const saved = keys.map(key => ({ ...factoryRegistry[key] }));
    try {
      keys.forEach(key => Object.keys(factoryRegistry[key]).forEach(name => delete factoryRegistry[key][name]));
      registerSequenceChart();
      for (const type of ['dot', 'link', 'bar', 'line', 'area']) {
        expect(Factory.getSeriesInType(type)).toBeDefined();
      }
      for (const type of ['cartesianAxis-band', 'cartesianAxis-linear', 'cartesianAxis-time', 'scrollBar']) {
        expect(factoryRegistry.components[type]).toBeDefined();
      }
      expect(factoryRegistry.layout.grid).toBeDefined();
    } finally {
      keys.forEach((key, index) => Object.assign(factoryRegistry[key], saved[index]));
    }
  });

  it('keeps sequence-analysis independent of sequence registration', () => {
    const dot = factoryRegistry.series.dot;
    const link = factoryRegistry.series.link;
    try {
      delete factoryRegistry.series.dot;
      delete factoryRegistry.series.link;
      registerSequenceAnalysis();
      expect(Factory.getSeriesInType('dot')).toBe(DotSeries);
      expect(Factory.getSeriesInType('link')).toBe(LinkSeries);
    } finally {
      factoryRegistry.series.dot = dot;
      factoryRegistry.series.link = link;
    }
  });

  it('preserves legacy series regions, the shared time axis and generated scrollbar', () => {
    const spec: any = {
      type: 'sequence',
      appendPadding: { left: 80, right: 20 },
      axes: [{ type: 'time', orient: 'top' }],
      data: [{ id: 'events', values: Array.from({ length: 10 }, (_, i) => ({ user: `u${i}`, dots: [] })) }],
      series: [
        { type: 'bar', xField: 'time', yField: 'count', height: 80 },
        { type: 'link', dotSeriesIndex: 2, fromField: 'from', toField: 'to' },
        {
          type: 'dot',
          dataId: 'events',
          xField: 'time',
          yField: 'user',
          height: 120,
          clipHeight: 120,
          title: { style: {} },
          subTitle: { style: {} }
        }
      ]
    };
    new SequenceChartSpecTransformer({
      type: 'sequence',
      getCompiler: () => ({ getStage: () => ({ viewWidth: 800, viewHeight: 600 }) })
    } as any).transformSpec(spec);
    expect(spec.layout.type).toBe('grid');
    expect(spec.series[0].regionIndex).not.toBe(spec.series[2].regionIndex);
    expect(spec.series[1]).toMatchObject({ regionIndex: spec.series[2].regionIndex, clipHeight: 120 });
    expect(spec.axes[0].type).toBe('time');
    expect(spec.axes[0].regionIndex).toEqual(
      expect.arrayContaining([spec.series[0].regionIndex, spec.series[2].regionIndex])
    );
    expect(spec.scrollBar[0]).toMatchObject({ orient: 'right', end: 0.4, regionIndex: spec.series[2].regionIndex });
  });

  it('binds link to the selected dot spec and uses the standard series lifecycle', () => {
    const dot = { type: 'dot', xField: 'time', yField: 'user' };
    const link = { type: 'link', dotSeriesIndex: 1 };
    const createSeries = jest.spyOn(BaseChart.prototype as any, '_createSeries').mockImplementation(() => undefined);
    try {
      const chart = Object.create(SequenceChart.prototype);
      chart._spec = { series: [link, dot] };
      const info = { spec: link, specIndex: 0 };
      const constructor = Factory.getSeriesInType('link');
      chart._createSeries(constructor, info);
      expect((link as any).dotSeriesSpec).toBe(dot);
      expect(createSeries).toHaveBeenCalledWith(constructor, info);
    } finally {
      createSeries.mockRestore();
    }
  });
});
