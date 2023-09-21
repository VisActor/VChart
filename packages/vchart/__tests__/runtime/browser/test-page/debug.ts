import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  const spec = {
    type: 'bar',
    data: [
      {
        id: 'barData',
        values: [
          {
            State: 'WY',
            Age: 'Under 5 Years',
            Population: 25635
          },
          {
            State: 'WY',
            Age: '5 to 13 Years',
            Population: 1890
          },
          {
            State: 'WY',
            Age: '14 to 17 Years',
            Population: 9314
          },
          {
            State: 'DC',
            Age: 'Under 5 Years',
            Population: 30352
          },
          {
            State: 'DC',
            Age: '5 to 13 Years',
            Population: 20439
          },
          {
            State: 'DC',
            Age: '14 to 17 Years',
            Population: 10225
          },
          {
            State: 'VT',
            Age: 'Under 5 Years',
            Population: 38253
          },
          {
            State: 'VT',
            Age: '5 to 13 Years',
            Population: 42538
          },
          {
            State: 'VT',
            Age: '14 to 17 Years',
            Population: 15757
          },
          {
            State: 'ND',
            Age: 'Under 5 Years',
            Population: 51896
          },
          {
            State: 'ND',
            Age: '5 to 13 Years',
            Population: 67358
          },
          {
            State: 'ND',
            Age: '14 to 17 Years',
            Population: 18794
          },
          {
            State: 'AK',
            Age: 'Under 5 Years',
            Population: 72083
          },
          {
            State: 'AK',
            Age: '5 to 13 Years',
            Population: 85640
          },
          {
            State: 'AK',
            Age: '14 to 17 Years',
            Population: 22153
          }
        ]
      }
    ],
    xField: 'State',
    yField: 'Population',
    seriesField: 'Age',
    stack: true,
    legends: {
      visible: true
    },
    bar: {
      // The state style of bar
      state: {
        hover: {
          stroke: '#000',
          lineWidth: 1
        }
      }
    }
  };

  // const spec = {
  //   type: 'bar',
  //   data: [
  //     {
  //       id: 'barData',
  //       values: [
  //         { month: 'Monday', sales: 22 },
  //         { month: 'Tuesday', sales: 13 },
  //         { month: 'Wednesday', sales: 25 },
  //         { month: 'Thursday', sales: 29 },
  //         { month: 'Friday', sales: 38 }
  //       ]
  //     }
  //   ],
  //   xField: 'month',
  //   yField: 'sales'
  // };

  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
