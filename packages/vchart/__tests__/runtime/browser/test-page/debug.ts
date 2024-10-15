import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = async () => {
  // const spec = {
  //   direction: 'vertical',
  //   type: 'common',
  //   color: ['#00295C', '#2568BD', '#9F9F9F', '#C5C5C5', '#00B0F0', '#4BCFFF', '#C2C2C2', '#D7D7D7'],
  //   series: [
  //     {
  //       type: 'bar',
  //       stack: true,
  //       direction: 'vertical',
  //       bar: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         },
  //         state: {
  //           hover: {
  //             stroke: '#000',
  //             lineWidth: 1
  //           }
  //         }
  //       },
  //       barBackground: {
  //         style: {
  //           stroke: '',
  //           lineWidth: 1
  //         }
  //       },
  //       label: {
  //         visible: true,
  //         position: 'inside',
  //         style: {
  //           lineHeight: '100%',
  //           fontSize: 16,
  //           fontWeight: 'bold'
  //         },
  //         overlap: {
  //           strategy: []
  //         },
  //         smartInvert: true,
  //         formatConfig: {},
  //         interactive: true
  //       },
  //       totalLabel: {
  //         visible: true,
  //         position: 'top',
  //         overlap: false,
  //         clampForce: false,
  //         formatConfig: {
  //           fixed: 0,
  //           content: 'value'
  //         },
  //         style: {
  //           lineHeight: '100%',
  //           lineWidth: 1,
  //           fill: '#1F2329',
  //           stroke: '#ffffff',
  //           fontSize: 16,
  //           fontWeight: 'bold'
  //         },
  //         interactive: true
  //       },
  //       seriesLabel: {
  //         visible: true,
  //         position: 'end',
  //         label: {
  //           style: {
  //             lineHeight: '100%',
  //             lineWidth: 1,
  //             stroke: '#ffffff',
  //             fontSize: 16,
  //             fontWeight: 'bold'
  //           },
  //           space: 10
  //         }
  //       },
  //       xField: '_editor_dimension_field',
  //       yField: '_editor_value_field',
  //       dataId: '0',
  //       id: 'series-0',
  //       EDITOR_SERIES_DATA_KEY: '销量',
  //       seriesField: '_editor_type_field'
  //     }
  //   ],
  //   legends: {
  //     id: 'legend-discrete',
  //     visible: false,
  //     autoPage: false,
  //     position: 'start',
  //     interactive: false,
  //     item: {
  //       label: {
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         }
  //       }
  //     },
  //     _originalVisible: false
  //   },
  //   region: [
  //     {
  //       id: 'region-0'
  //     }
  //   ],
  //   tooltip: {
  //     visible: true,
  //     mark: {
  //       content: [{}],
  //       title: {}
  //     },
  //     dimension: {
  //       content: [{}],
  //       title: {}
  //     }
  //   },
  //   axes: [
  //     {
  //       orient: 'left',
  //       id: 'axis-left',
  //       type: 'linear',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {}
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4'
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       inverse: true
  //     },
  //     {
  //       orient: 'bottom',
  //       id: 'axis-bottom',
  //       type: 'band',
  //       label: {
  //         autoLimit: false,
  //         style: {
  //           fill: '#1F2329',
  //           fontSize: 16
  //         },
  //         formatConfig: {}
  //       },
  //       domainLine: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         },
  //         onZero: true
  //       },
  //       tick: {
  //         visible: true,
  //         style: {
  //           stroke: '#000000'
  //         }
  //       },
  //       grid: {
  //         visible: false,
  //         style: {
  //           stroke: '#bbbfc4'
  //         }
  //       },
  //       autoIndent: false,
  //       maxWidth: null,
  //       maxHeight: null,
  //       trimPadding: false,
  //       paddingInner: [0.2, 0],
  //       paddingOuter: [0.2, 0]
  //     }
  //   ],
  //   data: [
  //     {
  //       id: '0',
  //       sourceKey: '销量',
  //       values: [
  //         {
  //           _editor_dimension_field: '1 月',
  //           _editor_value_field: 2354,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '2 月',
  //           _editor_value_field: 1902,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '3 月',
  //           _editor_value_field: 3524,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '4 月',
  //           _editor_value_field: 2698,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '5 月',
  //           _editor_value_field: 2896,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '6 月',
  //           _editor_value_field: 2563,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '7 月',
  //           _editor_value_field: 3156,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '8 月',
  //           _editor_value_field: 2896,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '9 月',
  //           _editor_value_field: 3621,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '10 月',
  //           _editor_value_field: 2635,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '11 月',
  //           _editor_value_field: 2963,
  //           _editor_type_field: '销量'
  //         },
  //         {
  //           _editor_dimension_field: '12 月',
  //           _editor_value_field: 2789,
  //           _editor_type_field: '销量'
  //         }
  //       ],
  //       specField: {
  //         _editor_dimension_field: {
  //           type: 'dimension',
  //           order: 0
  //         },
  //         _editor_type_field: {
  //           type: 'series',
  //           order: 0
  //         },
  //         _editor_value_field: {
  //           type: 'value',
  //           order: 0
  //         }
  //       }
  //     }
  //   ],
  //   labelLayout: 'region',
  //   customMark: [
  //     {
  //       type: 'component',
  //       componentType: 'seriesLabel',
  //       interactive: false,
  //       style: {
  //         id: 'a4fdf1eb-5315-48e7-b601-58e095324da6',
  //         position: 'end',
  //         label: {
  //           space: 10,
  //           style: {
  //             lineHeight: '100%',
  //             lineWidth: 1,
  //             stroke: '#ffffff',
  //             fontSize: 16,
  //             fontWeight: 'bold'
  //           }
  //         }
  //       }
  //     }
  //   ],
  //   background: 'transparent'
  // };
  const spec = {
    // direction: 'horizontal',
    type: 'common',
    // padding: [24, 400, 24, 24],
    color: ['#00295C', '#2568BD', '#9F9F9F', '#C5C5C5', '#00B0F0', '#4BCFFF', '#C2C2C2', '#D7D7D7'],
    series: [
      {
        type: 'bar',
        stack: true,
        direction: 'horizontal',
        bar: {
          style: {
            stroke: '',
            lineWidth: 1
          },
          state: {
            hover: {
              stroke: '#000',
              lineWidth: 1
            }
          }
        },
        barBackground: {
          style: {
            stroke: '',
            lineWidth: 1
          }
        },
        label: {
          visible: true,
          position: 'inside',
          style: {
            lineHeight: '100%',
            fontSize: 16,
            fontWeight: 'bold'
          },
          overlap: {
            strategy: []
          },
          smartInvert: true,
          formatConfig: {},
          interactive: true
        },
        totalLabel: {
          visible: true,
          position: 'top',
          overlap: false,
          clampForce: false,
          formatConfig: {
            fixed: 0,
            content: 'value'
          },
          style: {
            lineHeight: '100%',
            lineWidth: 1,
            fill: '#1F2329',
            stroke: '#ffffff',
            fontSize: 16,
            fontWeight: 'bold'
          },
          interactive: true
        },
        seriesLabel: {
          visible: true,
          position: 'start',
          label: {
            style: {
              lineHeight: '100%',
              lineWidth: 1,
              stroke: '#ffffff',
              fontSize: 16,
              fontWeight: 'bold'
            },
            space: 10
          }
        },
        xField: '_editor_value_field',
        yField: '_editor_dimension_field',
        dataId: '0',
        id: 'series-0',
        EDITOR_SERIES_DATA_KEY: '2023年库存数量',
        seriesField: '_editor_type_field'
      }
    ],
    legends: {
      id: 'legend-discrete',
      visible: false,
      autoPage: false,
      position: 'start',
      interactive: false,
      item: {
        label: {
          style: {
            fill: '#1F2329',
            fontSize: 16
          }
        }
      },
      _originalVisible: false
    },
    region: [
      {
        id: 'region-0'
      }
    ],
    tooltip: {
      visible: true,
      mark: {
        content: [{}],
        title: {}
      },
      dimension: {
        content: [{}],
        title: {}
      }
    },
    axes: [
      {
        orient: 'right',
        id: 'axis-left',
        type: 'band',
        trimPadding: false,
        label: {
          autoLimit: false,
          style: {
            fill: '#1F2329',
            fontSize: 16
          },
          formatConfig: {}
        },
        domainLine: {
          visible: true,
          style: {
            stroke: '#000000'
          },
          onZero: true
        },
        tick: {
          visible: true,
          style: {
            stroke: '#000000'
          }
        },
        grid: {
          visible: false,
          style: {
            stroke: '#bbbfc4'
          }
        },
        autoIndent: false,
        maxWidth: null,
        maxHeight: null
      },
      {
        orient: 'bottom',
        id: 'axis-bottom',
        type: 'linear',
        label: {
          autoLimit: false,
          style: {
            fill: '#1F2329',
            fontSize: 16
          },
          formatConfig: {}
        },
        domainLine: {
          visible: true,
          style: {
            stroke: '#000000'
          }
        },
        tick: {
          visible: true,
          style: {
            stroke: '#000000'
          }
        },
        grid: {
          visible: false,
          style: {
            stroke: '#bbbfc4'
          }
        },
        autoIndent: false,
        maxWidth: null,
        maxHeight: null,
        inverse: true
      }
    ],
    data: [
      {
        id: '0',
        sourceKey: '2023年库存数量',
        values: [
          {
            _editor_dimension_field: '0-3',
            _editor_value_field: 210,
            _editor_type_field: '2023年库存数量'
          },
          {
            _editor_dimension_field: '4-6',
            _editor_value_field: 350,
            _editor_type_field: '2023年库存数量'
          },
          {
            _editor_dimension_field: '7-9',
            _editor_value_field: 500,
            _editor_type_field: '2023年库存数量'
          },
          {
            _editor_dimension_field: '10-12',
            _editor_value_field: 850,
            _editor_type_field: '2023年库存数量'
          },
          {
            _editor_dimension_field: '13-15',
            _editor_value_field: 1180,
            _editor_type_field: '2023年库存数量'
          },
          {
            _editor_dimension_field: '16-18',
            _editor_value_field: 1450,
            _editor_type_field: '2023年库存数量'
          },
          {
            _editor_dimension_field: '19-21',
            _editor_value_field: 1190,
            _editor_type_field: '2023年库存数量'
          },
          {
            _editor_dimension_field: '22-24',
            _editor_value_field: 950,
            _editor_type_field: '2023年库存数量'
          },
          {
            _editor_dimension_field: '25-27',
            _editor_value_field: 700,
            _editor_type_field: '2023年库存数量'
          },
          {
            _editor_dimension_field: '28-30',
            _editor_value_field: 400,
            _editor_type_field: '2023年库存数量'
          },
          {
            _editor_dimension_field: '31-33',
            _editor_value_field: 300,
            _editor_type_field: '2023年库存数量'
          }
        ],
        specField: {
          _editor_dimension_field: {
            type: 'dimension',
            order: 0
          },
          _editor_type_field: {
            type: 'series',
            order: 0
          },
          _editor_value_field: {
            type: 'value',
            order: 0
          }
        }
      }
    ],
    labelLayout: 'region',

    background: 'transparent'
  };
  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderSync();
  window['vchart'] = vchart;
};
run();
