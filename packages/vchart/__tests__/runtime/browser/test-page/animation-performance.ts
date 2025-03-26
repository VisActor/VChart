import { isMobile } from 'react-device-detect';
import type { IAreaChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import {
  default as VChart,
  registerMediaQuery,
  registerAnimate,
  registerCustomAnimate,
  registerStateTransition
} from '../../../../src/index';
registerAnimate();
registerCustomAnimate();
registerStateTransition();

const spec = {
  type: 'common',
  series: [
    {
      type: 'scatter',
      xField: 'x',
      yField: 'y',
      animationThreshold: 10000000000
    }
  ],
  axes: [
    {
      title: {
        visible: true,
        text: 'Horse Power'
      },
      orient: 'left',
      range: { min: 0 },
      type: 'linear'
    },
    {
      title: {
        visible: true,
        text: 'Miles Per Gallon'
      },
      orient: 'bottom',
      label: { visible: true },
      type: 'linear'
    }
  ],
  data: [
    {
      id: 'data',
      values: new Array(10000).fill(0).map((item, index) => ({ x: index, y: Math.random() * 100 }))
    }
  ]
};

const run = () => {
  registerMediaQuery();
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    //theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  // const button6 = document.createElement('button');
  // button6.innerHTML = 'direction';
  // button6.addEventListener('click', () => {
  //   const nextSpec: any = { ...spec };
  //   nextSpec.direction = nextSpec.direction === 'horizontal' ? 'vertical' : 'horizontal';
  //   [nextSpec.xField, nextSpec.yField] = [nextSpec.yField, nextSpec.xField];
  //   spec = nextSpec;
  //   cs.updateSpec(spec as any);
  // });
  // document.body.appendChild(button6);

  window['vchart'] = cs;
  console.log(cs);
};
run();
