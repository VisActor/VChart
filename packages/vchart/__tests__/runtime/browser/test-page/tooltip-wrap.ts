import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const spec = {
    type: 'common',
    data: [
      {
        id: 'data',
        values: [
          {
            time: '2024-03-12',
            value: 0.4731459869426807,
            predicted: 0.45044246067285426,
            isAnomaly: true,
            reason: [
              '相较昨日波动超过10%',
              '波动超出7天平均波动的2个标准差',
              '波动超出30天平均波动的2个标准差',
              '连续3天上升（且3天上升总和超过10%）'
            ]
          },
          {
            time: '2024-03-13',
            value: 0.4726438058648292,
            predicted: 0.4475537423107892,
            isAnomaly: false
          },
          {
            time: '2024-03-14',
            value: 0.4431379671572052,
            predicted: 0.4446650239487241,
            isAnomaly: false
          },
          {
            time: '2024-03-15',
            value: 0.4275657727037553,
            predicted: 0.44177630558665903,
            isAnomaly: false
          },
          {
            time: '2024-03-16',
            value: 0.4277736272630086,
            predicted: 0.438887587224594,
            isAnomaly: false
          },
          {
            time: '2024-03-17',
            value: 0.4222183284722267,
            predicted: 0.43599886886252887,
            isAnomaly: false
          },
          {
            time: '2024-03-18',
            value: 0.4231046420404159,
            predicted: 0.4331101505004638,
            isAnomaly: false
          },
          {
            time: '2024-03-19',
            value: 0.4226919769419247,
            predicted: 0.4302214321383987,
            isAnomaly: false
          },
          {
            time: '2024-03-20',
            value: 0.4262901399951245,
            predicted: 0.42733271377633364,
            isAnomaly: false
          },
          {
            time: '2024-03-21',
            value: 0.4296445897769297,
            predicted: 0.42790591300038405,
            isAnomaly: false
          },
          {
            time: '2024-03-22',
            value: 0.4300273034480926,
            predicted: 0.4284791122244345,
            isAnomaly: false
          },
          {
            time: '2024-03-23',
            value: 0.4260349969367469,
            predicted: 0.42905231144848494,
            isAnomaly: false
          },
          {
            time: '2024-03-24',
            value: 0.43613864208578,
            predicted: 0.42962551067253535,
            isAnomaly: false
          },
          {
            time: '2024-03-25',
            value: 0.4307704679765351,
            predicted: 0.4301987098965858,
            isAnomaly: false
          },
          {
            time: '2024-03-26',
            value: 0.4307653074209157,
            predicted: 0.43077190912063623,
            isAnomaly: false
          },
          {
            time: '2024-03-27',
            value: 0.4265733516244665,
            predicted: 0.43134510834468665,
            isAnomaly: false
          },
          {
            time: '2024-03-28',
            value: 0.4290710943263339,
            predicted: 0.43191830756873706,
            isAnomaly: false
          },
          {
            time: '2024-03-29',
            value: 0.4357161216093265,
            predicted: 0.43249150679278753,
            isAnomaly: false
          },
          {
            time: '2024-03-30',
            value: 0.4341245184275499,
            predicted: 0.43306470601683794,
            isAnomaly: false
          },
          {
            time: '2024-03-31',
            value: 0.4392156345245863,
            predicted: 0.43363790524088835,
            isAnomaly: false
          },
          {
            time: '2024-04-01',
            value: 0.4397829768664365,
            predicted: 0.42995556283075376,
            isAnomaly: false
          },
          {
            time: '2024-04-02',
            value: 0.4310851993869859,
            predicted: 0.42627322042061916,
            isAnomaly: false
          },
          {
            time: '2024-04-03',
            value: 0.4317001554076007,
            predicted: 0.42259087801048456,
            isAnomaly: false
          },
          {
            time: '2024-04-04',
            value: 0.427235335521357,
            predicted: 0.41890853560034996,
            isAnomaly: false
          },
          {
            time: '2024-04-05',
            value: 0.4274868754109968,
            predicted: 0.41522619319021536,
            isAnomaly: false
          },
          {
            time: '2024-04-06',
            value: 0.4288479804402697,
            predicted: 0.4115438507800807,
            isAnomaly: false
          },
          {
            time: '2024-04-07',
            value: 0.4255550591975216,
            predicted: 0.4078615083699461,
            isAnomaly: false
          },
          {
            time: '2024-04-08',
            value: 0.3987952520260448,
            predicted: 0.4041791659598115,
            isAnomaly: true,
            reason: ['波动超出7天平均波动的2个标准差', '波动超出30天平均波动的2个标准差']
          },
          {
            time: '2024-04-09',
            value: 0.382025938039991,
            predicted: 0.4004968235496769,
            isAnomaly: true,
            reason: ['波动超出30天平均波动的2个标准差', '连续3天下降（且3天下降总和超过10%）']
          },
          {
            time: '2024-04-10',
            value: 0.3837001512382603,
            predicted: 0.3968144811395423,
            isAnomaly: true,
            reason: ['波动超出30天平均波动的2个标准差']
          }
        ]
      }
    ],
    tooltip: {
      style: {
        shape: {
          size: 0
        },
        valueLabel: {
          multiLine: true,
          extraWidth: 2
          //maxWidth: 200
        }
      },
      dimension: {
        title: {
          value: _item => {
            const item = _item;
            return item.time;
          }
        },
        content: [
          {
            key: '实际值',
            value: _item => {
              const item = _item;

              return item.value;
            }
          },
          {
            key: '期望值',
            value: _item => {
              const item = _item;
              return item.predicted;
            }
          },
          {
            key: '异常详情',
            value: _item => {
              const item = _item;

              return item.reason ? item.reason.join('\n') : '';
            }
          }
        ]
      },
      mark: {
        title: {
          value: _item => {
            const item = _item;

            return item.time;
          }
        },
        content: [
          {
            key: '实际值',
            value: _item => {
              const item = _item;

              return item.value;
            }
          },
          {
            key: '期望值',
            value: _item => {
              const item = _item;

              return item.predicted;
            }
          },
          {
            key: '异常详情',
            value: _item => {
              const item = _item;

              return item.reason ? item.reason.join('\n') : '';
            }
          }
        ]
      }
    },
    series: [
      {
        type: 'line',
        dataIndex: 0,
        xField: 'time',
        yField: 'value',
        point: {
          state: {
            hover: {
              fillOpacity: 0.5,
              stroke: 'blue',
              lineWidth: 2
            },
            selected: {
              fill: 'red'
            }
          },
          style: {
            size: 5,
            lineWidth: 0,
            fill: (data, scale) => {
              if (data.isAnomaly) {
                return 'red';
              }
              return scale.seriesColor(data.groupName);
            },
            stroke: (data, scale) => {
              if (data.isAnomaly) {
                return 'red';
              }
              return scale.seriesColor(data.groupName);
            }
          }
        }
      },
      {
        type: 'line',
        dataIndex: 0,
        xField: 'time',
        yField: 'predicted',
        tooltip: {
          visible: false
        },
        line: {
          style: {
            lineDash: [3, 3]
          }
        },
        point: {
          style: {
            size: 1
          }
        }
      }
    ],
    axes: [
      {
        orient: 'left',
        label: {
          visible: true
        },
        type: 'linear'
      },
      {
        orient: 'bottom',
        type: 'band'
      }
    ],
    crosshair: {
      xField: {
        visible: true,
        line: {
          type: 'line',
          style: {
            lineWidth: 1,
            opacity: 1,
            stroke: '#959DA5'
          }
        }
      }
    },
    color: ['#1664FF']
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
};
run();
