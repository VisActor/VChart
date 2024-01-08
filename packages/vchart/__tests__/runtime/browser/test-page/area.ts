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
  return {
    type: 'area',
    xField: '年份',
    yField: '增长率',
    // point: true,
    seriesField: '国家',
    axes: [
      {
        animation: true,
        orient: 'bottom',
        type: 'band',
        visible: true,
        title: {
          visible: false,
          style: {
            fill: '#FFFFFF'
          }
        },
        label: {
          style: {
            fill: '#888C93',
            fontFamily: 'PingFangSC-Regular',
            fontSize: 12,
            fontWeight: 'bolder'
          }
        },
        domainLine: {
          visible: true,
          style: {
            stroke: '#404349',
            lineWidth: 1
          }
        },
        tick: {
          visible: false
        },
        grid: {
          visible: true,
          style: {
            lineDash: [3, 3],
            stroke: '#404349',
            lineWidth: 0
          }
        }
      },
      {
        animation: true,
        id: 'axis-left',
        orient: 'left',
        type: 'linear',
        tick: {
          visible: false
        },
        title: {
          visible: false,
          style: {
            fill: '#FFFFFF'
          }
        },
        label: {
          style: {
            fill: '#888C93',
            fontFamily: 'PingFangSC-Regular',
            fontSize: 12,
            fontWeight: 'bolder'
          }
        },
        domainLine: {
          visible: true,
          style: {
            stroke: '#404349',
            lineWidth: 1
          }
        },
        grid: {
          visible: true,
          style: {
            lineDash: [3, 3],
            stroke: '#404349',
            lineWidth: 1
          }
        },
        visible: true
      }
    ],
    label: {
      visible: true
    },
    data: {
      id: 'id0',
      values: [
        {
          年份: '1964',
          增长率: '1.61',
          国家: '中国'
        },
        {
          年份: '1982',
          增长率: '2.09',
          国家: '中国'
        },
        {
          年份: '1990',
          增长率: '1.48',
          国家: '中国'
        },
        {
          年份: '2000',
          增长率: '1.07',
          国家: '中国'
        },
        {
          年份: '2010',
          增长率: '0.57',
          国家: '中国'
        },
        {
          年份: '2020',
          增长率: '0.53',
          国家: '中国'
        },
        {
          年份: '1964',
          增长率: '0.73',
          国家: '日本'
        },
        {
          年份: '1982',
          增长率: '0.36',
          国家: '日本'
        },
        {
          年份: '1990',
          增长率: '0.12',
          国家: '日本'
        },
        {
          年份: '2000',
          增长率: '-0.53',
          国家: '日本'
        },
        {
          年份: '2010',
          增长率: '-0.83',
          国家: '日本'
        },
        {
          年份: '2020',
          增长率: '-1.67',
          国家: '日本'
        }
      ]
    },
    point: {
      style: {
        size: 20
      }
    },
    background: 'transparent',
    animationAppear: {
      line: {
        duration: 3000
      },
      point: {
        duration: 500,
        oneByOne: true
      }
    }
  };
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

  // setTimeout(() => {
  //   cs.updateSpec({
  //     ...getSpec()
  //     /*
  //     point: {
  //       style: {
  //         stroke: '#000'
  //       }
  //     }
  //     */
  //   });
  // }, 2000);

  window['vchart'] = cs;
  window['getSpec'] = getSpec;
  console.log(cs);
};
run();
