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
    type: 'line',
    xField: 'x',
    yField: 'y',
    seriesField: 'type',
    markLine: [
      {
        x: (relativeSeriesData, startRelativeSeriesData, endRelativeSeriesData) => {
          console.log('relativeSeriesData', relativeSeriesData);
          console.log('startRelativeSeriesData', startRelativeSeriesData);
          console.log('endRelativeSeriesData', endRelativeSeriesData);
          return 'Wed';
        },
        label: {
          text: 'National holiday',
          position: 'insideEndBottom',
          reY: 10,
          labelBackground: {
            padding: 5,
            style: {
              stroke: '#6690F2',
              fillOpacity: 0
            }
          },
          style: {
            fill: '#6690F2'
          }
        },
        line: {
          style: {
            stroke: '#6690F2',
            lineDash: []
          }
        },
        endSymbol: {
          style: {
            visible: false
          }
        }
      },
      {
        y: 'average',
        label: {
          // text: 'Average Visit Num',
          position: 'insideEndBottom',
          refY: -10,
          formatMethod: datum => {
            console.log('caculate-datum', datum);
            // return 'Average Visit Num:';
            return 'Average Visit Num:' + datum?.[0]['y'];
          },
          labelBackground: {
            padding: 2,
            style: {
              fill: '#6690F2'
            }
          },
          style: {
            fontSize: 12
          }
        },
        line: {
          style: {
            stroke: '#6690F2',
            lineDash: []
          }
        },
        endSymbol: {
          style: {
            visible: false
          }
        }
      }
    ],
    markArea: [
      {
        y: 'average',
        y1: 'min',
        label: {
          // text: 'Average Visit Num',
          position: 'insideEndBottom',
          refY: -10,
          formatMethod: datum => {
            console.log('datum', datum?.[0]['y']);
            // return 'Average Visit Num:';
            return 'Average Visit Num:' + datum?.[0]['y'];
          },
          labelBackground: {
            padding: 2,
            style: {
              fill: '#6690F2'
            }
          },
          style: {
            fontSize: 12
          }
        },
        line: {
          style: {
            stroke: '#6690F2',
            lineDash: []
          }
        },
        endSymbol: {
          style: {
            visible: false
          }
        }
      }
    ],
    line: {
      style: {
        curveType: 'monotone'
      }
    },
    data: {
      id: 'data2',
      values: [
        { x: 'Mon', y: 14000, type: 'A' },
        { x: 'Tue', y: 14500, type: 'A' },
        { x: 'Wed', y: 24000, type: 'A' },
        { x: 'Thu', y: 13000, type: 'A' },
        { x: 'Fri', y: 15000, type: 'A' },
        { x: 'Sat', y: 19000, type: 'A' },
        { x: 'Sun', y: 21000, type: 'A' },
        { x: 'Mon', y: 15000, type: 'B' },
        { x: 'Tue', y: 14800, type: 'B' },
        { x: 'Wed', y: 25000, type: 'B' },
        { x: 'Thu', y: 9000, type: 'B' },
        { x: 'Fri', y: 15000, type: 'B' },
        { x: 'Sat', y: 20000, type: 'B' },
        { x: 'Sun', y: 19000, type: 'B' }
      ]
    }
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
