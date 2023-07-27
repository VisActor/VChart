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
            time: '0',
            a: 123,
            b: 117,
            c: 145
          },
          {
            time: '30',
            a: 1223,
            b: 1317,
            c: 2345
          },
          {
            time: '60',
            a: 2123,
            b: 2500,
            c: 3100
          },
          {
            time: '90',
            a: 5123,
            b: 7500,
            c: 6100
          },
          {
            time: '120',
            a: 5123,
            b: 7500,
            c: 6100
          },
          {
            time: '150',
            a: 6123,
            b: 8500,
            c: 7100
          },
          {
            time: '180',
            a: 8123,
            b: 9500,
            c: 8100
          },
          {
            time: '210',
            a: 10123,
            b: 12500,
            c: 11100
          },
          {
            time: '240',
            a: 14123,
            b: 15500,
            c: 16100
          }
        ]
        // values: [
        //   { x: 1,  y: 0 },
        //   { x: 10,  y: 1 },
        //   { x: 100,  y: 2 },
        //   { x: 1000, y: 3 },
        //   { x: 10000, y: 4 },

        //   // { x: 1676224, size: 163453, y: 2517, type: '家具', area: '华东' },
        //   // { x: 1466575, size: 251487, y: 2087, type: '技术', area: '中南' },
        //   // { x: 824673, size: 86067, y: 3622, type: '办公用品', area: '东北' },
        //   // { x: 230956, size: 24016, y: 347, type: '技术', area: '西北' },
        //   // { x: 1599653, size: 228179, y: 2183, type: '技术', area: '华东' },
        //   // { x: 745813, size: 137265, y: 3020, type: '办公用品', area: '华北' },
        //   // { x: 267870, size: 49633, y: 970, type: '办公用品', area: '西北' },
        //   // { x: 1408628, size: 215585, y: 6341, type: '办公用品', area: '华东' },
        //   // { x: 781743, size: 144986, y: 927, type: '技术', area: '华北' },
        //   // { x: 501533, size: 29303, y: 814, type: '家具', area: '西南' },
        //   // { x: 920698, size: 72692, y: 1470, type: '家具', area: '东北' },
        //   // { x: 316212, size: 24903, y: 468, type: '家具', area: '西北' },
        //   // { x: 1399928, size: 199582, y: 2023, type: '家具', area: '中南' },
        //   // { x: 347692, size: 49272, y: 1858, type: '办公用品', area: '西南' }
        // ]
      }
    ],
    xField: 'time',
    yField: 'a',
    axes: [
      { orient: 'left', type: 'log' },
      { orient: 'bottom', type: 'linear' }
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
