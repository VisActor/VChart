import type { IBarChartSpec, ILineChartSpec } from '../../../src';
import { default as VChart } from '../../../src';
import { totalLabel } from '../../../src/theme/builtin/common/component/total-label';
import { series } from '../../../src/theme/builtin/common/series';
import { createDiv, removeDom } from '../../util/dom';

describe('vchart updateSpec test', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';

    const data = [
      { city: '石家庄', type: '水果', value: 14500 },
      { city: '石家庄', type: '米面', value: 8500 },
      { city: '石家庄', type: '特产零食', value: 10000 },
      { city: '石家庄', type: '茶叶', value: 7000 },
      { city: '深圳', type: '水果', value: 9000 },
      { city: '深圳', type: '米面', value: 8500 },
      { city: '深圳', type: '特产零食', value: 11000 },
      { city: '深圳', type: '茶叶', value: 6000 },
      { city: '温州', type: '水果', value: 16000 },
      { city: '温州', type: '米面', value: 5000 },
      { city: '温州', type: '特产零食', value: 6000 },
      { city: '温州', type: '茶叶', value: 10000 },
      { city: '宁波', type: '水果', value: 14000 },
      { city: '宁波', type: '米面', value: 9000 },
      { city: '宁波', type: '特产零食', value: 10000 },
      { city: '宁波', type: '茶叶', value: 9000 },
      { city: '无锡', type: '水果', value: 14000 },
      { city: '无锡', type: '米面', value: 9000 },
      { city: '无锡', type: '特产零食', value: 10000 },
      { city: '无锡', type: '茶叶', value: 6000 },
      { city: '杭州', type: '水果', value: 9000 },
      { city: '杭州', type: '米面', value: 8500 },
      { city: '杭州', type: '特产零食', value: 10000 },
      { city: '杭州', type: '茶叶', value: 6000 },
      { city: '北京', type: '水果', value: 17000 },
      { city: '北京', type: '米面', value: 6000 },
      { city: '北京', type: '特产零食', value: 7000 },
      { city: '北京', type: '茶叶', value: 10000 },
      { city: '上海', type: '水果', value: 18000 },
      { city: '上海', type: '米面', value: 11000 },
      { city: '上海', type: '特产零食', value: 15000 },
      { city: '上海', type: '茶叶', value: 14000 }
    ];
    const spec = {
      type: 'bar',
      data: [
        {
          id: 'bar',
          values: data
        }
      ],
      xField: ['city'],
      yField: 'value',
      seriesField: 'type',
      markLine: []
    } as any;
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should create markLine component', () => {
    const data = [
      { city: '石家庄', type: '水果', value: 14500 },
      { city: '石家庄', type: '米面', value: 8500 },
      { city: '石家庄', type: '特产零食', value: 10000 },
      { city: '石家庄', type: '茶叶', value: 7000 },
      { city: '深圳', type: '水果', value: 9000 },
      { city: '深圳', type: '米面', value: 8500 },
      { city: '深圳', type: '特产零食', value: 11000 },
      { city: '深圳', type: '茶叶', value: 6000 },
      { city: '温州', type: '水果', value: 16000 },
      { city: '温州', type: '米面', value: 5000 },
      { city: '温州', type: '特产零食', value: 6000 },
      { city: '温州', type: '茶叶', value: 10000 },
      { city: '宁波', type: '水果', value: 14000 },
      { city: '宁波', type: '米面', value: 9000 },
      { city: '宁波', type: '特产零食', value: 10000 },
      { city: '宁波', type: '茶叶', value: 9000 },
      { city: '无锡', type: '水果', value: 14000 },
      { city: '无锡', type: '米面', value: 9000 },
      { city: '无锡', type: '特产零食', value: 10000 },
      { city: '无锡', type: '茶叶', value: 6000 },
      { city: '杭州', type: '水果', value: 9000 },
      { city: '杭州', type: '米面', value: 8500 },
      { city: '杭州', type: '特产零食', value: 10000 },
      { city: '杭州', type: '茶叶', value: 6000 },
      { city: '北京', type: '水果', value: 17000 },
      { city: '北京', type: '米面', value: 6000 },
      { city: '北京', type: '特产零食', value: 7000 },
      { city: '北京', type: '茶叶', value: 10000 },
      { city: '上海', type: '水果', value: 18000 },
      { city: '上海', type: '米面', value: 11000 },
      { city: '上海', type: '特产零食', value: 15000 },
      { city: '上海', type: '茶叶', value: 14000 }
    ];
    const spec2 = {
      type: 'bar',
      data: [
        {
          id: 'bar',
          values: data
        }
      ],
      xField: ['city'],
      yField: 'value',
      seriesField: 'type',
      markLine: [
        {
          y: 50000
        }
      ]
    };
    vchart.updateSpecSync(spec2);
    const components = vchart.getChart()?.getComponentsByKey('markLine');
    expect(components?.length).toBe(1);
  });
});

describe('vchart updateSpec of same spec', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should not remake', () => {
    const spec = {
      type: 'bar',
      xField: ['eQkZvr2IzEDQ', '10001'],
      yField: ['10002'],
      direction: 'vertical',
      sortDataByAxis: true,
      seriesField: '30001',
      padding: {
        left: 6,
        right: 6,
        top: 6,
        bottom: 6
      },
      labelLayout: 'region',
      data: [
        {
          id: 'data',
          values: [
            {
              '10001': 'Profit',
              '10002': 20,
              '10003': 'HfH9clsXediN',
              '30001': '2023',
              eQkZvr2IzEDQ: 'Labels',
              HfH9clsXediN: 20,
              f9E7ulsVjzEg: '2023',
              dataKey: 0.12146121346369476
            },
            {
              '10001': 'Profit',
              '10002': 44,
              '10003': 'HfH9clsXediN',
              '30001': '2022',
              eQkZvr2IzEDQ: 'Labels',
              HfH9clsXediN: 44,
              f9E7ulsVjzEg: '2022',
              dataKey: 0.11935298916579362
            },
            {
              '10001': 'Profit',
              '10002': 15,
              '10003': 'HfH9clsXediN',
              '30001': '2023',
              eQkZvr2IzEDQ: 'Tables',
              HfH9clsXediN: 15,
              f9E7ulsVjzEg: '2023',
              dataKey: 0.6014295333929318
            },
            {
              '10001': 'Profit',
              '10002': 20,
              '10003': 'HfH9clsXediN',
              '30001': '2022',
              eQkZvr2IzEDQ: 'Tables',
              HfH9clsXediN: 20,
              f9E7ulsVjzEg: '2022',
              dataKey: 0.3618528674569743
            },
            {
              '10001': 'Profit',
              '10002': 50,
              '10003': 'HfH9clsXediN',
              '30001': '2023',
              eQkZvr2IzEDQ: 'Storage',
              HfH9clsXediN: 50,
              f9E7ulsVjzEg: '2023',
              dataKey: 0.3026198782849232
            },
            {
              '10001': 'Profit',
              '10002': 65,
              '10003': 'HfH9clsXediN',
              '30001': '2022',
              eQkZvr2IzEDQ: 'Storage',
              HfH9clsXediN: 65,
              f9E7ulsVjzEg: '2022',
              dataKey: 0.5628085740866975
            },
            {
              '10001': 'Profit',
              '10002': 15,
              '10003': 'HfH9clsXediN',
              '30001': '2023',
              eQkZvr2IzEDQ: 'Furn',
              HfH9clsXediN: 15,
              f9E7ulsVjzEg: '2023',
              dataKey: 0.058865883616797454
            },
            {
              '10001': 'Profit',
              '10002': 40,
              '10003': 'HfH9clsXediN',
              '30001': '2022',
              eQkZvr2IzEDQ: 'Furn',
              HfH9clsXediN: 40,
              f9E7ulsVjzEg: '2022',
              dataKey: 0.6552124287584555
            },
            {
              '10001': 'Profit',
              '10002': 57,
              '10003': 'HfH9clsXediN',
              '30001': '2023',
              eQkZvr2IzEDQ: 'Art',
              HfH9clsXediN: 57,
              f9E7ulsVjzEg: '2023',
              dataKey: 0.09013304102601305
            },
            {
              '10001': 'Profit',
              '10002': 35,
              '10003': 'HfH9clsXediN',
              '30001': '2022',
              eQkZvr2IzEDQ: 'Art',
              HfH9clsXediN: 35,
              f9E7ulsVjzEg: '2022',
              dataKey: 0.10762711388063928
            }
          ],
          fields: {
            '10001': {
              alias: '指标名称'
            },
            '10002': {
              alias: '指标值'
            },
            '30001': {
              alias: '图例项',
              domain: ['2023', '2022'],
              sortIndex: 0,
              lockStatisticsByDomain: true
            },
            eQkZvr2IzEDQ: {
              alias: 'Product',
              domain: ['Labels', 'Labels', 'Tables', 'Tables', 'Storage', 'Storage', 'Furn', 'Furn', 'Art', 'Art'],
              sortIndex: 0,
              lockStatisticsByDomain: true
            },
            f9E7ulsVjzEg: {
              alias: 'Year'
            },
            HfH9clsXediN: {
              alias: 'Profit'
            }
          }
        }
      ],
      stackInverse: true,
      percent: true,
      axes: [
        {
          type: 'band',
          tick: {
            style: {
              strokeOpacity: 0.2
            },
            visible: false
          },
          grid: {
            visible: false,
            style: {
              zIndex: 150,
              stroke: '#FFFFFF',
              lineWidth: 1,
              lineDash: []
            }
          },
          orient: 'bottom',
          visible: true,
          domainLine: {
            visible: false,
            style: {
              lineWidth: 1,
              stroke: '#d5d7e2'
            }
          },
          title: {
            visible: false,
            space: 5,
            text: '',
            style: {
              fontSize: 12,
              fill: 'rgba(255,255,255,0.5)',
              fontFamily: 'D-DIN',
              fontWeight: 'normal'
            }
          },
          maxHeight: null,
          autoIndent: false,
          sampling: false,
          zIndex: 200,
          label: {
            visible: true,
            space: 4,
            style: {
              fontSize: 12,
              fill: 'rgba(255,255,255,0.65)',
              angle: 0,
              fontFamily: 'D-DIN',
              fontWeight: 'normal',
              direction: 'horizontal',
              maxLineWidth: 174
            },
            autoHide: true,
            autoHideMethod: 'greedy',
            flush: true,
            lastVisible: true,
            autoHideSeparation: 4
          },
          hover: true,
          background: {
            visible: true,
            state: {
              hover: {
                fillOpacity: 0.08,
                fill: '#141414'
              },
              hover_reverse: {
                fillOpacity: 0.08,
                fill: '#141414'
              }
            }
          },
          paddingInner: 0.15,
          paddingOuter: 0.15,
          ticks: true
        },
        {
          type: 'linear',
          tick: {
            size: 4,
            visible: true,
            tickMode: 'd3'
          },
          niceType: 'rough',
          zIndex: 200,
          grid: {
            visible: true
          },
          orient: 'left',
          visible: true,
          domainLine: {
            visible: false,
            style: {
              lineWidth: 1,
              stroke: '#d5d7e2'
            }
          },
          title: {
            visible: false,
            text: '',
            space: 8,
            style: {
              fontSize: 12,
              fill: 'rgba(255,255,255,0.5)',
              fontFamily: 'D-DIN',
              fontWeight: 'normal'
            }
          },
          autoIndent: false,
          sampling: false,
          label: {
            visible: true,
            space: 6,
            flush: true,
            padding: 0,
            style: {
              fontSize: 12,
              maxLineWidth: 174,
              fill: 'rgba(255,255,255,0.65)',
              angle: 0,
              fontFamily: 'D-DIN',
              fontWeight: 'normal',
              dy: -1,
              direction: 'horizontal'
            },
            autoHide: true,
            autoHideMethod: 'greedy',
            autoHideSeparation: 4,
            rotateAngle: [null],
            labelOverlap: 'custom',
            tighten: false
          },
          background: {
            visible: true,
            state: {
              hover: {
                fillOpacity: 0.08,
                fill: '#141414'
              },
              hover_reverse: {
                fillOpacity: 0.08,
                fill: '#141414'
              }
            }
          },
          innerOffset: {
            top: 0
          },
          zero: true,
          nice: true,
          paddingInner: 0.15,
          paddingOuter: 0.15,
          maxWidth: 180,
          ticks: true
        },
        {
          type: 'linear',
          tick: {
            size: 4,
            visible: true,
            tickMode: 'd3'
          },
          niceType: 'rough',
          zIndex: 200,
          grid: {
            visible: false
          },
          orient: 'right',
          visible: true,
          domainLine: {
            visible: false
          },
          title: {
            visible: false
          },
          autoIndent: false,
          sampling: false,
          label: {
            visible: true,
            space: 6,
            flush: true,
            padding: 0,
            style: {
              visible: false,
              fontSize: 12,
              maxLineWidth: 174,
              fill: 'rgba(255,255,255,0.65)',
              angle: 0,
              fontFamily: 'D-DIN',
              fontWeight: 'normal',
              dy: -1,
              direction: 'horizontal'
            },
            autoHide: true,
            autoHideMethod: 'greedy',
            autoHideSeparation: 4,
            rotateAngle: [null],
            labelOverlap: 'custom',
            tighten: false
          },
          background: {
            visible: true,
            state: {
              hover: {
                fillOpacity: 0.08,
                fill: '#141414'
              },
              hover_reverse: {
                fillOpacity: 0.08,
                fill: '#141414'
              }
            }
          },
          innerOffset: {
            top: 0
          },
          zero: true,
          nice: true,
          paddingInner: 0.15,
          paddingOuter: 0.15,
          maxWidth: 180,
          ticks: true
        }
      ],
      color: {
        field: '30001',
        type: 'ordinal',
        range: ['rgb(0,110,255)', 'rgb(0,229,229)'],
        specified: {}
      },
      colorGradient: {
        type: 'linear',
        x0: {
          field: '30001',
          type: 'ordinal',
          range: [0, 0]
        },
        y0: {
          field: '30001',
          type: 'ordinal',
          range: [1, 1]
        },
        x1: {
          field: '30001',
          type: 'ordinal',
          range: [0.00001, 0.00001]
        },
        y1: {
          field: '30001',
          type: 'ordinal',
          range: [0, 0]
        },
        stops: [
          {
            offset: 0,
            color: {
              field: '30001',
              type: 'ordinal',
              range: ['rgba(0,110,255,0.2)', 'rgba(0,229,229,0.2)']
            }
          },
          {
            offset: 1,
            color: {
              field: '30001',
              type: 'ordinal',
              range: ['rgb(0,110,255)', 'rgb(0,229,229)']
            }
          }
        ]
      },
      legends: [
        {
          type: 'discrete',
          visible: true,
          id: 'legend-discrete',
          orient: 'top',
          position: 'end',
          layoutType: 'normal',
          maxRow: 1,
          title: {
            textStyle: {
              fontSize: 12,
              fill: 'rgba(255,255,255,0.45)'
            }
          },
          layoutLevel: 70,
          item: {
            focus: true,
            focusIconStyle: {
              size: 14
            },
            maxWidth: 400,
            spaceRow: 0,
            spaceCol: 0,
            padding: {
              left: 10,
              right: -10,
              top: 0,
              bottom: 5
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
                fill: 'rgba(255,255,255,0.45)',
                fontFamily: 'D-DIN',
                fontWeight: 'normal'
              },
              state: {
                unSelected: {
                  fillOpacity: 0.2
                }
              }
            },
            shape: {
              style: {
                lineWidth: 0,
                symbolType: 'square',
                size: 12,
                fillOpacity: 1,
                width: 12,
                height: 7.416
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
          alignSelf: 'end',
          padding: {
            left: 10,
            right: 0,
            top: 0,
            bottom: 12
          }
        }
      ],
      label: {
        visible: false,
        offset: 3,
        overlap: {
          hideOnHit: true,
          avoidBaseMark: false,
          strategy: [
            {
              type: 'position',
              position: []
            }
          ],
          clampForce: true
        },
        style: {
          fontSize: 10,
          fontFamily: 'D-DIN',
          fontWeight: 'normal',
          zIndex: 400,
          lineHeight: '100%',
          fill: 'rgba(255,255,255,1)',
          strokeOpacity: 0
        },
        position: 'outside',
        smartInvert: false,
        fontWeight: 'normal'
      },
      tooltip: {
        visible: true,
        renderMode: 'canvas',
        mark: {
          visible: true
        },
        style: {
          panel: {
            padding: {
              top: 5,
              bottom: 10,
              left: 10,
              right: 10
            },
            backgroundColor: 'rgba(8, 28, 48, 0.95)',
            border: {
              color: '#CFCFCF',
              width: 0,
              radius: 2
            },
            shadow: {
              x: 0,
              y: 4,
              blur: 12,
              spread: 0,
              color: 'rgba(0, 0, 0, 0.2)'
            }
          },
          titleLabel: {
            fontSize: 14,
            fontColor: '#FFF',
            fontWeight: 'bold',
            fontFamily: 'D-DIN',
            align: 'left',
            lineHeight: 18
          },
          keyLabel: {
            fontSize: 12,
            fontColor: 'rgba(255,255,255,0.65)',
            fontWeight: 'normal',
            fontFamily: 'SourceHanSansCN-Normal',
            align: 'left',
            lineHeight: 18
          },
          valueLabel: {
            fontSize: 12,
            fontColor: '#FFF',
            fontWeight: 'normal',
            fontFamily: 'D-DIN',
            align: 'right',
            lineHeight: 18
          },
          shape: {
            size: 10,
            spacing: 10
          },
          spaceRow: 10
        },
        dimension: {
          visible: true
        }
      },
      hover: {
        enable: true
      },
      select: {
        enable: true
      },
      bar: {
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
            lineWidth: 0.3
          }
        },
        style: {
          cornerRadius: 0,
          fill: {
            gradient: 'linear',
            x0: 0,
            y0: 1,
            stops: [
              {
                offset: 0
              },
              {
                offset: 1
              }
            ]
          },
          lineWidth: 2,
          stroke: {
            gradient: 'linear',
            x0: 0,
            y0: 1,
            stops: [
              {
                offset: 0
              },
              {
                offset: 1
              }
            ]
          }
        }
      },
      region: [
        {
          clip: true
        }
      ],
      background: 'rgba(0, 0, 0, 1)',
      animation: true,
      crosshair: {
        xField: {
          visible: true,
          line: {
            type: 'rect',
            style: {
              fillOpacity: 1,
              fill: 'rgba(80,156,255,0.1)'
            }
          }
        },
        gridZIndex: 100,
        yField: {
          line: {
            style: {
              fillOpacity: 1,
              fill: 'rgba(80,156,255,0.1)'
            }
          },
          visible: false
        }
      },
      morph: {
        enable: false
      },
      axesPadding: true,
      plotLayout: {
        clip: false
      },
      scales: [
        {
          id: 'gradientFillStop0',
          type: 'ordinal',
          range: [
            'rgba(0,110,255,0.2)',
            'rgba(0,229,229,0.2)',
            'rgba(46,85,234,0.2)',
            'rgba(184,231,254,0.2)',
            'rgba(0,214,137,0.2)',
            'rgba(183,249,245,0.2)',
            'rgba(251,204,113,0.2)',
            'rgba(244,110,80,0.2)'
          ],
          domain: [
            {
              dataId: 'data',
              fields: ['30001']
            }
          ]
        },
        {
          id: 'gradientFillStop1',
          type: 'ordinal',
          range: [
            'rgb(0,110,255)',
            'rgb(0,229,229)',
            'rgb(46,85,234)',
            'rgb(184,231,254)',
            'rgb(0,214,137)',
            'rgb(183,249,245)',
            'rgb(251,204,113)',
            'rgb(244,110,80)'
          ],
          domain: [
            {
              dataId: 'data',
              fields: ['30001']
            }
          ]
        },
        {
          id: 'gradientStrokeStop0',
          type: 'ordinal',
          range: [
            'rgba(51, 139, 255, 0.2)',
            'rgba(25, 255, 255, 0.2)',
            'rgba(92, 123, 239, 0.2)',
            'rgba(234, 248, 255, 0.2)',
            'rgba(10, 255, 167, 0.2)',
            'rgba(230, 253, 252, 0.2)',
            'rgba(252, 222, 163, 0.2)',
            'rgba(247, 150, 128, 0.2)'
          ],
          domain: [
            {
              dataId: 'data',
              fields: ['30001']
            }
          ]
        },
        {
          id: 'gradientStrokeStop1',
          type: 'ordinal',
          range: [
            'rgba(51, 139, 255, 1)',
            'rgba(25, 255, 255, 1)',
            'rgba(92, 123, 239, 1)',
            'rgba(234, 248, 255, 1)',
            'rgba(10, 255, 167, 1)',
            'rgba(230, 253, 252, 1)',
            'rgba(252, 222, 163, 1)',
            'rgba(247, 150, 128, 1)'
          ],
          domain: [
            {
              dataId: 'data',
              fields: ['30001']
            }
          ]
        },
        {
          id: 'gradientX1',
          type: 'ordinal',
          range: [0.00001, 0.00001, 0.00001, 0.00001, 0.00001, 0.00001, 0.00001, 0.00001],
          domain: [
            {
              dataId: 'data',
              fields: ['30001']
            }
          ]
        },
        {
          id: 'gradientY1',
          type: 'ordinal',
          range: [0, 0, 0, 0, 0, 0, 0, 0],
          domain: [
            {
              dataId: 'data',
              fields: ['30001']
            }
          ]
        }
      ],
      barWidth: '50%',
      barBackground: {
        fieldLevel: 1,
        visible: false,
        interactive: false,
        style: {
          cornerRadius: 0,
          fill: 'rgba(255,255,255,1)',
          fillOpacity: 0.25
        }
      },
      animationAppear: {
        bar: {
          type: 'growHeightIn',
          oneByOne: false,
          duration: 1000,
          delayAfter: 4000,
          loop: true
        }
      },
      animationEnter: {
        bar: {
          type: 'growHeightIn',
          oneByOne: false,
          duration: 1000,
          delayAfter: 4000,
          loop: false
        }
      },
      animationUpdate: {
        bar: {
          type: 'growHeightIn',
          oneByOne: false,
          duration: 1000,
          delayAfter: 4000,
          loop: false,
          options: {
            overall: true,
            orient: 'negative'
          }
        }
      },
      hash: '3136c561bad4328a39917f23d8606675'
    } as unknown as IBarChartSpec;
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(spec, false);

    expect(updateRes).toEqual({
      changeBackground: false,
      change: false,
      reCompile: false,
      reMake: false,
      reRender: true,
      reSize: false,
      reTransformSpec: false,
      changeTheme: false
    });
  });

  it('should not remake when label is in series', () => {
    const spec = {
      type: 'bar',
      data: [
        {
          id: 'barData',
          values: [
            {
              name: 'Apple',
              value: 214480
            },
            {
              name: 'Google',
              value: 155506
            }
          ]
        }
      ],
      direction: 'horizontal',
      series: [
        {
          type: 'bar',
          xField: 'value',
          yField: 'name',
          label: {
            visible: true
          }
        }
      ],
      axes: [
        {
          orient: 'bottom',
          visible: false
        }
      ]
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(spec, false);

    expect(updateRes).toEqual({
      changeBackground: false,
      change: false,
      changeTheme: false,
      reCompile: false,
      reMake: false,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });

  it('should not remake when label is in chart', () => {
    const spec = {
      data: [
        {
          id: 'barData',
          values: [
            {
              name: 'Apple',
              value: 214480
            },
            {
              name: 'Google',
              value: 155506
            }
          ]
        }
      ],
      direction: 'horizontal',
      type: 'bar',
      xField: 'value',
      yField: 'name',
      label: {
        visible: true
      },
      axes: [
        {
          orient: 'bottom',
          visible: false
        }
      ]
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(spec, false);

    expect(updateRes).toEqual({
      changeBackground: false,
      change: false,
      changeTheme: false,
      reCompile: false,
      reMake: false,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });

  it('should not throw error when data is empty in series', () => {
    const spec: any = {
      type: 'common',
      seriesField: 'color',
      data: [
        {
          id: 'id0',
          values: [
            { x: '周一', type: '早餐', y: 15 },
            { x: '周一', type: '午餐', y: 25 },
            { x: '周二', type: '早餐', y: 12 },
            { x: '周二', type: '午餐', y: 30 },
            { x: '周三', type: '早餐', y: 15 },
            { x: '周三', type: '午餐', y: 24 },
            { x: '周四', type: '早餐', y: 10 },
            { x: '周四', type: '午餐', y: 25 },
            { x: '周五', type: '早餐', y: 13 },
            { x: '周五', type: '午餐', y: 20 },
            { x: '周六', type: '早餐', y: 10 },
            { x: '周六', type: '午餐', y: 22 },
            { x: '周日', type: '早餐', y: 12 },
            { x: '周日', type: '午餐', y: 19 }
          ]
        },
        {
          id: 'id1',
          values: [
            { x: '周一', type: '饮料', y: 22 },
            { x: '周二', type: '饮料', y: 43 },
            { x: '周三', type: '饮料', y: 33 },
            { x: '周四', type: '饮料', y: 22 },
            { x: '周五', type: '饮料', y: 10 },
            { x: '周六', type: '饮料', y: 30 },
            { x: '周日', type: '饮料', y: 50 }
          ]
        }
      ],
      series: [
        {
          type: 'bar',
          id: 'bar',
          data: {
            id: 'id0'
          },
          label: { visible: true },
          seriesField: 'type',

          xField: ['x', 'type'],
          yField: 'y'
        },
        {
          type: 'line',
          id: 'line',
          data: {
            id: 'id1'
          },
          label: { visible: true },
          seriesField: 'type',
          xField: 'x',
          yField: 'y',
          stack: false
        }
      ],
      axes: [
        { orient: 'left', seriesIndex: [0] },
        { orient: 'right', seriesId: ['line'], grid: { visible: false } },
        { orient: 'bottom', label: { visible: true }, type: 'band' }
      ],
      legends: {
        visible: true,
        orient: 'bottom'
      }
    };

    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(spec, false);

    expect(updateRes).toEqual({
      changeBackground: false,
      change: false,
      changeTheme: false,
      reCompile: false,
      reMake: false,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });
});

describe('vchart updateSpec of different about label', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should reCompile when label config is in series update', () => {
    const spec = {
      type: 'bar',
      data: [
        {
          id: 'barData',
          values: [
            {
              name: 'Apple',
              value: 214480
            },
            {
              name: 'Google',
              value: 155506
            }
          ]
        }
      ],
      direction: 'horizontal',
      series: [
        {
          type: 'bar',
          xField: 'value',
          yField: 'name',
          label: {
            visible: true
          }
        }
      ],
      axes: [
        {
          orient: 'bottom',
          visible: false
        }
      ]
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        series: [
          {
            type: 'bar',
            xField: 'value',
            yField: 'name',
            label: {
              visible: true,
              position: 'center'
            }
          }
        ]
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: false,
      changeTheme: false,
      reCompile: true,
      reMake: false,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });

  it('should reCompile when visible of label is in chart update', () => {
    const spec = {
      data: [
        {
          id: 'barData',
          values: [
            {
              name: 'Apple',
              value: 214480
            },
            {
              name: 'Google',
              value: 155506
            }
          ]
        }
      ],
      direction: 'horizontal',
      type: 'bar',
      xField: 'value',
      yField: 'name',
      label: {
        visible: true
      },
      axes: [
        {
          orient: 'bottom',
          visible: false
        }
      ]
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        label: {
          visible: true,
          position: 'top'
        }
      },
      false
    );

    expect(updateRes).toEqual({
      change: false,
      changeBackground: false,
      changeTheme: false,
      reCompile: true,
      reMake: false,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });

  it('should remake when visible of axis grid change', () => {
    const spec = {
      type: 'area',
      data: [
        {
          id: 'area',
          values: [
            { x: '1990', y: 110, from: 'video ad' },
            { x: '1995', y: 160, from: 'video ad' },
            { x: '2000', y: 230, from: 'video ad' },
            { x: '2005', y: 300, from: 'video ad' },
            { x: '2010', y: 448, from: 'video ad' },
            { x: '2015', y: 500, from: 'video ad' },
            { x: '1990', y: 120, from: 'email marketing' },
            { x: '1995', y: 150, from: 'email marketing' },
            { x: '2000', y: 200, from: 'email marketing' },
            { x: '2005', y: 210, from: 'email marketing' },
            { x: '2010', y: 300, from: 'email marketing' },
            { x: '2015', y: 320, from: 'email marketing' }
          ]
        }
      ],
      label: {
        visible: true
      },
      xField: 'x',
      yField: 'y',
      seriesField: 'from',
      axes: [
        {
          orient: 'bottom',
          type: 'band' as const
        },
        {
          orient: 'left',
          type: 'linear' as const,
          grid: {
            visible: true
          }
        }
      ]
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        axes: [
          {
            orient: 'bottom',
            type: 'band' as const
          },
          {
            orient: 'left',
            type: 'linear' as const,
            grid: {
              visible: false
            }
          }
        ]
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: false,
      changeTheme: false,
      reCompile: false,
      reMake: true,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });

  it('should reRender when `alternateColor` of axis grid change', () => {
    const spec = {
      type: 'area',
      data: [
        {
          id: 'area',
          values: [
            { x: '1990', y: 110, from: 'video ad' },
            { x: '1995', y: 160, from: 'video ad' },
            { x: '2000', y: 230, from: 'video ad' },
            { x: '2005', y: 300, from: 'video ad' },
            { x: '2010', y: 448, from: 'video ad' },
            { x: '2015', y: 500, from: 'video ad' },
            { x: '1990', y: 120, from: 'email marketing' },
            { x: '1995', y: 150, from: 'email marketing' },
            { x: '2000', y: 200, from: 'email marketing' },
            { x: '2005', y: 210, from: 'email marketing' },
            { x: '2010', y: 300, from: 'email marketing' },
            { x: '2015', y: 320, from: 'email marketing' }
          ]
        }
      ],
      label: {
        visible: true
      },
      xField: 'x',
      yField: 'y',
      seriesField: 'from',
      axes: [
        {
          orient: 'bottom',
          type: 'band' as const
        },
        {
          orient: 'left',
          type: 'linear' as const,
          grid: {
            visible: true
          }
        }
      ]
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        axes: [
          {
            orient: 'bottom',
            type: 'band' as const
          },
          {
            orient: 'left',
            type: 'linear' as const,
            grid: {
              visible: true,
              alternateColor: ['pink', 'green']
            }
          }
        ]
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: false,
      changeTheme: false,
      reCompile: false,
      reMake: false,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });

  it('should reMake when `visible` of label change from `false` to `true`', () => {
    const spec = {
      type: 'area',
      data: {
        values: [
          {
            time: '2:00',
            value: 8
          },
          {
            time: '4:00',
            value: 9
          },
          {
            time: '6:00',
            value: 11
          },
          {
            time: '8:00',
            value: 14
          },
          {
            time: '10:00',
            value: 16
          },
          {
            time: '12:00',
            value: 17
          },
          {
            time: '14:00',
            value: 17
          },
          {
            time: '16:00',
            value: 16
          },
          {
            time: '18:00',
            value: 15
          }
        ]
      },
      xField: 'time',
      yField: 'value',
      label: {
        visible: false
      }
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        label: {
          visible: true
        }
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: false,
      changeTheme: false,
      reCompile: false,
      reMake: true,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });

  it('should reMake when `visible` of label change from `false` to `true`', () => {
    const spec = {
      type: 'area',
      data: {
        values: [
          {
            time: '2:00',
            value: 8
          },
          {
            time: '4:00',
            value: 9
          },
          {
            time: '6:00',
            value: 11
          },
          {
            time: '8:00',
            value: 14
          },
          {
            time: '10:00',
            value: 16
          },
          {
            time: '12:00',
            value: 17
          },
          {
            time: '14:00',
            value: 17
          },
          {
            time: '16:00',
            value: 16
          },
          {
            time: '18:00',
            value: 15
          }
        ]
      },
      xField: 'time',
      yField: 'value',
      label: {
        visible: true
      }
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        label: {
          visible: false
        }
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: false,
      changeTheme: false,
      reCompile: false,
      reMake: true,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });
});

describe('vchart updateSpec should not throw error', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should remake when length of `axes` change', () => {
    const spec: IBarChartSpec = {
      type: 'bar',
      data: [
        {
          id: 'barData',
          values: [
            {
              name: 'Apple',
              value: 214480
            },
            {
              name: 'Google',
              value: 155506
            }
          ]
        }
      ],
      direction: 'horizontal',
      series: [
        {
          type: 'bar',
          xField: 'value',
          yField: 'name',
          label: {
            visible: true
          }
        }
      ],
      axes: [
        {
          orient: 'bottom',
          visible: true
        }
      ],
      markLine: [
        {
          y: 50,
          startSymbol: {
            visible: true,
            style: {
              symbolType: 'circle',
              size: 8
            }
          },
          label: {
            formatMethod: (...p: any[]) => {
              return p[0][0].y;
            },
            position: 'insideEndBottom',
            refY: -5,
            labelBackground: {
              visible: false
            }
          }
        }
      ]
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        markLine: null
      },
      false
    );

    expect(updateRes).toEqual({
      change: false,
      changeBackground: false,
      changeTheme: false,
      reCompile: false,
      reMake: true,
      reRender: undefined,
      reSize: false,
      reTransformSpec: false
    });
  });
});

describe('vchart updateSpec of totalLabel', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should reCompile', () => {
    const spec: ILineChartSpec = {
      type: 'line',
      data: {
        values: [
          { type: 'Nail polish', country: 'Africa', value: 4229 },
          { type: 'Nail polish', country: 'EU', value: 4376 },
          { type: 'Nail polish', country: 'China', value: 3054 },
          { type: 'Nail polish', country: 'USA', value: 12814 },
          { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
          { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
          { type: 'Eyebrow pencil', country: 'China', value: 5067 },
          { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
          { type: 'Rouge', country: 'Africa', value: 5221 },
          { type: 'Rouge', country: 'EU', value: 3574 },
          { type: 'Rouge', country: 'China', value: 7004 },
          { type: 'Rouge', country: 'USA', value: 11624 },
          { type: 'Lipstick', country: 'Africa', value: 9256 },
          { type: 'Lipstick', country: 'EU', value: 4376 },
          { type: 'Lipstick', country: 'China', value: 9054 },
          { type: 'Lipstick', country: 'USA', value: 8814 },
          { type: 'Eyeshadows', country: 'Africa', value: 3308 },
          { type: 'Eyeshadows', country: 'EU', value: 4572 },
          { type: 'Eyeshadows', country: 'China', value: 12043 },
          { type: 'Eyeshadows', country: 'USA', value: 12998 },
          { type: 'Eyeliner', country: 'Africa', value: 5432 },
          { type: 'Eyeliner', country: 'EU', value: 3417 },
          { type: 'Eyeliner', country: 'China', value: 15067 },
          { type: 'Eyeliner', country: 'USA', value: 12321 },
          { type: 'Foundation', country: 'Africa', value: 13701 },
          { type: 'Foundation', country: 'EU', value: 5231 },
          { type: 'Foundation', country: 'China', value: 10119 },
          { type: 'Foundation', country: 'USA', value: 10342 },
          { type: 'Lip gloss', country: 'Africa', value: 4008 },
          { type: 'Lip gloss', country: 'EU', value: 4572 },
          { type: 'Lip gloss', country: 'China', value: 12043 },
          { type: 'Lip gloss', country: 'USA', value: 22998 },
          { type: 'Mascara', country: 'Africa', value: 18712 },
          { type: 'Mascara', country: 'EU', value: 6134 },
          { type: 'Mascara', country: 'China', value: 10419 },
          { type: 'Mascara', country: 'USA', value: 11261 }
        ]
      },
      title: {
        visible: true,
        text: '100% stacked line chart of cosmetic products sales'
      },
      stack: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'country',
      legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
      axes: [
        {
          orient: 'left',
          label: {
            formatMethod: (val: string | string[]) => {
              return `${(+val * 100).toFixed(2)}%`;
            }
          }
        }
      ],
      totalLabel: {
        visible: true
      },
      point: {
        visible: false
      },
      label: {
        visible: true
      }
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        totalLabel: {
          ...spec.totalLabel,
          style: {
            fill: 'red'
          }
        }
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: true,
      changeTheme: false,
      reCompile: true,
      reMake: false,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });
});

describe('vchart updateSpec of width, height', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should reCompile', () => {
    const spec: ILineChartSpec = {
      type: 'line',
      data: {
        values: [
          { type: 'Nail polish', country: 'Africa', value: 4229 },
          { type: 'Nail polish', country: 'EU', value: 4376 },
          { type: 'Nail polish', country: 'China', value: 3054 },
          { type: 'Nail polish', country: 'USA', value: 12814 },
          { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
          { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
          { type: 'Eyebrow pencil', country: 'China', value: 5067 },
          { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
          { type: 'Rouge', country: 'Africa', value: 5221 },
          { type: 'Rouge', country: 'EU', value: 3574 },
          { type: 'Rouge', country: 'China', value: 7004 },
          { type: 'Rouge', country: 'USA', value: 11624 },
          { type: 'Lipstick', country: 'Africa', value: 9256 },
          { type: 'Lipstick', country: 'EU', value: 4376 },
          { type: 'Lipstick', country: 'China', value: 9054 },
          { type: 'Lipstick', country: 'USA', value: 8814 },
          { type: 'Eyeshadows', country: 'Africa', value: 3308 },
          { type: 'Eyeshadows', country: 'EU', value: 4572 },
          { type: 'Eyeshadows', country: 'China', value: 12043 },
          { type: 'Eyeshadows', country: 'USA', value: 12998 },
          { type: 'Eyeliner', country: 'Africa', value: 5432 },
          { type: 'Eyeliner', country: 'EU', value: 3417 },
          { type: 'Eyeliner', country: 'China', value: 15067 },
          { type: 'Eyeliner', country: 'USA', value: 12321 },
          { type: 'Foundation', country: 'Africa', value: 13701 },
          { type: 'Foundation', country: 'EU', value: 5231 },
          { type: 'Foundation', country: 'China', value: 10119 },
          { type: 'Foundation', country: 'USA', value: 10342 },
          { type: 'Lip gloss', country: 'Africa', value: 4008 },
          { type: 'Lip gloss', country: 'EU', value: 4572 },
          { type: 'Lip gloss', country: 'China', value: 12043 },
          { type: 'Lip gloss', country: 'USA', value: 22998 },
          { type: 'Mascara', country: 'Africa', value: 18712 },
          { type: 'Mascara', country: 'EU', value: 6134 },
          { type: 'Mascara', country: 'China', value: 10419 },
          { type: 'Mascara', country: 'USA', value: 11261 }
        ]
      },
      title: {
        visible: true,
        text: '100% stacked line chart of cosmetic products sales'
      },
      stack: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'country',
      legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
      axes: [
        {
          orient: 'left',
          label: {
            formatMethod: (val: string | string[]) => {
              return `${(+val * 100).toFixed(2)}%`;
            }
          }
        }
      ],
      totalLabel: {
        visible: true
      },
      point: {
        visible: false
      },
      label: {
        visible: true
      }
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        width: 600,
        height: 600
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: true,
      changeTheme: false,
      reCompile: false,
      reMake: false,
      reRender: true,
      reSize: true,
      reTransformSpec: false
    });
  });
});

describe('vchart updateSpec of different axes', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should remake when label is in series update', () => {
    const spec: ILineChartSpec = {
      type: 'line',
      data: {
        values: [
          {
            time: '2:00',
            value: 38
          },
          {
            time: '4:00',
            value: 56
          },
          {
            time: '6:00',
            value: 10
          },
          {
            time: '8:00',
            value: 70
          },
          {
            time: '10:00',
            value: 36
          },
          {
            time: '12:00',
            value: 94
          },
          {
            time: '14:00',
            value: 24
          },
          {
            time: '16:00',
            value: 44
          },
          {
            time: '18:00',
            value: 36
          },
          {
            time: '20:00',
            value: 68
          },
          {
            time: '22:00',
            value: 22
          }
        ]
      },
      xField: 'time',
      yField: 'value',
      line: {
        style: {
          curveType: 'monotone'
        }
      },
      axes: [{ orient: 'bottom', label: { style: { fill: 'red' } } }]
    };

    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        axes: [
          {
            ...(spec.axes as any)[0],
            visible: false
          }
        ]
      } as any,
      false
    );

    expect(updateRes).toEqual({
      change: false,
      changeBackground: false,
      changeTheme: false,
      reCompile: true,
      reMake: true,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });
});

describe('vchart updateSpec of different title', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should reMake when `visible` of title change from `true` to `false`', () => {
    const spec = {
      type: 'area',
      data: [
        {
          id: 'area',
          values: [
            { x: '1990', y: 110, from: 'video ad' },
            { x: '1995', y: 160, from: 'video ad' },
            { x: '2000', y: 230, from: 'video ad' },
            { x: '2005', y: 300, from: 'video ad' },
            { x: '2010', y: 448, from: 'video ad' },
            { x: '2015', y: 500, from: 'video ad' },
            { x: '1990', y: 120, from: 'email marketing' },
            { x: '1995', y: 150, from: 'email marketing' },
            { x: '2000', y: 200, from: 'email marketing' },
            { x: '2005', y: 210, from: 'email marketing' },
            { x: '2010', y: 300, from: 'email marketing' },
            { x: '2015', y: 320, from: 'email marketing' }
          ]
        }
      ],
      title: {
        visible: true,
        text: 'test'
      },
      xField: 'x',
      yField: 'y',
      seriesField: 'from'
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        title: {
          visible: false
        }
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: true,
      changeTheme: false,
      reCompile: true,
      reMake: true,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });

  it('should reMake when `visible` of title change from `false` to `true`', () => {
    const spec = {
      type: 'area',
      data: [
        {
          id: 'area',
          values: [
            { x: '1990', y: 110, from: 'video ad' },
            { x: '1995', y: 160, from: 'video ad' },
            { x: '2000', y: 230, from: 'video ad' },
            { x: '2005', y: 300, from: 'video ad' },
            { x: '2010', y: 448, from: 'video ad' },
            { x: '2015', y: 500, from: 'video ad' },
            { x: '1990', y: 120, from: 'email marketing' },
            { x: '1995', y: 150, from: 'email marketing' },
            { x: '2000', y: 200, from: 'email marketing' },
            { x: '2005', y: 210, from: 'email marketing' },
            { x: '2010', y: 300, from: 'email marketing' },
            { x: '2015', y: 320, from: 'email marketing' }
          ]
        }
      ],
      title: {
        visible: false,
        text: 'test'
      },
      xField: 'x',
      yField: 'y',
      seriesField: 'from'
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        title: {
          visible: true
        }
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: false,
      changeTheme: false,
      reCompile: false,
      reMake: true,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });
});

describe('vchart updateSpec of different indicator', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should reMake when `visible` of indicator change to `false`', () => {
    const spec = {
      type: 'area',
      data: [
        {
          id: 'area',
          values: [
            { x: '1990', y: 110, from: 'video ad' },
            { x: '1995', y: 160, from: 'video ad' },
            { x: '2000', y: 230, from: 'video ad' },
            { x: '2005', y: 300, from: 'video ad' },
            { x: '2010', y: 448, from: 'video ad' },
            { x: '2015', y: 500, from: 'video ad' },
            { x: '1990', y: 120, from: 'email marketing' },
            { x: '1995', y: 150, from: 'email marketing' },
            { x: '2000', y: 200, from: 'email marketing' },
            { x: '2005', y: 210, from: 'email marketing' },
            { x: '2010', y: 300, from: 'email marketing' },
            { x: '2015', y: 320, from: 'email marketing' }
          ]
        }
      ],
      title: {
        visible: true,
        text: 'test'
      },
      xField: 'x',
      yField: 'y',
      seriesField: 'from',
      indicator: {
        title: {
          visible: true,
          style: {
            text: 'bbb'
          }
        },
        content: [
          {
            visible: true,
            style: {
              fontSize: 20,
              text: '2222'
            }
          }
        ]
      }
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        indicator: {
          ...spec.indicator,
          visible: false
        }
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: true,
      changeTheme: false,
      reCompile: true,
      reMake: false,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });

  it('should reMake when `visible` of indicator change from `false` to `true`', () => {
    const spec = {
      type: 'area',
      data: [
        {
          id: 'area',
          values: [
            { x: '1990', y: 110, from: 'video ad' },
            { x: '1995', y: 160, from: 'video ad' },
            { x: '2000', y: 230, from: 'video ad' },
            { x: '2005', y: 300, from: 'video ad' },
            { x: '2010', y: 448, from: 'video ad' },
            { x: '2015', y: 500, from: 'video ad' },
            { x: '1990', y: 120, from: 'email marketing' },
            { x: '1995', y: 150, from: 'email marketing' },
            { x: '2000', y: 200, from: 'email marketing' },
            { x: '2005', y: 210, from: 'email marketing' },
            { x: '2010', y: 300, from: 'email marketing' },
            { x: '2015', y: 320, from: 'email marketing' }
          ]
        }
      ],
      title: {
        visible: true,
        text: 'test'
      },
      xField: 'x',
      yField: 'y',
      seriesField: 'from',
      indicator: {
        title: {
          visible: false,
          style: {
            text: 'bbb'
          }
        },
        content: [
          {
            visible: true,
            style: {
              fontSize: 20,
              text: '2222'
            }
          }
        ]
      }
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
    const updateRes = (vchart as any)._updateSpec(
      {
        ...spec,
        indicator: {
          ...spec.indicator,
          visible: true
        }
      },
      false
    );

    expect(updateRes).toEqual({
      changeBackground: false,
      change: true,
      changeTheme: false,
      reCompile: true,
      reMake: false,
      reRender: true,
      reSize: false,
      reTransformSpec: false
    });
  });
});
