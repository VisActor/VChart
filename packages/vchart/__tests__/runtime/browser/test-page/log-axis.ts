import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const dataSet = new DataSet();
  dataSet.registerParser('csv', csvParser);
  const dataView = new DataView(dataSet);
  const type1 = ['A', 'B'];
  const type2 = ['A', 'B'];
  const color = {
    A: {
      A: 'A',
      B: 'B'
    },
    B: {
      A: 'C',
      B: 'D'
    }
  };

  let data = 'y,x,y2,type,type2,color';
  type2.forEach(t2 => {
    type1.forEach(t => {
      for (let i = 0; i < 10; i++) {
        data += `\n${Math.floor(Math.random() * 300) + 600},${i},0,${t},${t2},${color[t][t2]}`;
      }
    });
  });

  dataView.parse(data, {
    type: 'csv'
  });
  const spec = {
    type: 'line',
    data: [
      {
        values: [
          {
            time: 1,
            a: 0,
            b: 117,
            c: 145
          },
          {
            time: 10,
            a: 1,
            b: 1317,
            c: 2345
          },
          {
            time: 100,
            a: 2,
            b: 2500,
            c: 3100
          },
          {
            time: 1000,
            a: 3,
            b: 7500,
            c: 6100
          },
          {
            time: 10000,
            a: 4,
            b: 7500,
            c: 6100
          },
          {
            time: 100000,
            a: 5,
            b: 7500,
            c: 6100
          },
          {
            time: 1000000,
            a: 6,
            b: 7500,
            c: 6100
          }
        ]
      }
    ],
    xField: 'time',
    yField: 'a',
    axes: [
      { orient: 'left', type: 'linear' },
      { orient: 'bottom', type: 'log' }
    ]
  };

  const cs = new VChart(spec, {
    dataSet,
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
