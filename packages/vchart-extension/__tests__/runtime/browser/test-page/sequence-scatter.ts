import { registerSequenceScatter } from '../../../../src';
import { VChart } from '@visactor/vchart';
import trainingData1 from '../data/sequence-scatter/Training_process1/data.json';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import trainingData2 from '../data/sequence-scatter/Training_process2/data.json';
const origianlData = trainingData1;
// const origianlData = trainingData2;
const chartData = {};
Object.keys(origianlData).forEach(inter => {
  chartData[inter] = [];
  origianlData[inter].projection.forEach(pos => {
    chartData[inter].push({
      x: pos[0],
      y: pos[1]
    });
  });
});
const spec = {
  type: 'sequenceScatter',
  data: chartData,
  xField: 'x',
  yField: 'y',

  infoLabel: {
    visible: true,
    style: {
      text: datum => {
        return 'interation: ' + datum.inter;
      }
    }
  },
  player: {
    orient: 'bottom',
    auto: true,
    interval: 2000,
    duration: 2000
  }
};

const run = () => {
  registerSequenceScatter();
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    //theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');

  cs.renderSync();

  console.timeEnd('renderTime');
  window['vchart'] = cs;
  console.log(cs);
};
run();
