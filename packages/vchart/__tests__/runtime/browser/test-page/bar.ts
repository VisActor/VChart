import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const dataSet = new DataSet();
  dataSet.registerParser('csv', csvParser);
  const dataView = new DataView(dataSet);
  const type1 = ['A', 'B'];
  const type2 = ['A', 'B'];
  const color = {
    A: {
      A: 'A',
      B: 'B'
    },
    B: {
      A: 'C',
      B: 'D'
    }
  };

  let data = 'y,x,y2,type,type2,color';
  type2.forEach(t2 => {
    type1.forEach(t => {
      for (let i = 0; i < 10; i++) {
        data += `\n${Math.floor(Math.random() * 300) + 600},${i},0,${t},${t2},${color[t][t2]}`;
      }
    });
  });

  dataView.parse(data, {
    type: 'csv'
  });
  const spec = {
    type: 'bar',
    barBackground: {
      visible: true
    },
    xField: ['230907111524013', '10001'],
    yField: ['10002'],
    direction: 'vertical',
    seriesField: '20001',
    padding: 0,
    data: [
      {
        id: 'data',
        values: [
          {
            '10001': '销售额',
            '10002': '8025072.194172859',
            '10003': '230907111524016',
            '20001': '销售额',
            '230907111524013': '消费者',
            '230907111524016': '8025072.194172859'
          },
          {
            '10001': '销售额',
            '10002': '5152793.296570778',
            '10003': '230907111524016',
            '20001': '销售额',
            '230907111524013': '公司',
            '230907111524016': '5152793.296570778'
          },
          {
            '10001': '销售额',
            '10002': '2891088.6421899796',
            '10003': '230907111524016',
            '20001': '销售额',
            '230907111524013': '小型企业',
            '230907111524016': '2891088.6421899796'
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
            domain: ['销售额'],
            sortIndex: 0,
            lockStatisticsByDomain: true
          },
          '230907111524013': {
            alias: '细分',
            domain: ['公司', '消费者', '小型企业'],
            sortIndex: 0,
            lockStatisticsByDomain: true
          },
          '230907111524016': {
            alias: '销售额'
          }
        }
      }
    ],
    dataZoom: [
      {
        filterMode: 'axis',
        orient: 'bottom',
        padding: {
          top: 15
        },
        height: 28,
        backgroundColor: {
          style: {}
        },
        backgroundChart: {
          area: {
            style: {}
          }
        },
        selectedBackground: {
          style: {}
        },
        startHandler: {
          style: {}
        },
        endHandler: {
          style: {}
        },
        middleHandler: {
          visible: false
        }
      }
    ],
    axes: [
      {
        type: 'band',
        tick: {
          visible: false
        },
        grid: {
          visible: false,
          style: {
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: [4, 2]
          }
        },
        orient: 'bottom',
        visible: true,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: '#989999'
          }
        },
        title: {
          visible: false,
          space: 5,
          text: '细分',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        sampling: false,
        label: {
          visible: true,
          space: 4,
          style: {
            fontSize: 12,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal'
          },
          autoHide: true,
          autoHideMethod: 'greedy',
          flush: true
        },
        hover: true,
        background: {
          visible: false,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        paddingInner: [0.15, 0],
        paddingOuter: [0.075, 0]
      },
      {
        type: 'linear',
        tick: {
          visible: false,
          style: {
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        niceType: 'accurateFirst',
        grid: {
          visible: true,
          style: {
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: [4, 2]
          }
        },
        orient: 'left',
        visible: true,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        title: {
          visible: false,
          text: '销售额',
          space: 8,
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        sampling: false,
        label: {
          visible: true,
          space: 6,
          flush: true,
          padding: 0,
          style: {
            fontSize: 12,
            maxLineWidth: 174,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            dy: -1
          },
          autoHide: true,
          autoHideMethod: 'greedy'
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        nice: true
      }
    ],
    color: {
      field: '20001',
      type: 'ordinal',
      range: ['#2E62F1'],
      specified: {},
      domain: ['销售额']
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
        layoutLevel: 60,
        item: {
          focus: true,
          focusIconStyle: {
            size: 14
          },
          maxWidth: 376,
          spaceRow: 0,
          spaceCol: 0,
          padding: {
            top: 1,
            bottom: 2,
            left: 3,
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
          layout: 'horizontal',
          padding: {
            left: -18
          },
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
          bottom: 0,
          left: 16,
          right: 0
        }
      }
    ],
    label: {
      visible: false,
      overlap: {
        hideOnHit: true,
        clampForce: true
      },
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        fill: null,
        strokeOpacity: 1
      },
      position: 'inside',
      smartInvert: {
        fillStrategy: 'invertBase',
        strokeStrategy: 'similarBase'
      }
    },
    tooltip: {
      handler: {}
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
          strokeWidth: 0.3
        }
      }
    },
    background: 'rgba(255, 255, 255, 0)',
    barWidth: '75%',
    animation: false,
    hash: 'e2ad596113184d054f3bd3d609f2bed6'
  };

  const cs = new VChart(spec, {
    dataSet,
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  console.time('renderTime');
  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
