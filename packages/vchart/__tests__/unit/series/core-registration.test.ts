import { factoryRegistry } from '../../../src/core/factory-registry';

describe('core registration boundary', () => {
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
    } finally {
      Object.keys(factoryRegistry.charts).forEach(key => delete factoryRegistry.charts[key]);
      Object.keys(factoryRegistry.series).forEach(key => delete factoryRegistry.series[key]);
      Object.assign(factoryRegistry.charts, savedCharts);
      Object.assign(factoryRegistry.series, savedSeries);
    }
  });
});
