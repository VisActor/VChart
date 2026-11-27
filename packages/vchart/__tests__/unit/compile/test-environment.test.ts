import { createDiv, removeDom } from '../../util/dom';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ElectronEnvironment = require('../../../jest-environment');

describe('Electron test suite isolation', () => {
  it('removes suite-owned symbols while preserving host symbols', async () => {
    const hostKey = Symbol.for('vchart-test-host');
    const suiteKey = Symbol.for('vchart-test-suite');
    const frameworkKey = Symbol.for('vchart-test-framework');
    const scope = { [hostKey]: { value: 1 } };
    const environment = new ElectronEnvironment({});
    environment.global = scope;
    await environment.setup();
    scope[suiteKey] = { value: 2 };
    Object.defineProperty(scope, frameworkKey, { value: 'framework', configurable: false });
    await environment.teardown();
    expect(Object.getOwnPropertySymbols(scope)).toEqual([hostKey, frameworkKey]);
    expect(scope[hostKey]).toEqual({ value: 1 });
  });

  it('renders with a fresh registry when the browser is reused for a second suite', async () => {
    for (let suite = 0; suite < 2; suite++) {
      const environment = new ElectronEnvironment({});
      await environment.setup();
      const dom = createDiv();
      try {
        jest.isolateModules(() => {
          // 两个独立的模块注册表共享同一浏览器 global，模拟 jest-electron 复用窗口。
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const VChart = require('../../../src').default;
          const chart = new VChart(
            {
              type: 'bar',
              animation: false,
              data: { values: [{ x: 'A', y: suite + 1 }] },
              xField: 'x',
              yField: 'y',
              axes: [{ orient: 'left', title: { visible: true, text: 'Value' } }],
              dataZoom: [{ orient: 'bottom' }]
            },
            { dom, animation: false }
          );
          try {
            chart.renderSync();
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { application, graphicCreator } = require('@visactor/vrender-core');
            expect(application.graphicService.creator).toBe(graphicCreator);
            expect(chart.getChart().getAllSeries()[0].getViewData().latestData[0].y).toBe(suite + 1);
          } finally {
            chart.release();
          }
        });
      } finally {
        removeDom(dom);
        await environment.teardown();
      }
    }
  });
});
