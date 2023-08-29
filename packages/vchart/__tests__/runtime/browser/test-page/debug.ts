import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  const spec = {
    type: 'bar',
    height: 200,
    width: 350,
    // padding: 0,
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
    xField: 'month',
    yField: 'sales',
    axes: [
      {
        orient: 'bottom',
        sampling: false,
        label: {
          autoRotate: true,
          autoLimit: true,
          autoHide: true
        }
      },
      {
        orient: 'left',
        sampling: false,
        label: {
          autoRotate: true,
          autoLimit: true,
          autoHide: true,
          formatMethod: () => 'AAAAAAAAAAA',
          flush: true
        }
      }
    ]
  };

  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
