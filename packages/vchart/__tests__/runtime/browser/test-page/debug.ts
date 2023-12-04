import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  const spec = {
    direction: 'vertical',
    type: 'common',
    series: [
      {
        id: 'bar-0',
        type: 'bar',
        stack: true,
        bar: {
          state: {
            hover: {
              stroke: '#000',
              lineWidth: 1
            }
          }
        },
        label: {
          visible: true,
          position: 'inside'
        },
        xField: ['商场名称'],
        yField: ['销售业绩'],
        dataId: 'editor_standard_5de6eecd-a77b-4724-bdaa-f3dc54192c68',
        seriesField: '年份'
      }
    ],
    legends: {
      id: 'legend-discrete',
      visible: true,
      autoPage: false,
      position: 'start'
    },
    region: [
      {
        id: 'region-0',
        style: {}
      }
    ],
    tooltip: {
      visible: true
    },
    title: {
      id: 'title',
      visible: true,
      text: '标题'
    },
    axes: [
      {
        orient: 'left',
        id: 'axis-left',
        type: 'linear',
        label: {
          autoLimit: false,
          formatMethod: null
        },
        maxWidth: null,
        maxHeight: null
      },
      {
        orient: 'bottom',
        id: 'axis-bottom',
        type: 'band',
        label: {
          autoLimit: false
        },
        maxWidth: null,
        maxHeight: null,
        trimPadding: false
      }
    ],
    data: [
      {
        id: 'editor_standard_5de6eecd-a77b-4724-bdaa-f3dc54192c68',
        values: [
          {
            商场名称: 'IFS（成都）',
            年份: '2019年',
            销售业绩: '64.9'
          },
          {
            商场名称: 'IFS（成都）',
            年份: '2020年',
            销售业绩: '70'
          },
          {
            商场名称: '丹尼斯大卫城',
            年份: '2019年',
            销售业绩: '61.5'
          },
          {
            商场名称: '丹尼斯大卫城',
            年份: '2020年',
            销售业绩: '70'
          },
          {
            商场名称: '远洋太古里（成都）',
            年份: '2019年',
            销售业绩: '68.7'
          },
          {
            商场名称: '远洋太古里（成都）',
            年份: '2020年',
            销售业绩: '73'
          },
          {
            商场名称: '国金中心（上海）',
            年份: '2019年',
            销售业绩: '90'
          },
          {
            商场名称: '国金中心（上海）',
            年份: '2020年',
            销售业绩: '100'
          },
          {
            商场名称: '恒隆广场（上海）',
            年份: '2019年',
            销售业绩: '62.5'
          },
          {
            商场名称: '恒隆广场（上海）',
            年份: '2020年',
            销售业绩: '100'
          },
          {
            商场名称: '万象城（深圳）',
            年份: '2019年',
            销售业绩: '90'
          },
          {
            商场名称: '万象城（深圳）',
            年份: '2020年',
            销售业绩: '100'
          },
          {
            商场名称: '杭州大厦（杭州）',
            年份: '2019年',
            销售业绩: '90'
          },
          {
            商场名称: '杭州大厦（杭州）',
            年份: '2020年',
            销售业绩: '100'
          },
          {
            商场名称: '德基广场（南京）',
            年份: '2019年',
            销售业绩: '122.4'
          },
          {
            商场名称: '德基广场（南京）',
            年份: '2020年',
            销售业绩: '150'
          },
          {
            商场名称: '国贸商城（北京）',
            年份: '2019年',
            销售业绩: '117'
          },
          {
            商场名称: '国贸商城（北京）',
            年份: '2020年',
            销售业绩: '160'
          },
          {
            商场名称: 'SKP（北京）',
            年份: '2019年',
            销售业绩: '152.9'
          },
          {
            商场名称: 'SKP（北京）',
            年份: '2020年',
            销售业绩: '177'
          }
        ],
        fields: {
          商场名称: {
            type: 'ordinal'
          },
          年份: {
            type: 'ordinal'
          },
          销售业绩: {
            type: 'linear'
          }
        }
      }
    ],
    markArea: [],
    markLine: [
      {
        id: 'bdb36d25-2bb2-4c1e-a622-321f40daefca',
        interactive: true,
        name: 'growth-line',
        coordinates: [
          {
            商场名称: 'IFS（成都）',
            年份: '2020年',
            销售业绩: 134.9,
            __VCHART_DEFAULT_DATA_INDEX: 1,
            __VCHART_DEFAULT_DATA_KEY: 1,
            __VCHART_STACK_END: 134.9,
            __VCHART_STACK_START: 64.9,
            VGRAMMAR_DATA_ID_KEY_50: 1,
            __VCHART_STACK_TOTAL: 134.9,
            __VCHART_STACK_TOTAL_TOP: true
          },
          {
            商场名称: 'SKP（北京）',
            年份: '2020年',
            销售业绩: 329.9,
            __VCHART_DEFAULT_DATA_INDEX: 19,
            __VCHART_DEFAULT_DATA_KEY: 19,
            __VCHART_STACK_END: 329.9,
            __VCHART_STACK_START: 152.9,
            VGRAMMAR_DATA_ID_KEY_50: 19,
            __VCHART_STACK_TOTAL: 329.9,
            __VCHART_STACK_TOTAL_TOP: true
          }
        ],
        line: {
          style: {
            stroke: '#000',
            lineWidth: 2,
            boundsPadding: [2, 2, 2, 2],
            pickMode: 'imprecise',
            lineDash: [0],
            _debug_bounds: true
          }
        },
        label: {
          position: 'middle',
          text: '10%',
          labelBackground: {
            padding: {
              left: 4,
              right: 4,
              top: 4,
              bottom: 4
            },
            style: {
              fill: '#fff',
              fillOpacity: 1,
              stroke: '#000',
              lineWidth: 1,
              cornerRadius: 4
            }
          },
          style: {
            fill: '#000',
            fontSize: 14,
            fontWeight: 'normal',
            fontStyle: 'normal'
          },
          refY: 5
        },
        endSymbol: {
          size: 12,
          refX: -4,
          visible: true,
          symbolType: 'triangle',
          style: {
            fill: '#606773',
            stroke: null,
            lineWidth: 0
          }
        },
        coordinatesOffset: [
          {
            x: 0,
            y: '-80.45871559633026%'
          },
          {
            x: 0,
            y: '-80.45871559633026%'
          }
        ],
        _originValue_: [134.9, 329.9],
        startSymbol: {
          visible: false,
          symbolType: 'triangle',
          size: 10,
          style: {
            fill: '#606773',
            stroke: null,
            lineWidth: 0
          }
        }
      }
    ],
    width: 400,
    height: 400,
    background: 'transparent'
  };

  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
