import { ICandlestickChartSpec } from '../../../../src/charts/candlestick/interface';
import { registerCandlestickChart } from '../../../../src/charts/candlestick/candlestick';
import { VChart } from '@visactor/vchart';

const data = [
  { time: '2024-07-01', open: 100, close: 110, high: 115, low: 95 },
  { time: '2024-07-02', open: 110, close: 105, high: 112, low: 102 },
  { time: '2024-07-03', open: 105, close: 120, high: 125, low: 104 },
  { time: '2024-07-04', open: 120, close: 115, high: 122, low: 110 }
];

const spec: ICandlestickChartSpec = {
  type: 'candlestick',
  xField: 'time',
  openField: 'open',
  closeField: 'close',
  highField: 'high',
  lowField: 'low',
  data: [
    {
      id: 'main',
      values: data
    }
  ]
};

const run = () => {
  registerCandlestickChart();
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
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
