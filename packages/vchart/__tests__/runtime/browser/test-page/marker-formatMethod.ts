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
    width: 800,
    type: 'line',
    xField: 'x',
    yField: 'y',
    markArea: [
      {
        x: 'min',
        x1: 4,
        label: {
          text: '区域: 从 minX 到 x = 4',
          position: 'insideTop'
        }
      },
      {
        y: 20,
        y1: 40,
        label: {
          text: '区域: 从 y = 20 到 y = 40',
          position: 'insideRight'
        }
      },
      {
        coordinates: [
          {
            x: 1,
            y: 10
          },
          {
            x: 2,
            y: 80
          },
          {
            x: 3,
            y: 80
          },
          {
            x: 4,
            y: 50
          }
        ],
        label: {
          text: '区域: 任意数据点连接',
          position: 'middle'
        }
      }
    ],
    data: {
      id: 'data2',
      values: [
        { x: 1, y: 80 },
        { x: 2, y: 40 },
        { x: 3, y: 10 },
        { x: 4, y: 20 }
      ]
    }
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
