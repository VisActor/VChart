import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';
import { registerLiquidChart } from '@visactor/vchart';
registerLiquidChart();

const run = () => {
  const data1 = [
    { date: 'Day 1', workload: 7000 },
    { date: 'Day 2', workload: 1000 },
    { date: 'Day 3', workload: 6000 },
    { date: 'Day 4', workload: 4000 },
    { date: 'Day 5', workload: 8000 },
    { date: 'Day 6', workload: 3000 },
    { date: 'Day 7', workload: 9000 },
    { date: 'Day 8', workload: 2000 },
    { date: 'Day 9', workload: 5000 }
  ];

  const data2 = [
    { date: 'Day 1', workload: 1000 },
    { date: 'Day 2', workload: 2000 },
    { date: 'Day 3', workload: 3000 },
    { date: 'Day 4', workload: 4000 },
    { date: 'Day 5', workload: 5000 }
  ];

  const data3 = [
    { date: 'Day 0', workload: 3000 },
    { date: 'Day 1', workload: 4000 },
    { date: 'Day 2', workload: 5000 },
    { date: 'Day3', workload: 6000 },
    { date: 'Day4', workload: 7000 },
    { date: 'Day5', workload: 8000 },
    { date: 'Day 5', workload: 8000 },
    { date: 'Day 10', workload: 8000 }
  ];

  const spec = {
    type: 'liquid',
    valueField: 'value',
    width: 500,
    height: 500,
    data: {
      id: 'data2',
      values: [
        {
          value: 0.9
        }
      ]
    },
    indicator: {
      visible: true,
      trigger: 'select',
      title: {
        visible: true,
        style: {
          fontSize: 18,
          text: '进度'
        }
      },
      content: [
        {
          visible: true,
          style: {
            fontSize: 18,
            text: data => {
              if (data) {
                const value = data['value'];
                return value ? `${value}%` : null;
              }
              return 1234;
            }
          }
        }
      ]
    },
    indicatorSmartInvert: true
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
