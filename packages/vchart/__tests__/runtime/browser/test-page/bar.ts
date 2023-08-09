import { STATE_HOVER_REVERSE } from './../../../../cjs/compile/mark/interface.d';
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
    type: 'common',
    series: [
      {
        id: 'mainSeries',
        type: 'bar',
        direction: 'horizontal',
        yField: '230802143541013',
        xField: '10011',
        regionId: 'mainRegion',
        seriesField: '20001',
        data: {
          id: 'mainSeriesData',
          values: [
            {
              '10001': '数量',
              '10003': '230802162749051',
              '10011': '19173',
              '20001': '数量',
              '230802143541013': '消费者',
              '230802162749051': '19173'
            },
            {
              '10001': '数量',
              '10003': '230802162749051',
              '10011': '11581',
              '20001': '数量',
              '230802143541013': '公司',
              '230802162749051': '11581'
            },
            {
              '10001': '数量',
              '10003': '230802162749051',
              '10011': '6780',
              '20001': '数量',
              '230802143541013': '小型企业',
              '230802162749051': '6780'
            }
          ],
          fields: {
            '10001': {
              alias: '指标名称 '
            },
            '10011': {
              alias: '指标值(主轴) '
            },
            '10012': {
              alias: '指标值(次轴) '
            },
            '20001': {
              alias: '图例项 ',
              domain: ['数量', '利润']
            },
            '230802143541013': {
              alias: '细分',
              domain: ['公司', '消费者', '小型企业']
            },
            '230802162749051': {
              alias: '数量'
            },
            '230802162749075': {
              alias: '利润'
            }
          }
        },
        label: {
          visible: true,
          overlap: {
            hideOnHit: true,
            clampForce: true
          },
          style: {
            fontSize: 22,
            fontWeight: 'normal',
            fill: '#7953CB',
            strokeOpacity: 1
          },
          position: 'outside',
          smartInvert: false
        }
      },
      {
        id: 'subSeries',
        type: 'bar',
        direction: 'horizontal',
        yField: '230802143541013',
        xField: '10012',
        regionId: 'subRegion',
        seriesField: '20001',
        data: {
          id: 'subSeriesData',
          values: [
            {
              '10001': '利润',
              '10003': '230802162749075',
              '10012': '1053092.6314019188',
              '20001': '利润',
              '230802143541013': '消费者',
              '230802162749075': '1053092.6314019188'
            },
            {
              '10001': '利润',
              '10003': '230802162749075',
              '10012': '681967.6347733513',
              '20001': '利润',
              '230802143541013': '公司',
              '230802162749075': '681967.6347733513'
            },
            {
              '10001': '利润',
              '10003': '230802162749075',
              '10012': '412478.6609529555',
              '20001': '利润',
              '230802143541013': '小型企业',
              '230802162749075': '412478.6609529555'
            }
          ],
          fields: {
            '10001': {
              alias: '指标名称 '
            },
            '10011': {
              alias: '指标值(主轴) '
            },
            '10012': {
              alias: '指标值(次轴) '
            },
            '20001': {
              alias: '图例项 ',
              domain: ['数量', '利润']
            },
            '230802143541013': {
              alias: '细分',
              domain: ['公司', '消费者', '小型企业']
            },
            '230802162749051': {
              alias: '数量'
            },
            '230802162749075': {
              alias: '利润'
            }
          }
        },
        label: {
          visible: true,
          overlap: {
            hideOnHit: false,
            clampForce: true
          },
          style: {
            fontSize: 22,
            fontWeight: 'normal',
            fill: '#7953CB',
            strokeOpacity: 1
          },
          position: 'inside',
          smartInvert: false
        }
      }
    ],
    region: [
      {
        id: 'mainRegion'
      },
      {
        id: 'subRegion'
      }
    ],
    layout: {
      type: 'grid',
      row: 2,
      col: 4,
      elements: [
        {
          modelId: 'legend',
          col: 0,
          row: 0,
          rowSpan: 2
        },
        {
          modelId: 'mainRegion',
          col: 1,
          row: 0
        },
        {
          modelId: 'dimensionAxis',
          col: 2,
          row: 0
        },
        {
          modelId: 'subRegion',
          col: 3,
          row: 0
        },
        {
          modelId: 'measureAxisLeft',
          col: 1,
          row: 1
        },
        {
          modelId: 'measureAxisRight',
          col: 3,
          row: 1
        }
      ]
    },
    axes: [
      {
        id: 'dimensionAxis',
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
        orient: 'left',
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
          text: '细分',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        label: {
          visible: true,
          style: {
            fontSize: 12,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            textAlign: 'center'
          },
          minGap: 4,
          flush: true,
          containerAlign: 'center'
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
        minWidth: 150,
        maxWidth: 500,
        // width: 300,
        regionId: ['mainRegion', 'subRegion'],
        seriesId: ['mainSeries', 'subSeries'],
        paddingInner: 0.15,
        paddingOuter: 0.075
      },
      {
        id: 'measureAxisLeft',
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
        orient: 'bottom',
        maxHeight: 200,
        minHeight: 150,
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
          text: '数量',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        label: {
          visible: true,
          style: {
            fontSize: 12,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal'
          }
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
        nice: true,
        regionId: 'mainRegion',
        seriesId: 'mainSeries',
        inverse: true
      },
      {
        id: 'measureAxisRight',
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
        orient: 'bottom',
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
          text: '利润',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        label: {
          visible: true,
          style: {
            fontSize: 12,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal'
          }
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
        nice: true,
        regionId: 'subRegion',
        seriesId: 'subSeries'
      }
    ],
    seriesField: '20001',
    color: {
      field: '20001',
      type: 'ordinal',
      range: ['#2E62F1', '#4DC36A'],
      specified: {}
    },
    legends: [
      {
        type: 'discrete',
        id: 'legend',
        orient: 'left',
        position: 'middle',
        layoutType: 'normal',
        visible: true,
        hover: false,
        maxCol: 1,
        title: {
          textStyle: {
            fontSize: 12,
            fill: '#6F6F6F'
          }
        },
        item: {
          spaceRow: 0,
          spaceCol: 0,
          padding: {
            top: 4,
            bottom: 4,
            left: 4,
            right: 22
          },
          background: {
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
          left: 0,
          right: 16
        }
      }
    ],
    background: 'rgba(255, 255, 255, 0)',
    bar: {
      clipByLayout: true
    },
    animation: false,
    hash: '2cb6effecb08e3232ed3c5fab8ded989'
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
