import { isMobile } from 'react-device-detect';
import type { IAreaChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart } from '../../../../src/index';

const getSpec = (): IAreaChartSpec => ({
  type: 'waterfall',
  data: {
    id: 'id0',
    values: [
      { x: 'Feb.4', total: true, value: 45 },
      { x: 'Feb.11', y: -5 },
      { x: 'Feb.20', y: 2 },
      { x: 'Feb.25', y: -2 },
      { x: 'Mar.4', y: 2 },
      { x: 'Mar.11', y: 2 },
      { x: 'Mar.19', y: -2 },
      { x: 'Mar.26', y: 1 },
      { x: 'Apr.1', y: 1 },
      { x: 'Apr.8', y: 1 },
      { x: 'Apr.15', y: 2 },
      { x: 'Apr.22', y: 1 },
      { x: 'Apr.29', y: -2 },
      { x: 'May.6', y: -1 },
      { x: 'total', total: true }
    ]
  },
  legends: { visible: true, orient: 'bottom' },
  xField: 'x',
  yField: 'y',
  stackLabel: {
    valueType: 'absolute',
    formatMethod: text => {
      return text + '%';
    }
  },
  seriesFieldName: {
    total: '总计',
    increase: '增加',
    decrease: '减少'
  },
  total: {
    type: 'field',
    tagField: 'total',
    valueField: 'value'
  },
  axes: [
    {
      orient: 'left',
      range: { min: 30, max: 50 },
      title: { visible: true, text: 'favorability' },
      label: {
        formatMethod: v => {
          return v + '%';
        }
      }
    },
    {
      orient: 'bottom',
      label: { visible: true },
      type: 'band',
      paddingInner: 0.4,
      title: { visible: true, text: 'date' }
    }
  ]
});

const run = () => {
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(getSpec(), {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    //theme: 'dark',
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
  window['getSpec'] = getSpec;
  console.log(cs);
};
run();
