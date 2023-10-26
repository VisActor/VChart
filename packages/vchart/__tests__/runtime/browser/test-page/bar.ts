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
    type: 'scatter',
    xField: '230809194822223',
    yField: '230809194822226',
    invalidType: 'ignore',
    region: [
      {
        clip: true
      }
    ],
    padding: 0,
    labelLayout: 'region',
    data: [
      {
        id: 'data',
        values: [
          {
            '30001': '抖音小游戏',
            '230809194822210': '抖音小游戏',
            '230809194822223': '234.21885414285717',
            '230809194822226': '0.06011260557038192',
            '230809194822348': '抖音小游戏',
            '230809194822358': '234.21885414285717'
          },
          {
            '30001': '短视频',
            '230809194822210': '短视频',
            '230809194822223': '209.4364248571424',
            '230809194822226': '0.025544255409681364',
            '230809194822348': '短视频',
            '230809194822358': '209.4364248571424'
          },
          {
            '30001': '消除玩法',
            '230809194822210': '消除玩法',
            '230809194822223': '168.23063557142834',
            '230809194822226': '0.43548155664703647',
            '230809194822348': '消除玩法',
            '230809194822358': '168.23063557142834'
          },
          {
            '30001': '微信小游戏',
            '230809194822210': '微信小游戏',
            '230809194822223': '113.42593014285714',
            '230809194822226': '-0.010376743103511159',
            '230809194822348': '微信小游戏',
            '230809194822358': '113.42593014285714'
          },
          {
            '30001': '快应用',
            '230809194822210': '快应用',
            '230809194822223': '109.30997057142861',
            '230809194822226': '-0.28512852308307207',
            '230809194822348': '快应用',
            '230809194822358': '109.30997057142861'
          },
          {
            '30001': '其他销售线索收集',
            '230809194822210': '其他销售线索收集',
            '230809194822223': '99.69553650000007',
            '230809194822226': '-0.025296126066644376',
            '230809194822348': '其他销售线索收集',
            '230809194822358': '99.69553650000007'
          },
          {
            '30001': 'WiFi',
            '230809194822210': 'WiFi',
            '230809194822223': '87.75196800000028',
            '230809194822226': '0.14243676000178826',
            '230809194822348': 'WiFi',
            '230809194822358': '87.75196800000028'
          },
          {
            '30001': '经营养成',
            '230809194822210': '经营养成',
            '230809194822223': '76.67864842857146',
            '230809194822226': '-0.11009089100561716',
            '230809194822348': '经营养成',
            '230809194822358': '76.67864842857146'
          },
          {
            '30001': '潮玩类',
            '230809194822210': '潮玩类',
            '230809194822223': '63.38452285714287',
            '230809194822226': '-0.09039625388246324',
            '230809194822348': '潮玩类',
            '230809194822358': '63.38452285714287'
          },
          {
            '30001': '答题解谜',
            '230809194822210': '答题解谜',
            '230809194822223': '62.522059714285916',
            '230809194822226': '0.2032568883754453',
            '230809194822348': '答题解谜',
            '230809194822358': '62.522059714285916'
          },
          {
            '30001': '扫描',
            '230809194822210': '扫描',
            '230809194822223': '50.75971314285724',
            '230809194822226': '-0.11010259286268485',
            '230809194822348': '扫描',
            '230809194822358': '50.75971314285724'
          },
          {
            '30001': '办公',
            '230809194822210': '办公',
            '230809194822223': '42.21510000000003',
            '230809194822226': '0.46064405360439487',
            '230809194822348': '办公',
            '230809194822358': '42.21510000000003'
          },
          {
            '30001': '走路记步',
            '230809194822210': '走路记步',
            '230809194822223': '39.11147928571443',
            '230809194822226': '-0.04157850604134125',
            '230809194822348': '走路记步',
            '230809194822358': '39.11147928571443'
          },
          {
            '30001': '星图',
            '230809194822210': '星图',
            '230809194822223': '38.542829857142856',
            '230809194822226': '0.11093075104201247',
            '230809194822348': '星图',
            '230809194822358': '38.542829857142856'
          },
          {
            '30001': '相机/照片美化',
            '230809194822210': '相机/照片美化',
            '230809194822223': '33.50144471428575',
            '230809194822226': '0.17859270299338437',
            '230809194822348': '相机/照片美化',
            '230809194822358': '33.50144471428575'
          },
          {
            '30001': '天气/日历',
            '230809194822210': '天气/日历',
            '230809194822223': '33.34325357142868',
            '230809194822226': '-0.16036489158259562',
            '230809194822348': '天气/日历',
            '230809194822358': '33.34325357142868'
          },
          {
            '30001': '省电/安全/优化',
            '230809194822210': '省电/安全/优化',
            '230809194822223': '33.28906642857155',
            '230809194822226': '-0.15356667847522018',
            '230809194822348': '省电/安全/优化',
            '230809194822358': '33.28906642857155'
          },
          {
            '30001': '运动健身',
            '230809194822210': '运动健身',
            '230809194822223': '32.39941300000001',
            '230809194822226': '-0.08110677006325982',
            '230809194822348': '运动健身',
            '230809194822358': '32.39941300000001'
          },
          {
            '30001': '充电',
            '230809194822210': '充电',
            '230809194822223': '30.723338857142934',
            '230809194822226': '-0.20767901946787115',
            '230809194822348': '充电',
            '230809194822358': '30.723338857142934'
          },
          {
            '30001': '视频工具',
            '230809194822210': '视频工具',
            '230809194822223': '28.31087314285716',
            '230809194822226': '-0.1448710201752521',
            '230809194822348': '视频工具',
            '230809194822358': '28.31087314285716'
          }
        ],
        fields: {
          '30001': {
            alias: '图例项 '
          },
          '230809194822210': {
            alias: '忠洁调整标的'
          },
          '230809194822223': {
            alias: '日均总消耗(w)'
          },
          '230809194822226': {
            alias: '日均总消耗(w)的环比增长率'
          },
          '230809194822348': {
            alias: '忠洁调整标的',
            domain: [
              '抖音小游戏',
              '短视频',
              '消除玩法',
              '微信小游戏',
              '快应用',
              '其他销售线索收集',
              'WiFi',
              '经营养成',
              '潮玩类',
              '答题解谜',
              '扫描',
              '办公',
              '走路记步',
              '星图',
              '相机/照片美化',
              '天气/日历',
              '省电/安全/优化',
              '运动健身',
              '充电',
              '视频工具'
            ],
            sortIndex: 0
          },
          '230809194822358': {
            alias: '日均总消耗(w)'
          }
        }
      }
    ],
    axes: [
      {
        type: 'linear',
        tick: {
          visible: false,
          tickMode: 'd3',
          style: {
            stroke: '#8D8D8D'
          }
        },
        niceType: 'accurateFirst',
        zIndex: 200,
        grid: {
          visible: true,
          style: {
            zIndex: 150,
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
            stroke: '#8D8D8D'
          }
        },
        title: {
          visible: true,
          text: '日均总消耗(w)的环比增长率',
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
            dy: -1,
            direction: 'horizontal'
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
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        nice: true
      },
      {
        type: 'linear',
        tick: {
          visible: false,
          tickMode: 'd3',
          style: {
            stroke: '#8D8D8D'
          }
        },
        niceType: 'accurateFirst',
        zIndex: 200,
        grid: {
          visible: true,
          style: {
            zIndex: 150,
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
            stroke: '#8D8D8D'
          }
        },
        title: {
          visible: true,
          text: '日均总消耗(w)',
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
          space: 4,
          flush: true,
          padding: 0,
          style: {
            fontSize: 12,
            maxLineWidth: 174,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            dy: -1,
            direction: 'horizontal'
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
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        nice: true
      }
    ],
    label: {
      visible: true,
      offset: 6,
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
        ],
        clampForce: true
      },
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        zIndex: 400,
        fill: '#363839',
        stroke: 'rgba(255, 255, 255, 0.8)',
        lineWidth: 1,
        strokeOpacity: 1
      },
      position: 'top'
    },
    legends: [
      {
        type: 'discrete',
        id: 'legend-discrete',
        orient: 'right',
        position: 'start',
        layoutType: 'normal-inline',
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
          maxWidth: 331,
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
          bottom: 12,
          left: 16,
          right: 0
        }
      },
      {
        type: 'size',
        slidable: true,
        title: {
          visible: true,
          text: '日均总消耗(w)',
          textStyle: {
            fontSize: 12,
            fill: '#6F6F6F'
          },
          space: 0
        },
        id: 'legend-size',
        orient: 'right',
        position: 'start',
        layoutType: 'normal-inline',
        visible: true,
        field: ['230809194822358'],
        layoutLevel: 50,
        maxHeight: 130,
        track: {
          style: {
            fill: 'rgba(20,20,20,0.1)'
          }
        },
        rail: {
          height: 100
        },
        handler: {
          style: {
            symbolType: 'M-5,0L-2.5,-3.5\n    h5\n    v7\n    h-5\n    Z',
            size: 8,
            shadowBlur: 0,
            shadowColor: false,
            outerBorder: {
              stroke: '#AEB8C6',
              lineWidth: 1,
              strokeOpacity: 0.5
            }
          }
        },
        handlerText: {
          style: {
            maxLineWidth: 50,
            fontSize: 12,
            fill: '#6F6F6F'
          }
        },
        startText: {
          visible: false
        },
        endText: {
          visible: false
        },
        padding: {
          top: 0,
          bottom: 12,
          left: 23,
          right: 0
        }
      }
    ],
    seriesField: '230809194822348',
    color: {
      field: '230809194822348',
      type: 'ordinal',
      range: [
        '#2E62F1',
        '#4DC36A',
        '#FF8406',
        '#FFCC00',
        '#4F44CF',
        '#5AC8FA',
        '#003A8C',
        '#B08AE2',
        '#FF6341',
        '#98DD62',
        '#07A199',
        '#87DBDD',
        '#2E62F1',
        '#4DC36A',
        '#FF8406',
        '#FFCC00',
        '#4F44CF',
        '#5AC8FA',
        '#003A8C',
        '#B08AE2'
      ],
      specified: {},
      domain: [
        '抖音小游戏',
        '短视频',
        '消除玩法',
        '微信小游戏',
        '快应用',
        '其他销售线索收集',
        'WiFi',
        '经营养成',
        '潮玩类',
        '答题解谜',
        '扫描',
        '办公',
        '走路记步',
        '星图',
        '相机/照片美化',
        '天气/日历',
        '省电/安全/优化',
        '运动健身',
        '充电',
        '视频工具'
      ]
    },
    sizeField: '230809194822358',
    size: {
      type: 'linear',
      range: [7.0898154036220635, 28.359261614488254]
    },
    tooltip: {
      handler: {}
    },
    point: {
      state: {
        hover: {
          cursor: 'pointer',
          fillOpacity: 0.8,
          stroke: '#58595B',
          lineWidth: 1,
          zIndex: 500
        }
      }
    },
    background: 'rgba(255, 255, 255, 0)',
    hover: {
      enable: true
    },
    select: {
      enable: true
    },

    markLine: [
      {
        x: numbers => {
          console.log(numbers);
          const sortNumbers = numbers.sort((a, b) => a - b);
          const count = numbers.length;
          if (count % 2 === 0) {
            return (sortNumbers[count / 2] + sortNumbers[count / 2 - 1]) / 2;
          }
          return sortNumbers[(count - 1) / 2];
        },
        startSymbol: {
          visible: true,
          symbolType: 'triangleDown',
          style: {
            size: 10,
            dx: 0,
            fill: '#f3a016'
          }
        },
        endSymbol: {
          visible: false
        },
        autoRange: true,
        label: {
          visible: true,
          style: {
            dx: 10,
            dy: 5,
            fontSize: 12,
            fontWeight: 'normal',
            fill: '#fff',
            cursor: 'pointer'
          },
          confine: true,
          position: 'insideStartTop',
          labelBackground: {
            visible: true,
            padding: {
              left: 5,
              right: 5,
              top: 2,
              bottom: 2
            },
            style: {
              fill: '#2F3B52',
              fillOpacity: 0.9,
              dx: 10,
              dy: 5
            }
          }
        },
        line: {
          style: {
            stroke: '#f3a016',
            lineWidth: 2,
            lineDash: [3, 3],
            cursor: 'pointer'
          }
        },
        relativeSeriesId: 'mainSeries',
        id: 'c95a710e-63c6-4c3d-84e0-a19d87fd3833',
        interactive: true
      }
    ],
    animation: false,
    brush: {
      inBrush: {
        fillOpacity: 1,
        stroke: '#58595B',
        lineWidth: 1,
        colorAlpha: 1
      },
      outOfBrush: {
        colorAlpha: 0.2,
        fillOpacity: 0.3,
        strokeWidth: 0.3
      }
    },
    hash: '1eb454bd5a7ed84ce1a2a94b4ce666c3'
  };

  const cs = new VChart(spec, {
    dataSet,
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  console.time('renderTime');
  cs.renderSync();
  window['vchart'] = cs;
};
run();
