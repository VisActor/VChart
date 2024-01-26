import type { IDataZoom } from '../../../../src/component/data-zoom';
import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = async () => {
  const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/stocks.json');
  const data = await response.json();
  const spec = {
    type: 'radar',
    point: {
      clipByLayout: true,
      style: {
        shape: {
          type: 'ordinal',
          field: '20001',
          range: ['circle'],
          domain: ['利润']
        },
        size: {
          type: 'ordinal',
          field: '20001',
          range: [8],
          domain: ['利润']
        },
        fill: {
          field: '20001',
          type: 'ordinal',
          range: ['#2E62F1'],
          specified: {},
          domain: ['利润']
        },
        stroke: {
          field: '20001',
          type: 'ordinal',
          range: ['#2E62F1'],
          specified: {},
          domain: ['利润']
        },
        strokeOpacity: {
          type: 'ordinal',
          field: '20001',
          range: [1],
          domain: ['利润']
        },
        fillOpacity: {
          type: 'ordinal',
          field: '20001',
          range: [1],
          domain: ['利润']
        }
      },
      state: {
        hover: {
          lineWidth: 2,
          fillOpacity: 1,
          strokeOpacity: 1,
          scaleX: 1.5,
          scaleY: 1.5
        }
      }
    },
    outerRadius: 0.8,
    categoryField: '230824142919078',
    valueField: '10002',
    seriesField: '20001',
    data: [
      {
        id: 'data',
        values: [
          {
            '10001': '利润',
            '10002': '1053092.6314019188',
            '10003': '230824140418037',
            '20001': '利润',
            '230824140418037': '1053092.6314019188',
            '230824142919078': '消费者'
          },
          {
            '10001': '利润',
            '10002': '681967.6347733513',
            '10003': '230824140418037',
            '20001': '利润',
            '230824140418037': '681967.6347733513',
            '230824142919078': '公司'
          },
          {
            '10001': '利润',
            '10002': '412478.6609529555',
            '10003': '230824140418037',
            '20001': '利润',
            '230824140418037': '412478.6609529555',
            '230824142919078': '小型企业'
          }
        ],
        fields: {
          '10001': {
            alias: '指标名称 '
          },
          '10002': {
            alias: '指标值 '
          },
          '20001': {
            alias: '图例项 ',
            domain: ['利润'],
            lockStatisticsByDomain: true
          },
          '230824140418037': {
            alias: '利润'
          },
          '230824142919078': {
            alias: '细分',
            domain: ['公司', '消费者', '小型企业'],
            lockStatisticsByDomain: true,
            sortIndex: 0
          }
        }
      }
    ],
    axes: [
      {
        orient: 'radius',
        zero: true,
        nice: true,
        tick: {
          visible: false,
          style: {
            stroke: '#DADCDD'
          }
        },
        domainLine: {
          visible: false
        },
        grid: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: '#DADCDD'
          },
          smooth: false
        },
        label: {
          visible: false
        }
      },
      {
        orient: 'angle',
        tick: {
          visible: false,
          style: {
            stroke: '#DADCDD'
          }
        },
        domainLine: {
          visible: false
        },
        grid: {
          visible: true,
          style: {
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: []
          },
          smooth: false
        },
        label: {
          visible: true,
          style: {
            fontSize: 12,
            fill: '#9ca0b1',
            angle: 0,
            fontWeight: 'normal'
          },
          autoHide: true,
          autoHideMethod: 'greedy'
        }
      }
    ],
    color: {
      field: '20001',
      type: 'ordinal',
      range: ['#2E62F1'],
      specified: {},
      domain: ['利润']
    },

    invalidType: 'zero',
    animation: false,
    hash: 'bb5e8f7fbf0f8ade1d9c513fb7b40a01'
  };

  // const spec = {
  //   type: 'bar',
  //   data: [
  //     {
  //       id: 'barData',
  //       values: [
  //         { d: '20世纪', type: 'Autocracies', year: '1930', value: 129 },
  //         { d: '20世纪', type: 'Autocracies', year: '1940', value: 133 },
  //         { d: '20世纪', type: 'Autocracies', year: '1950', value: 130 },
  //         { d: '20世纪', type: 'Autocracies', year: '1960', value: 126 },
  //         { d: '20世纪', type: 'Autocracies', year: '1970', value: 117 },
  //         { d: '20世纪', type: 'Autocracies', year: '1980', value: 114 },
  //         { d: '20世纪', type: 'Autocracies', year: '1990', value: 111 },
  //         { d: '21世纪', type: 'Autocracies', year: '2000', value: 89 },
  //         { d: '21世纪', type: 'Autocracies', year: '2010', value: 80 },
  //         { d: '21世纪', type: 'Autocracies', year: '2018', value: 80 },
  //         { d: '20世纪', type: 'Democracies', year: '1930', value: 22 },
  //         { d: '20世纪', type: 'Democracies', year: '1940', value: 13 },
  //         { d: '20世纪', type: 'Democracies', year: '1950', value: 25 },
  //         { d: '20世纪', type: 'Democracies', year: '1960', value: 29 },
  //         { d: '20世纪', type: 'Democracies', year: '1970', value: 38 },
  //         { d: '20世纪', type: 'Democracies', year: '1980', value: 41 },
  //         { d: '20世纪', type: 'Democracies', year: '1990', value: 57 },
  //         { d: '21世纪', type: 'Democracies', year: '2000', value: 87 },
  //         { d: '21世纪', type: 'Democracies', year: '2010', value: 98 },
  //         { d: '21世纪', type: 'Democracies', year: '2018', value: 99 }
  //       ]
  //     }
  //   ],
  //   xField: ['d', 'year', 'type'],
  //   yField: 'value',
  //   seriesField: 'type',
  //   legends: {
  //     visible: true,
  //     orient: 'top',
  //     position: 'start'
  //   },
  //   axes: [
  //     {
  //       orient: 'bottom',
  //       showAllGroupLayers: true,
  //       sampling: false,
  //       label: {
  //         autoRotate: true
  //       },
  //       layers: [
  //         {
  //           tickCount: 0,
  //           visible: false
  //         }
  //       ]
  //       // tick: {
  //       //   tickCount: 2
  //       // }
  //     }
  //   ]
  // };

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
