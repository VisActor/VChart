import { isMobile } from 'react-device-detect';
import type { IAreaChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart } from '../../../../src/index';

const run = () => {
  const spec = {
    type: 'histogram',
    xField: 'from',
    x2Field: 'to',
    yField: 'profit',
    seriesField: 'type',
    bar: {
      style: {
        stroke: 'white',
        lineWidth: 1
      }
    },
    title: {
      text: 'Profit',
      textStyle: {
        align: 'center',
        height: 50,
        lineWidth: 3,
        fill: '#333',
        fontSize: 25,
        fontFamily: 'Times New Roman'
      }
    },
    tooltip: {
      visible: true,
      mark: {
        title: {
          key: 'title',
          value: 'profit'
        },
        content: [
          {
            key: datum => datum['from'] + '～' + datum['to'],
            value: datum => datum['profit']
          }
        ]
      }
    },
    axes: [
      {
        orient: 'bottom',
        nice: false
      }
    ],
    data: [
      {
        name: 'data1',
        values: [
          {
            from: 0,
            to: 10,
            profit: 2,
            type: 'A'
          },
          {
            from: 10,
            to: 16,
            profit: 3,
            type: 'B'
          },
          {
            from: 16,
            to: 18,
            profit: 15,
            type: 'C'
          },
          {
            from: 18,
            to: 26,
            profit: 12,
            type: 'D'
          },
          {
            from: 26,
            to: 32,
            profit: 22,
            type: 'E'
          },
          {
            from: 32,
            to: 56,
            profit: 7,
            type: 'F'
          },
          {
            from: 56,
            to: 62,
            profit: 17,
            type: 'G'
          }
        ]
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
