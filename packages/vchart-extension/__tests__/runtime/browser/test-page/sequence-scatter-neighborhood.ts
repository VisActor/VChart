import { registerSequenceScatter } from '../../../../src';
import { VChart } from '@visactor/vchart';
import { getSeqScatterChartData, selectEdges } from '../../../../src/charts/sequence-scatter/utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

/*
   Sequence scatter showing neighbors
*/
const TASK_TYPE = 'neighborhood';

/*
  get chart data
*/
const { chartData, scope, label_color_dict } = getSeqScatterChartData(TASK_TYPE);

/*
  create spec for sequence-scatter
*/
const spec = {
  type: 'sequenceScatter',
  taskType: TASK_TYPE,
  labelColor: label_color_dict,
  scope: scope,
  data: chartData,
  xField: 'x',
  yField: 'y',

  infoLabel: {
    visible: true,
    style: {
      text: datum => {
        return 'iteration: ' + datum.iter;
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
    onError: err => {
      console.error(err);
    }
  });

  // register events to show edges
  cs.on('pointerover', { id: 'scatter-series' }, (e: { datum: { x: number; y: number } }) => {
    const endpoints = selectEdges(spec.data, e.datum?.x, e.datum?.y);
    cs.updateDataSync('edges', endpoints);
  });
  cs.on('pointerout', { id: 'scatter-series' }, e => {
    cs.updateDataSync('edges', []);
  });

  console.time('renderTime');

  cs.renderSync();

  console.timeEnd('renderTime');
  window['vchart'] = cs;
  console.log(cs);
};
run();
