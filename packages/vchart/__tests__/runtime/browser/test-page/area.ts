import { isMobile } from 'react-device-detect';
import type { IAreaChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart } from '../../../../src/index';

const run = () => {
  const spec: IAreaChartSpec = {
    type: 'area',
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
      text: 'Stacked area chart of cosmetic products sales'
    },
    // stack: true,
    xField: 'type',
    yField: 'value',
    seriesField: 'country',
    legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
    crosshair: {
      xField: { visible: true }
    },
    tooltip: {
      dimension: {
        title: {
          valueStyle: {
            fill: 'green'
          }
        },
        content: [
          {
            key: datum => datum['country'],
            value: datum => datum['value'],
            valueStyle: {
              fill: 'red',
              fontWeight: 'bold'
            }
          },
          {
            key: '第二行',
            value: datum => datum['value'],
            keyStyle: {
              fill: 'blue',
              fontWeight: 'bold'
            },
            valueStyle: {
              fontSize: 12
            }
          }
        ],
        updateContent: prev => {
          prev[2].keyStyle = {
            fill: 'orange',
            fontWeight: 'bold'
          };
          prev[2].valueStyle = {
            fill: 'orange',
            fontWeight: 'bold'
          };
          return prev;
        }
      }
    }
  };

  //VChart.ThemeManager.setCurrentTheme('dark');
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
