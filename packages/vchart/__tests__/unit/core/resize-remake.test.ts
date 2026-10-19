import VChart from '../../../src';
import type { IBarChartSpec } from '../../../src';
import { createDiv, removeDom } from '../../util/dom';

const makeSpec = (custom = false): IBarChartSpec => ({
  type: 'bar',
  data: { id: 'data', values: [{ category: 'A', value: 1 }] },
  xField: 'category',
  yField: 'value',
  ...(custom ? { customMark: [{ type: 'text' as const, style: { text: '重建', x: 20, y: 20 } }] } : {})
});

test('new explicit spec dimensions override the saved manual size', () => {
  const dom = createDiv();
  const chart = new VChart(makeSpec(), { dom, autoFit: false, animation: false });
  try {
    chart.renderSync();
    chart.resizeSync(420, 360);
    chart.updateSpecSync({ ...makeSpec(true), width: 640, height: 480 });
    expect(chart.getChart()!.getCanvasRect()).toEqual({ width: 640, height: 480 });
    expect(chart.getStage()!.width).toBe(640);
    expect(chart.getStage()!.height).toBe(480);
  } finally {
    chart.release();
    removeDom(dom);
  }
});

test('manual resize survives spec remakes and keeps the chart and stage at the same size', () => {
  const dom = createDiv();
  const chart = new VChart(makeSpec(), { dom, autoFit: false, animation: false });
  try {
    chart.renderSync();
    chart.resizeSync(420, 360);
    const original = chart.getChart();
    chart.updateSpecSync(makeSpec(true));
    expect(chart.getChart()).not.toBe(original);
    expect(chart.getChart()!.getCanvasRect()).toEqual({ width: 420, height: 360 });
    expect(chart.getStage()!.width).toBe(420);
    expect(chart.getStage()!.height).toBe(360);
    chart.resizeSync(800, 600);
    chart.updateSpecSync(makeSpec());
    expect(chart.getChart()!.getCanvasRect()).toEqual({ width: 800, height: 600 });
    expect(chart.getStage()!.width).toBe(800);
    expect(chart.getStage()!.height).toBe(600);
  } finally {
    chart.release();
    removeDom(dom);
  }
});

describe('manual resize with autoFit enabled', () => {
  const resizeObserverDescriptor = Object.getOwnPropertyDescriptor(window, 'ResizeObserver');
  let dom: HTMLElement;
  let chart: VChart;
  let notifyResize: () => void;

  beforeEach(() => {
    dom = createDiv();
    dom.style.width = '600px';
    dom.style.height = '600px';
    // 控制首次和后续容器通知，避免浏览器调度顺序影响尺寸契约测试。
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: jest.fn().mockImplementation(callback => {
        const observer = { observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() };
        notifyResize = () => callback([], observer);
        return observer;
      })
    });
  });

  afterEach(() => {
    chart.release();
    removeDom(dom);
    if (resizeObserverDescriptor) {
      Object.defineProperty(window, 'ResizeObserver', resizeObserverDescriptor);
    } else {
      delete (window as any).ResizeObserver;
    }
  });

  const createChart = (spec: IBarChartSpec) => {
    chart = new VChart(spec, { dom, animation: false, resizeDelay: 0, dpr: 1 });
    chart.renderSync();
  };

  const expectSize = (width: number, height: number) => {
    expect(chart.getChart()!.getCanvasRect()).toEqual({ width, height });
    expect([chart.getStage()!.width, chart.getStage()!.height]).toEqual([width, height]);
    expect([chart.getCanvas()!.width, chart.getCanvas()!.height]).toEqual([width, height]);
  };

  test('initial observer delivery and unchanged window resize preserve the manual size', async () => {
    createChart({ ...makeSpec(), width: 600, height: 600 });
    await chart.resize(300, 300);
    notifyResize();
    expectSize(300, 300);
    window.dispatchEvent(new Event('resize'));
    expectSize(300, 300);
  });

  test('real container changes still resize the chart after a manual resize', () => {
    createChart(makeSpec());
    chart.resizeSync(300, 300);
    notifyResize();
    expectSize(300, 300);
    dom.style.width = '480px';
    dom.style.height = '360px';
    notifyResize();
    expectSize(480, 360);
    chart.resizeSync(250, 200);
    window.dispatchEvent(new Event('resize'));
    expectSize(250, 200);
  });

  test('an automatic size equal to the current canvas still advances the observed size', () => {
    createChart(makeSpec());
    chart.resizeSync(300, 300);
    dom.style.width = '300px';
    dom.style.height = '300px';
    notifyResize();
    expectSize(300, 300);
    chart.resizeSync(250, 200);
    notifyResize();
    expectSize(250, 200);
    dom.style.width = '600px';
    dom.style.height = '600px';
    notifyResize();
    expectSize(600, 600);
  });

  test('remakes preserve the manual size and new explicit spec dimensions reset automatic sizing', () => {
    createChart({ ...makeSpec(), width: 600, height: 600 });
    chart.resizeSync(300, 300);
    const original = chart.getChart();
    chart.updateSpecSync({ ...makeSpec(true), width: 600, height: 600 });
    expect(chart.getChart()).not.toBe(original);
    notifyResize();
    expectSize(300, 300);
    chart.updateSpecSync({ ...makeSpec(), width: 640, height: 480 });
    expectSize(640, 480);
    notifyResize();
    chart.resizeSync(320, 240);
    window.dispatchEvent(new Event('resize'));
    expectSize(320, 240);
  });
});
