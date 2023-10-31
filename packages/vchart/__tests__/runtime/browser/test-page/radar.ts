import { isMobile } from 'react-device-detect';
import type { IRadarChartSpec } from '../../../../src/index';
import { VChart } from '../../../../src/index';

const run = () => {
  const mockData: any[] = [];
  const types = ['A', 'B', 'C'];

  types.forEach(type => {
    for (let i = 1; i <= 12; i++) {
      mockData.push({ month: i + '月', value: Math.random() * 100 + 10, type });
    }
  });

  const spec: IRadarChartSpec = {
    type: 'rose',
    data: [
      {
        values: [
          {
            value: '159',
            type: 'Tradition Industries'
          },
          {
            value: '50',
            type: 'Business Companies'
          },
          {
            value: '13',
            type: 'Customer-facing Companies'
          }
        ]
      }
    ],
    outerRadius: 0.8,
    innerRadius: 0.2,
    categoryField: 'type',
    valueField: 'value',
    seriesField: 'type',
    label: {
      visible: true,
      layout: {
        tangentConstraint: false
      }
    },
    axes: [
      {
        type: 'band',
        orient: 'angle',
        visible: true,
        grid: {
          visible: true
        },
        domainLine: {
          visible: true
        },
        label: {
          visible: true
        }
      }
    ]
  };
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  console.time('renderTime');

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
