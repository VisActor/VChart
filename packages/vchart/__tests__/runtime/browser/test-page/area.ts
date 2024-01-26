import { isMobile } from 'react-device-detect';
import type { IAreaChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart, registerMediaQuery } from '../../../../src/index';

// const getSpec = (): IAreaChartSpec => ({
//   type: 'area',
//   data: {
//     values: [
//       { type: 'Nail polish', country: 'Africa', value: 4229 },
//       { type: 'Nail polish', country: 'EU', value: 4376 },
//       { type: 'Nail polish', country: 'China', value: 3054 },
//       { type: 'Nail polish', country: 'USA', value: 12814 },
//       { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
//       { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
//       { type: 'Eyebrow pencil', country: 'China', value: 5067 },
//       { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
//       { type: 'Rouge', country: 'Africa', value: 5221 },
//       { type: 'Rouge', country: 'EU', value: 3574 },
//       { type: 'Rouge', country: 'China', value: 7004 },
//       { type: 'Rouge', country: 'USA', value: 11624 },
//       { type: 'Lipstick', country: 'Africa', value: 9256 },
//       { type: 'Lipstick', country: 'EU', value: 4376 },
//       { type: 'Lipstick', country: 'China', value: 9054 },
//       { type: 'Lipstick', country: 'USA', value: 8814 },
//       { type: 'Eyeshadows', country: 'Africa', value: 3308 },
//       { type: 'Eyeshadows', country: 'EU', value: 4572 },
//       { type: 'Eyeshadows', country: 'China', value: 12043 },
//       { type: 'Eyeshadows', country: 'USA', value: 12998 },
//       { type: 'Eyeliner', country: 'Africa', value: 5432 },
//       { type: 'Eyeliner', country: 'EU', value: 3417 },
//       { type: 'Eyeliner', country: 'China', value: 15067 },
//       { type: 'Eyeliner', country: 'USA', value: 12321 },
//       { type: 'Foundation', country: 'Africa', value: 13701 },
//       { type: 'Foundation', country: 'EU', value: 5231 },
//       { type: 'Foundation', country: 'China', value: 10119 },
//       { type: 'Foundation', country: 'USA', value: 10342 },
//       { type: 'Lip gloss', country: 'Africa', value: 4008 },
//       { type: 'Lip gloss', country: 'EU', value: 4572 },
//       { type: 'Lip gloss', country: 'China', value: 12043 },
//       { type: 'Lip gloss', country: 'USA', value: 22998 },
//       { type: 'Mascara', country: 'Africa', value: 18712 },
//       { type: 'Mascara', country: 'EU', value: 6134 },
//       { type: 'Mascara', country: 'China', value: 10419 },
//       { type: 'Mascara', country: 'USA', value: 11261 }
//     ]
//   },
//   title: {
//     visible: true,
//     text: 'Stacked area chart of cosmetic products sales'
//   },
//   // stack: true,
//   xField: 'type',
//   yField: 'value',
//   seriesField: 'country',
//   legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
//   crosshair: {
//     xField: { visible: true, label: { visible: true } },
//     yField: { visible: true, label: { visible: true } }
//   },
//   axes: [
//     {
//       orient: 'bottom',
//       type: 'band'
//     },
//     { orient: 'left', type: 'linear' },
//     { orient: 'right', type: 'linear' }
//   ],
//   media: [
//     {
//       query: {
//         maxWidth: 600
//       },
//       action: {
//         filterType: 'legend',
//         filter: {
//           visible: true,
//           orient: 'bottom'
//         },
//         spec: {
//           visible: false,
//           test: true
//         }
//       }
//     }
//   ]
// });

const getSpec = () => {
  const data = [
    { type: 'oxygen', value: '46.60', formula: 'O', texture: 'circle' },
    { type: 'silicon', value: '27.72', formula: 'Si', texture: 'horizontal-line' },
    { type: 'aluminum', value: '8.13', formula: 'Al', texture: 'vertical-line' },
    { type: 'iron', value: '5', formula: 'Fe', texture: 'rect' },
    { type: 'calcium', value: '3.63', formula: 'Ca', texture: 'grid' },
    { type: 'sodium', value: '2.83', formula: 'Na', texture: 'bias-rl' },
    { type: 'potassium', value: '2.59', formula: 'K', texture: 'diamond' },
    { type: 'others', value: '3.5', formula: 'Others', texture: 'bias-lr' }
  ];
  const spec = {
    width: 1564,
    height: 1044,
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: data
      }
    ],
    outerRadius: 0.8,
    innerRadius: 0.5,
    padAngle: 0.6,
    valueField: 'value',
    categoryField: 'type',
    pie: {
      style: {
        cornerRadius: 10,
        texture: datum => datum['texture']
      },
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
    title: {
      visible: true,
      text: 'Statistics of Surface Element Content'
    },
    indicator: {
      visible: true,
      trigger: 'hover',
      limitRatio: 0.5,
      title: {
        visible: true,
        autoFit: true,
        fitStrategy: 'inscribed',
        style: {
          fontWeight: 'bolder',
          fontFamily: 'Times New Roman',
          fill: '#888',
          text: datum => {
            const d = datum ?? data[0];
            return d['formula'];
          }
        }
      },
      content: [
        {
          visible: true,
          autoFit: true,
          fitStrategy: 'inscribed',
          style: {
            fill: 'orange',
            fontWeight: 'bolder',
            fontFamily: 'Times New Roman',
            text: datum => {
              const d = datum ?? data[0];
              return d['type'];
            }
          }
        },
        {
          visible: true,
          autoFit: true,
          fitStrategy: 'inscribed',
          style: {
            fill: 'orange',
            fontFamily: 'Times New Roman',
            text: datum => {
              const d = datum ?? data[0];
              return d['value'] + '%';
            }
          }
        }
      ]
    },
    legends: {
      visible: true,
      orient: 'left',
      item: {
        shape: {
          style: {
            symbolType: 'circle',
            texture: datum => datum['texture']
          }
        }
      }
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
  return spec;
};

const run = () => {
  registerMediaQuery();
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(getSpec(), {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    //theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');

  cs.on('tooltipShow', () => {
    console.log('tooltipShow');
  });

  cs.on('tooltipHide', () => {
    console.log('tooltipHide');
  });

  cs.on('tooltipRelease', () => {
    console.log('tooltipRelease');
  });

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });

  setTimeout(() => {
    cs.updateSpec({
      ...getSpec()
      /*
      point: {
        style: {
          stroke: '#000'
        }
      }
      */
    });
  }, 2000);

  window['vchart'] = cs;
  window['getSpec'] = getSpec;
  console.log(cs);
};
run();
