import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = async () => {
  const spec = {
    direction: 'vertical',
    type: 'common',
    color: ['#00295C', '#2568BD', '#9F9F9F', '#C5C5C5', '#00B0F0', '#4BCFFF', '#C2C2C2', '#D7D7D7'],
    series: [
      {
        type: 'bar',
        stack: true,
        direction: 'vertical',
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
            fontWeight: 'bold',
            pickMode: 'imprecise'
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
            fontWeight: 'bold',
            pickMode: 'imprecise'
          },
          interactive: true
        },
        seriesLabel: {
          visible: true,
          position: 'end',
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
        xField: '_editor_dimension_field',
        yField: '_editor_value_field',
        dataId: '0',
        id: 'series-0',
        EDITOR_SERIES_DATA_KEY: 'a',
        seriesField: '_editor_type_field'
      },
      {
        type: 'bar',
        stack: true,
        direction: 'vertical',
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
            fontWeight: 'bold',
            pickMode: 'imprecise'
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
            fontWeight: 'bold',
            pickMode: 'imprecise'
          },
          interactive: true
        },
        seriesLabel: {
          visible: true,
          position: 'end',
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
        xField: '_editor_dimension_field',
        yField: '_editor_value_field',
        dataId: '1',
        id: 'series-1',
        EDITOR_SERIES_DATA_KEY: 'b',
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
            fontSize: 16,
            lineWidth: 1
          }
        }
      },
      _originalVisible: false
    },
    region: [
      {
        id: 'region-0',
        stackInverse: true
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
      },
      enterable: true,
      showDelay: 0,
      style: {
        maxContentHeight: '95%'
      }
    },
    axes: [
      {
        orient: 'left',
        id: 'axis-left',
        type: 'linear',
        label: {
          autoLimit: false,
          style: {
            fill: '#1F2329',
            fontSize: 16,
            lineWidth: 1
          },
          formatConfig: {},
          _originStyle: {
            fill: '#1F2329',
            fontSize: 16,
            lineWidth: 1
          }
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
        maxHeight: null
      },
      {
        orient: 'bottom',
        id: 'axis-bottom',
        type: 'band',
        label: {
          autoLimit: false,
          style: {
            fill: '#1F2329',
            fontSize: 16,
            lineWidth: 1
          },
          formatConfig: {},
          _originStyle: {
            fill: '#1F2329',
            fontSize: 16,
            lineWidth: 1
          }
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
        maxHeight: null,
        trimPadding: false,
        paddingInner: [0.2, 0],
        paddingOuter: [0.2, 0]
      }
    ],
    data: [
      {
        id: '0',
        sourceKey: 'a',
        values: [
          {
            _editor_value_field: 20,
            _editor_type_field: 'a',
            _editor_dimension_field: 'x1'
          },
          {
            _editor_value_field: 23,
            _editor_type_field: 'a',
            _editor_dimension_field: 'x2'
          },
          {
            _editor_value_field: 26,
            _editor_type_field: 'a',
            _editor_dimension_field: 'x3'
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
      },
      {
        id: '1',
        sourceKey: 'b',
        values: [
          {
            _editor_value_field: 20,
            _editor_type_field: 'b',
            _editor_dimension_field: 'x1'
          },
          {
            _editor_value_field: 24,
            _editor_type_field: 'b',
            _editor_dimension_field: 'x2'
          },
          {
            _editor_value_field: 29,
            _editor_type_field: 'b',
            _editor_dimension_field: 'x3'
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
    markArea: [
      {
        id: '17bd0d32-3070-4679-bc39-b0ce3426add8',
        name: 'v-area',
        interactive: true,
        x: '0%',
        x1: '50%',
        area: {
          style: {
            fill: '#005DFF',
            fillOpacity: '0.1'
          }
        },
        label: [
          {
            position: 'top',
            text: 'x1 - x2',
            labelBackground: {
              visible: true,
              style: {
                fill: '#fff',
                fillOpacity: 1,
                stroke: '#000',
                lineWidth: 1,
                cornerRadius: 4
              }
            },
            style: {
              fill: '#1F2329',
              fontSize: 16,
              fontWeight: 'bold'
            },
            dy: -6,
            pickable: true,
            childrenPickable: false
          },
          {
            position: 'left',
            text: 'x1 - x2',
            labelBackground: {
              visible: true,
              style: {
                fill: '#fff',
                fillOpacity: 1,
                stroke: '#000',
                lineWidth: 1,
                cornerRadius: 4
              }
            },
            style: {
              fill: '#1F2329',
              fontSize: 16,
              fontWeight: 'bold'
            },
            dx: -6,
            pickable: true,
            childrenPickable: false
          }
        ],
        _originValue_: ['x1', 'x2'],
        _editor_marker_label_: 'x1 - x2',
        zIndex: 500
      }
    ],
    markLine: [],
    markPoint: [],
    labelLayout: 'region',
    customMark: [
      {
        type: 'component',
        componentType: 'seriesLabel',
        interactive: false,
        style: {
          id: '13643b25-e719-4de6-874c-a4587015f1aa',
          position: 'end',
          label: {
            space: 10,
            style: {
              lineHeight: '100%',
              lineWidth: 1,
              stroke: '#ffffff',
              fontSize: 16,
              fontWeight: 'bold'
            }
          }
        }
      }
    ]
  };
  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderSync();
  window['vchart'] = vchart;
};
run();
