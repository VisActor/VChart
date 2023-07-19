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

  const spec = {
    width: 800,
    type: 'bar',
    xField: 'x',
    yField: 'y',
    title: {
      text: 'xxx'
    },
    data: {
      id: 'data2',
      values: [
        { x: 'A', y: 80 },
        { x: 'B', y: 40 },
        { x: 'C', y: 10 },
        { x: 'D', y: 20 }
      ]
    },
    legends: {},
    dataZoom: [
      {
        orient: 'bottom'
      }
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
