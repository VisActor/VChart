import { isMobile } from 'react-device-detect';
import type { IVennChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart, registerVennChart } from '../../../../src/index';

const spec: IVennChartSpec = {
  type: 'venn',
  data: {
    values: [
      { set: ['A'], value: 8, label: 'A' },
      { set: ['B'], value: 10, label: 'B' },
      { set: ['C'], value: 12, label: 'C' },
      { set: ['A', 'B'], value: 4, label: 'A,B', stroke: 'red' },
      { set: ['A', 'C'], value: 4, label: 'A,C', stroke: 'red' },
      { set: ['B', 'C'], value: 4, label: 'B,C', stroke: 'red' },
      { set: ['A', 'B', 'C'], value: 2, label: 'A,B,C', stroke: 'blue' }
    ]
  },
  title: {
    visible: true,
    text: 'Stacked area chart of cosmetic products sales'
  },
  categoryField: 'set',
  valueField: 'value',
  seriesField: 'set',
  legends: [{ visible: true, position: 'middle', orient: 'bottom' }]
};

const run = () => {
  registerVennChart();
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    //theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });

  window['vchart'] = cs;
  console.log(cs);
};
run();
