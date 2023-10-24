import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  const spec = {
    type: 'radar',
    outerRadius: 0.8,
    padding: 0,
    categoryField: '220919161103035',
    valueField: '10002',
    seriesField: '20001',
    data: [
      {
        id: 'data',
        values: [
          {
            '10001': '总分',
            '10002': '77.90012082312305',
            '10003': '220919101119079',
            '20001': 'OSP',
            '220919101119072': 'OSP',
            '220919101119079': '77.90012082312305',
            '220919161103035': 'TCS'
          },
          {
            '10001': '总分',
            '10002': '76.64943371967965',
            '10003': '220919101119079',
            '20001': 'OSP',
            '220919101119072': 'OSP',
            '220919101119079': '76.64943371967965',
            '220919161103035': '飞书表格'
          },
          {
            '10001': '总分',
            '10002': '75.50839968826602',
            '10003': '220919101119079',
            '20001': 'OSP',
            '220919101119072': 'OSP',
            '220919101119079': '75.50839968826602',
            '220919161103035': 'AIDP'
          },
          {
            '10001': '总分',
            '10002': '51.13928600571502',
            '10003': '220919101119079',
            '20001': 'BPO',
            '220919101119072': 'BPO',
            '220919101119079': '51.13928600571502',
            '220919161103035': 'TCS'
          },
          {
            '10001': '总分',
            '10002': '50.26968962767589',
            '10003': '220919101119079',
            '20001': 'BPO',
            '220919101119072': 'BPO',
            '220919101119079': '50.26968962767589',
            '220919161103035': '携程商旅'
          },
          {
            '10001': '总分',
            '10002': '50.26968962767589',
            '10003': '220919101119079',
            '20001': 'BPO',
            '220919101119072': 'BPO',
            '220919101119079': '50.26968962767589',
            '220919161103035': '大众点评'
          },
          {
            '10001': '总分',
            '10002': '50.097758081334725',
            '10003': '220919101119079',
            '20001': '自建',
            '220919101119072': '自建',
            '220919101119079': '50.097758081334725',
            '220919161103035': '谷歌地图'
          },
          {
            '10001': '总分',
            '10002': '50.097758081334725',
            '10003': '220919101119079',
            '20001': '自建',
            '220919101119072': '自建',
            '220919101119079': '50.097758081334725',
            '220919161103035': '携程商旅'
          },
          {
            '10001': '总分',
            '10002': '50.097758081334725',
            '10003': '220919101119079',
            '20001': '自建',
            '220919101119072': '自建',
            '220919101119079': '50.097758081334725',
            '220919161103035': '大众点评'
          },
          {
            '10001': '总分',
            '10002': '35.687431034146364',
            '10003': '220919101119079',
            '20001': '产业园',
            '220919101119072': '产业园',
            '220919101119079': '35.687431034146364',
            '220919161103035': 'TCS'
          },
          {
            '10001': '总分',
            '10002': '35.60117188759769',
            '10003': '220919101119079',
            '20001': '校企',
            '220919101119072': '校企',
            '220919101119079': '35.60117188759769',
            '220919161103035': 'TCS'
          },
          {
            '10001': '总分',
            '10002': '35.41240504358156',
            '10003': '220919101119079',
            '20001': '校企',
            '220919101119072': '校企',
            '220919101119079': '35.41240504358156',
            '220919161103035': 'AIDP'
          },
          {
            '10001': '总分',
            '10002': '35.27413362267377',
            '10003': '220919101119079',
            '20001': '校企',
            '220919101119072': '校企',
            '220919101119079': '35.27413362267377',
            '220919161103035': '飞书表格'
          },
          {
            '10001': '总分',
            '10002': '34.180154526869856',
            '10003': '220919101119079',
            '20001': '产业园',
            '220919101119072': '产业园',
            '220919101119079': '34.180154526869856',
            '220919161103035': '飞书表格'
          },
          {
            '10001': '总分',
            '10002': '32.93231268170673',
            '10003': '220919101119079',
            '20001': '产业园',
            '220919101119072': '产业园',
            '220919101119079': '32.93231268170673',
            '220919161103035': '视觉CV（图像和视频）-3D模型标注'
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
            domain: ['自建', 'BPO', 'OSP', '校企', '产业园'],
            sortIndex: 0
          },
          '220919101119072': {
            alias: '一级部门'
          },
          '220919101119079': {
            alias: '总分'
          },
          '220919161103035': {
            alias: '标签',
            domain: ['TCS', '飞书表格', 'AIDP', '谷歌地图', '大众点评', '携程商旅', '视觉CV（图像和视频）-3D模型标注'],
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
          tickMode: 'average',
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
          tickMode: 'average',
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
            zIndex: 150,
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: []
          },
          smooth: false
        },
        label: {
          visible: true,
          space: 4,
          flush: true,
          padding: 0,
          style: {
            fontSize: 12,
            maxLineWidth: 174,
            fill: '#9ca0b1',
            angle: 0,
            fontWeight: 'normal',
            dy: -1,
            direction: 'horizontal'
          },
          autoHide: true,
          autoHideMethod: 'greedy'
        }
      }
    ],
    color: {
      field: '20001',
      type: 'ordinal',
      range: ['#6690F2', '#70D6A3', '#B4E6E2', '#63B5FC', '#FF8F62'],
      specified: {},
      domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
    },
    label: {
      visible: false,
      offset: 0,
      overlap: {
        hideOnHit: true,
        avoidBaseMark: false,
        strategy: [
          {
            type: 'position',
            position: ['top', 'bottom']
          },
          {
            type: 'moveY',
            offset: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
          },
          {
            type: 'moveX',
            offset: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
          }
        ]
      },
      style: {
        fontSize: 12,
        zIndex: 400,
        fill: '#363839',
        stroke: 'rgba(255, 255, 255, 0.8)',
        strokeOpacity: 1,
        lineWidth: 1
      }
    },
    legends: [
      {
        type: 'discrete',
        id: 'legend-discrete',
        orient: 'top',
        position: 'middle',
        layoutType: 'normal',
        visible: true,
        maxRow: 2,
        title: {
          textStyle: {
            fontSize: 12,
            fill: '#6F6F6F'
          }
        },
        layoutLevel: 50,
        item: {
          focus: true,
          focusIconStyle: {
            size: 14
          },
          maxWidth: 400,
          spaceRow: 0,
          spaceCol: 0,
          padding: {
            top: 1,
            bottom: 1,
            left: 1,
            right: 1
          },
          background: {
            visible: false,
            style: {
              fillOpacity: 0.001
            }
          },
          label: {
            style: {
              fontSize: 12,
              fill: '#6F6F6F'
            }
          },
          shape: {
            style: {
              lineWidth: 0,
              symbolType: 'square'
            }
          }
        },
        pager: {
          layout: 'horizontal',
          padding: 0,
          textStyle: {},
          space: 0,
          handler: {
            preShape: 'triangleLeft',
            nextShape: 'triangleRight',
            style: {},
            state: {
              disable: {}
            }
          }
        },
        padding: {
          top: 0,
          bottom: 16,
          left: 0,
          right: 0
        }
      }
    ],
    tooltip: {
      handler: {}
    },
    point: {
      style: {
        shape: {
          type: 'ordinal',
          field: '20001',
          range: ['circle'],
          domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
        },
        size: {
          type: 'ordinal',
          field: '20001',
          range: [7.0898154036220635],
          domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
        },
        fill: {
          field: '20001',
          type: 'ordinal',
          range: ['#6690F2', '#70D6A3', '#B4E6E2', '#63B5FC', '#FF8F62'],
          specified: {},
          domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
        },
        stroke: {
          field: '20001',
          type: 'ordinal',
          range: ['#6690F2', '#70D6A3', '#B4E6E2', '#63B5FC', '#FF8F62'],
          specified: {},
          domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
        },
        strokeOpacity: {
          type: 'ordinal',
          field: '20001',
          range: [1],
          domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
        },
        fillOpacity: {
          type: 'ordinal',
          field: '20001',
          range: [1],
          domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
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
    line: {
      style: {
        curveType: {
          type: 'ordinal',
          field: '20001',
          range: ['linear'],
          domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
        },
        lineWidth: {
          type: 'ordinal',
          field: '20001',
          range: [3],
          domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
        },
        lineDash: {
          type: 'ordinal',
          field: '20001',
          range: [[0, 0]],
          domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
        }
      }
    },
    seriesMark: 'line',
    area: {
      visible: true,
      style: {
        fillOpacity: 0.35,
        curveType: {
          type: 'ordinal',
          field: '20001',
          range: ['linear'],
          domain: ['自建', 'BPO', 'OSP', '校企', '产业园']
        }
      }
    },
    region: [
      {
        clip: true
      }
    ],
    background: 'rgba(255, 255, 255, 0)',
    invalidType: 'zero',
    animation: false,
    hash: '5685b620bba27c01eb8edf660152c240'
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
