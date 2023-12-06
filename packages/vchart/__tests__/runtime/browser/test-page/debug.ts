import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  const spec = {};

  const vchart = new VChart(spec, { dom: CONTAINER_ID, onError: null });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
