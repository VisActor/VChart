import type { IDataZoom } from '../../../../src/component/data-zoom';
import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = async () => {
  const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/stocks.json');
  const data = await response.json();
  const spec = {
    color: ['#1ac7c2', '#6f40aa', '#ccf59a', '#D4ADFC'],
    type: 'bar',
    dataId: 'bar',
    xField: 'Date',
    yField: 'Close',
    seriesField: 'Symbol',
    dataZoom: [
      {
        orient: 'bottom',
        backgroundChart: {
          area: {
            style: {
              lineWidth: 1,
              fill: '#D1DBEE'
            }
          },
          line: {
            style: {
              stroke: '#D1DBEE',
              lineWidth: 1
            }
          }
        },
        selectedBackgroundChart: {
          area: {
            style: {
              lineWidth: 1,
              fill: '#fbb934'
            }
          },
          line: {
            style: {
              stroke: '#fbb934',
              lineWidth: 1
            }
          }
        },
        filterMode: 'axis'
      }
    ],
    legends: {
      visible: true,
      orient: 'top'
    },
    title: {
      textStyle: {
        height: 50,
        lineWidth: 3,
        fill: '#333',
        fontSize: 25,
        fontFamily: 'Times New Roman'
      }
    },
    data: [
      {
        id: 'bar',
        values: data
      }
    ],
    brush: {
      brushType: 'x',
      visible: true
    }
  };

  const vchart = new VChart(spec, { dom: CONTAINER_ID, animation: false });
  vchart.renderSync();
  const dataZoom = vchart.getChart()?.getComponentsByKey('dataZoom')[0] as IDataZoom;
  vchart.on('brushEnd', e => {
    console.log('brushEnd');

    const inBrushData = e.value.inBrushData;
    const dates: string[] = [];

    inBrushData.forEach(datum => {
      const date = datum.Date;
      if (!dates.includes(date)) {
        dates.push(date);
      }
    });

    dataZoom.setStartAndEnd(dates[0], dates[dates.length - 1], ['value', 'value']);
  });

  // 只为了方便控制台调试用，不要拷贝
  window['vchart'] = vchart;
};
run();
