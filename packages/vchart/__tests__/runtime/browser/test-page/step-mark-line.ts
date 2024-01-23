import type { IBarChartSpec, ILineChartSpec, IMarkLineSpec, IPieChartSpec } from '../../../../src/index';
import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  const spec: IPieChartSpec = {
    // type: 'bar',
    // xField: 'month',
    // yField: 'sales',
    type: 'rose',
    categoryField: 'month',
    valueField: 'sales',

    labelLayout: 'region',

    data: [
      {
        id: 'barData',
        values: [
          { month: 'Monday', sales: 22 },
          { month: 'Tuesday', sales: 13 },
          { month: 'Wednesday', sales: 25 },
          { month: 'Thursday', sales: 29 },
          { month: 'Friday', sales: 38 }
        ]
      }
    ],

    label: [
      { visible: true },
      {
        visible: true,
        position: 'inside',
        style: { fill: 'red', fontSize: 20 }
      },
      {
        visible: true,
        position: 'inside-outer',
        style: { fill: 'blue', fontSize: 20 }
      }
    ]
    // label: {
    //   visible: true
    // }
  };

  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
