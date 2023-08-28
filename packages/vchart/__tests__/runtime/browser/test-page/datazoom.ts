import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';

const run = () => {
  const getSpec = () => ({
    width: 800,
    type: 'bar',
    xField: 'x',
    yField: 'y',
    title: {
      text: 'xxx'
    },
    data: {
      id: 'data2',
      values: [
        { x: 'A', y: 80 },
        { x: 'B', y: 40 },
        { x: 'C', y: 10 },
        { x: 'D', y: 20 }
      ]
    },
    legends: {},
    dataZoom: [
      {
        orient: 'bottom'
      }
    ]
  });

  const cs = new VChart(getSpec(), {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  console.time('renderTime');
  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  window['getSpec'] = getSpec;
  console.log(cs);
};
run();
