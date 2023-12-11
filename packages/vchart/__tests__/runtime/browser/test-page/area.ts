import { isMobile } from 'react-device-detect';
import type { IAreaChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart } from '../../../../src/index';

const data = [
  { y: '757', x: '0', y2: '0', type: 'A', type2: 'A', color: 'A' },
  { y: '642', x: '1', y2: '0', type: 'A', type2: 'A', color: 'A' },
  { y: '635', x: '2', y2: '0', type: 'A', type2: 'A', color: 'A' },
  { y: '686', x: '3', y2: '0', type: 'A', type2: 'A', color: 'A' },
  { y: '602', x: '4', y2: '0', type: 'A', type2: 'A', color: 'A' },
  { y: '749', x: '5', y2: '0', type: 'A', type2: 'A', color: 'A' },
  { y: '859', x: '6', y2: '0', type: 'A', type2: 'A', color: 'A' },
  { y: '638', x: '7', y2: '0', type: 'A', type2: 'A', color: 'A' },
  { y: '872', x: '8', y2: '0', type: 'A', type2: 'A', color: 'A' },
  { y: '843', x: '9', y2: '0', type: 'A', type2: 'A', color: 'A' },
  { y: '636', x: '0', y2: '0', type: 'B', type2: 'A', color: 'C' },
  { y: '751', x: '1', y2: '0', type: 'B', type2: 'A', color: 'C' },
  { y: '754', x: '2', y2: '0', type: 'B', type2: 'A', color: 'C' },
  { y: '792', x: '3', y2: '0', type: 'B', type2: 'A', color: 'C' },
  { y: '657', x: '4', y2: '0', type: 'B', type2: 'A', color: 'C' },
  { y: '835', x: '5', y2: '0', type: 'B', type2: 'A', color: 'C' },
  { y: '696', x: '6', y2: '0', type: 'B', type2: 'A', color: 'C' },
  { y: '685', x: '7', y2: '0', type: 'B', type2: 'A', color: 'C' },
  { y: '893', x: '8', y2: '0', type: 'B', type2: 'A', color: 'C' },
  { y: '661', x: '9', y2: '0', type: 'B', type2: 'A', color: 'C' },
  { y: '646', x: '0', y2: '0', type: 'A', type2: 'B', color: 'B' },
  { y: '879', x: '1', y2: '0', type: 'A', type2: 'B', color: 'B' },
  { y: '680', x: '2', y2: '0', type: 'A', type2: 'B', color: 'B' },
  { y: '775', x: '3', y2: '0', type: 'A', type2: 'B', color: 'B' },
  { y: '749', x: '4', y2: '0', type: 'A', type2: 'B', color: 'B' },
  { y: '843', x: '5', y2: '0', type: 'A', type2: 'B', color: 'B' },
  { y: '691', x: '6', y2: '0', type: 'A', type2: 'B', color: 'B' },
  { y: '633', x: '7', y2: '0', type: 'A', type2: 'B', color: 'B' },
  { y: '832', x: '8', y2: '0', type: 'A', type2: 'B', color: 'B' },
  { y: '636', x: '9', y2: '0', type: 'A', type2: 'B', color: 'B' },
  { y: '669', x: '0', y2: '0', type: 'B', type2: 'B', color: 'D' },
  { y: '713', x: '1', y2: '0', type: 'B', type2: 'B', color: 'D' },
  { y: '706', x: '2', y2: '0', type: 'B', type2: 'B', color: 'D' },
  { y: '695', x: '3', y2: '0', type: 'B', type2: 'B', color: 'D' },
  { y: '855', x: '4', y2: '0', type: 'B', type2: 'B', color: 'D' },
  { y: '806', x: '5', y2: '0', type: 'B', type2: 'B', color: 'D' },
  { y: '721', x: '6', y2: '0', type: 'B', type2: 'B', color: 'D' },
  { y: '613', x: '7', y2: '0', type: 'B', type2: 'B', color: 'D' },
  { y: '748', x: '8', y2: '0', type: 'B', type2: 'B', color: 'D' },
  { y: '664', x: '9', y2: '0', type: 'B', type2: 'B', color: 'D' }
];
const spec = {
  data: {
    id: 'barData',
    values: data
  },
  type: 'bar',
  xField: ['x', 'type'],
  yField: 'y',
  seriesField: 'color',
  axes: [
    { orient: 'bottom', type: 'band' },
    { orient: 'left', type: 'linear' }
  ],
  label: {
    visible: true,
    formatMethod: 'labelFormat'
  },
  animation: true
};

const run = () => {
  VChart.registerFunction('labelFormat', text => text + 'test');
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');

  cs.on('tooltipShow', () => {
    console.log('tooltipShow');
  });

  cs.on('tooltipHide', () => {
    console.log('tooltipHide');
  });

  cs.on('tooltipRelease', () => {
    console.log('tooltipRelease');
  });

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
