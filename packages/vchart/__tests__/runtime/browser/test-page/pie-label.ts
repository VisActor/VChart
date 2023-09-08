import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const spec_flower = {
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: [
          { type: 'a', value: 100 },
          { type: 'b', value: 89 },
          { type: 'c', value: 123 },
          { type: 'd', value: 300 }
        ]
      }
    ],
    valueField: 'value',
    categoryField: 'type',

    radius: 0.8,
    // innerRadius: 0.2,
    cornerRadius: 0.2,

    center: { x: 150, y: 200 },
    // centerOffset: 10,

    startAngle: 90,
    endAngle: 270,
    padAngle: 10,

    label: {
      visible: true,
      // pickable: false,
      // position: 'inside',
      formatMethod: () => '123123123',
      style: {
        fontSize: 16
        // text: args => '123123123'
      },
      state: {
        hover: {
          fill: 'red'
        }
      },
      line: {
        visible: true,
        style: {
          // stroke: 'blue',
          lineWidth: 2
        },
        state: {
          hover: {
            stroke: 'red'
          }
        }
      },
      layout: {}
    },
    pie: {
      style: {
        stroke: '#aaa',
        lineWidth: 2,
        fill: {
          gradient: 'radial',
          r0: 0,
          x0: 0.5,
          y0: 0.5,
          x1: 0.5,
          y1: 0.5,
          r1: 0.5,
          stops: [
            {
              offset: 0,
              opacity: 0.2
            },
            {
              offset: 0.5,
              opacity: 0.6
            },
            {
              offset: 1,
              opacity: 1
            }
          ]
        }
      },
      state: {
        hover: {
          outerRadius: 0.85,
          fill: {
            gradient: 'radial',
            r0: 0,
            x0: 0.5,
            y0: 0.5,
            x1: 0.5,
            y1: 0.5,
            r1: 0.5,
            stops: [
              {
                offset: 0,
                color: 'red'
              },
              {
                offset: 0.5,
                color: 'yellow'
              },
              {
                offset: 1,
                color: 'blue'
              }
            ]
          }
        },
        selected: {
          stroke: 'blue',
          lineWidth: 2
        }
      }
    }
  };

  const spec_solar_pie = {
    type: 'pie',
    data: [
      {
        values: [
          {
            value: '159',
            type: 'Tradition Industries',
            percentage: '71.6%'
          },
          {
            value: '50',
            type: 'Business Companies',
            percentage: '22.5%'
          },
          {
            value: '13',
            type: 'Customer-facing Companies',
            percentage: '5.9%'
          }
        ]
      }
    ],
    radius: 0.8,
    innerRadius: 0.5,
    valueField: 'value',
    categoryField: 'type',
    label: {
      visible: true,
      style: {
        fontSize: 16
      },
      line: {
        style: {},
        line1MinLength: 30
      },
      layout: {
        align: 'edge'
      }
    },
    pie: {
      state: {
        selected: {
          outerRadius: 0.85
        }
      }
    },
    indicator: {
      visible: true,
      fixed: false,
      trigger: 'select',
      gap: 10,
      title: {
        field: 'type',
        autoLimit: true,
        style: {
          fontSize: 16
        }
      },
      content: [
        {
          field: 'value',
          style: {
            fontSize: 42,
            fontWeight: 'bolder'
          }
        },
        {
          field: 'percentage',
          style: {
            fontSize: 20
          }
        }
      ]
    }
  };

  const spec_huazhu = {
    type: 'pie',
    data: [
      {
        name: 'data1',
        values: [
          {
            value: 348,
            name: '中介渠道: 34.8%'
          },
          {
            value: 152,
            name: '会员: 15.2%'
          },
          {
            value: 500,
            name: '散客: 50%'
          }
        ]
      }
    ],
    valueField: 'value',
    categoryField: 'name',
    // radius: 0.8,
    outerRadius: 0.8,
    innerRadius: 0.5,
    color: ['#87DBDD', '#FF8406', '#468DFF'],
    pie: {
      state: {
        hover: {
          outerRadius: 0.85,
          stroke: '#000',
          lineWidth: 1
        },
        selected: {
          outerRadius: 0.85,
          stroke: '#000',
          lineWidth: 1
        }
      }
    },
    legends: {
      visible: true,
      orient: 'right',
      title: {
        visible: false
      },
      item: {
        visible: true
      }
    },
    tooltip: {
      transitionDuration: 0
    },
    label: {
      visible: true,
      pickable: false
      // position: 'inside'
    }
  };

  const spec_rose = {
    type: 'rose',
    data: [
      {
        values: [
          {
            value: '159',
            type: 'Tradition Industries'
          },
          {
            value: '50',
            type: 'Business Companies'
          },
          {
            value: '13',
            type: 'Customer-facing Companies'
          }
        ]
      }
    ],
    outerRadius: 0.8,
    innerRadius: 0.2,
    categoryField: 'type',
    valueField: 'value',
    seriesField: 'type',
    label: {
      visible: true
      // position: 'inside',
      // style: {
      //   fill: 'black'
      // }
    }
  };

  const spec = {
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: [
          { type: 'oxygen', value: '46.60' },
          { type: 'silicon', value: '27.72' },
          { type: 'aluminum', value: '8.13' },
          { type: 'iron', value: '5' },
          { type: 'calcium', value: '3.63' },
          { type: 'sodium', value: '2.83' },
          { type: 'potassium', value: '2.59' },
          { type: 'others', value: '3.5' }
        ]
      }
    ],
    outerRadius: 0.8,
    valueField: 'value',
    categoryField: 'type',
    // centerOffset: 10,
    title: {
      visible: true,
      text: 'Statistics of Surface Element Content'
    },
    legends: {
      visible: true,
      orient: 'left'
    },
    label: {
      visible: true,
      style: {
        fontSize: 16,
        lineWidth: 2
      },
      line: {
        line1MinLength: 30,
        smooth: true
      },
      layout: {
        // align: 'edge'
      },
      formatMethod: () => {
        return 'test';
      }
      // style: {
      //   // text: datum => {
      //   //   return '12345678';
      //   // }
      // }
    },
    tooltip: {
      mark: {
        content: [
          {
            key: datum => datum['type'],
            value: datum => datum['value'] + '%'
          }
        ]
      }
    }
  };

  const authTypeData = [
    {
      category: 'a',
      value: 4
    },
    {
      category: 'b',
      value: 0
    },
    {
      category: 'c',
      value: 70
    },
    {
      category: 'd',
      value: 2
    }
  ];

  const spec_disappear = {
    type: 'common',
    data: {
      id: 'loop',
      values: authTypeData
    },
    title: {
      visible: true,
      text: '长视频版权授权情况',
      textStyle: {
        fontSize: 14
      }
    },
    legends: {
      visible: true,
      autoPage: false
    },
    series: [
      {
        type: 'pie',
        categoryField: 'category',
        valueField: 'value',
        outerRadius: 1,
        pie: {
          style: {
            stroke: '#ffffff',
            lineWidth: 2
          }
        },
        label: {
          visible: true
          // coverEnable: true,
        }
      }
    ]
  };

  const spec_694 = {
    type: 'rose',
    categoryField: '20001',
    valueField: '230721190118015',
    seriesField: '20001',
    data: [
      {
        id: 'data',
        values: [
          {
            '20001': '消费者',
            '230721190118015': '8025072.194172859',
            '230721190118038': '消费者'
          },
          {
            '20001': '公司',
            '230721190118015': '5152793.296570778',
            '230721190118038': '公司'
          },
          {
            '20001': '小型企业',
            '230721190118015': '2891088.6421899796',
            '230721190118038': '小型企业'
          }
        ],
        fields: {
          '20001': {
            alias: '图例项 ',
            domain: ['消费者', '公司', '小型企业']
          },
          '230721190118015': {
            alias: '销售额'
          },
          '230721190118038': {
            alias: '细分'
          }
        }
      }
    ],
    outerRadius: 0.8,
    label: {
      visible: true,
      overlap: {
        hideOnHit: true
      },
      style: {
        fontSize: 12,
        fill: null,
        lineWidth: 0,
        strokeOpacity: 1
      },
      layout: {
        tangentConstraint: false
      },
      position: 'outside',
      interactive: false
    },
    color: {
      field: '20001',
      type: 'ordinal',
      range: ['#2E62F1', '#4DC36A', '#FF8406'],
      specified: {},
      domain: ['消费者', '公司', '小型企业']
    },
    legends: [
      {
        type: 'discrete',
        id: 'legend',
        orient: 'right',
        position: 'start',
        layoutType: 'normal',
        visible: true,
        maxCol: 1,
        title: {
          textStyle: {
            fontSize: 12,
            fill: '#6F6F6F'
          }
        },
        item: {
          focus: true,
          focusIconStyle: {
            size: 14
          },
          maxWidth: 677,
          spaceRow: 0,
          spaceCol: 0,
          padding: {
            top: 1,
            bottom: 1,
            left: 2,
            right: 2
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
              symbolType: 'square'
            }
          }
        },
        pager: {
          textStyle: {},
          handler: {
            style: {},
            state: {
              disable: {}
            }
          }
        },
        padding: {
          top: 0,
          bottom: 0,
          left: 16,
          right: 0
        }
      }
    ],
    hover: {
      enable: true
    },
    select: {
      enable: true
    },
    rose: {
      state: {
        hover: {
          cursor: 'pointer',
          fillOpacity: 0.8,
          stroke: '#58595B',
          lineWidth: 1,
          zIndex: 500
        },
        selected: {
          cursor: 'pointer',
          fillOpacity: 1,
          stroke: '#58595B',
          lineWidth: 1
        },
        selected_reverse: {
          fillOpacity: 0.3,
          strokeWidth: 0.3
        }
      }
    },
    tooltip: {
      handler: {}
    },
    background: 'rgba(255, 255, 255, 0)',
    pie: {},
    animation: false,
    hash: 'bd0c04a763cd7dd4fb4b97089be2334c'
  };

  const spec_animation = {
    // animation: false,
    type: 'pie',
    categoryField: '20001',
    valueField: '230901153400086',
    seriesField: '20001',
    padding: 0,
    data: [
      {
        id: 'data',
        values: [
          {
            '20001': '华东',
            '230901144537180': '华东',
            '230901153400086': '4684506.442247391'
          },
          {
            '20001': '中南',
            '230901144537180': '中南',
            '230901153400086': '4137415.0951108932'
          },
          {
            '20001': '地区-dongbei',
            '230901144537180': '地区-dongbei',
            '230901153400086': '2681567.4745378494'
          },
          {
            '20001': '西南',
            '230901144537180': '西南',
            '230901153400086': '1303124.5089645386'
          },
          {
            '20001': '西北',
            '230901144537180': '西北',
            '230901153400086': '815039.5979347229'
          },
          {
            '20001': '华北',
            '230901144537180': '华北',
            '230901153400086': null
          }
        ],
        fields: {
          '20001': {
            alias: '图例项 ',
            domain: ['华东', '中南', '地区-dongbei', '西南', '西北', '华北'],
            lockStatisticsByDomain: true
          },
          '230901144537180': {
            alias: '地区'
          },
          '230901153400086': {
            alias: '销售额-存在空'
          }
        }
      }
    ],
    outerRadius: 0.9,
    label: {
      visible: true,
      overlap: {
        hideOnHit: true
      },
      style: {
        fontSize: 12,
        fill: null,
        lineWidth: 0,
        strokeOpacity: 1
      },
      position: 'outside',
      interactive: false
    },
    color: {
      field: '20001',
      type: 'ordinal',
      range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00', '#4F44CF', '#5AC8FA'],
      specified: {},
      domain: ['华东', '中南', '地区-dongbei', '西南', '西北', '华北']
    },
    legends: [
      {
        type: 'discrete',
        id: 'legend',
        orient: 'right',
        position: 'start',
        layoutType: 'normal',
        visible: true,
        maxCol: 1,
        title: {
          textStyle: {
            fontSize: 12,
            fill: '#6F6F6F'
          }
        },
        item: {
          focus: true,
          focusIconStyle: {
            size: 14
          },
          maxWidth: 325,
          spaceRow: 0,
          spaceCol: 0,
          padding: {
            top: 1,
            bottom: 1,
            left: 2,
            right: 2
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
          textStyle: {},
          handler: {
            style: {},
            state: {
              disable: {}
            }
          }
        },
        padding: {
          top: 0,
          bottom: 0,
          left: 16,
          right: 0
        }
      }
    ],
    hover: {
      enable: true
    },
    select: {
      enable: true
    },
    pie: {
      state: {
        hover: {
          cursor: 'pointer',
          fillOpacity: 0.8,
          stroke: '#58595B',
          lineWidth: 1,
          zIndex: 500,
          outerRadius: 0.9500000000000001
        },
        selected: {
          cursor: 'pointer',
          fillOpacity: 1,
          stroke: '#58595B',
          lineWidth: 1,
          outerRadius: 0.9500000000000001
        },
        selected_reverse: {
          fillOpacity: 0.3,
          strokeWidth: 0.3
        }
      }
    },
    tooltip: {
      handler: {}
    },
    background: 'rgba(255, 255, 255, 0)',
    rose: {},
    hash: '8fefead4c53c18c47279796bce64468e'
  };

  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  console.time('renderTime');
  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
  cs.on('click', event => {
    console.log(event);
  });
};
run();
