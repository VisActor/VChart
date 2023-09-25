import { isMobile } from 'react-device-detect';
import type { IGaugeChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart } from '../../../../src/index';

const run = () => {
  const spec: IGaugeChartSpec = {
    type: 'gauge',
    data: [
      {
        id: 'pointer',
        values: [
          {
            type: 'A',
            value: 0.6
          }
        ]
      },
      {
        id: 'segment',
        values: [
          {
            type: 'level1',
            value: 0.4
          },
          {
            type: 'level2',
            value: 0.6
          },
          {
            type: 'level3',
            value: 0.8
          }
        ]
      }
    ],
    gauge: {
      type: 'gauge',
      dataIndex: 1,
      categoryField: 'type',
      valueField: 'value',
      seriesField: 'type',
      tickMask: {
        visible: true,
        angle: 3,
        offsetAngle: 0,
        forceAlign: true,
        style: {
          cornerRadius: 15
        }
      }
    },
    pointer: {
      style: {
        fill: '#666666'
      }
    },
    categoryField: 'type',
    valueField: 'value',
    outerRadius: 0.8,
    innerRadius: 0.5,
    startAngle: -180,
    endAngle: 0,
    axes: [{ type: 'linear', orient: 'angle', grid: { visible: false } }]
  };

  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
    // theme: 'dark'
  });
  console.time('renderTime');
  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
