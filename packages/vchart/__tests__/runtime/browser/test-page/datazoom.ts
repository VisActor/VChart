import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';

const run = () => {
  const spec = {
    type: 'bar',
    data: [
      {
        id: 'barData',
        values: [
          { month: 'Monday', sales: 22 },
          { month: 'Tuesday', sales: 13 },
          { month: 'Wednesday', sales: 25 },
          { month: 'Thursday', sales: 29 },
          { month: 'Friday', sales: 38 }
        ]
      }
    ],
    xField: 'month',
    yField: 'sales'
  };

  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    onError: null,
    logLevel: 5
  });
  console.time('renderTime');
  const handlerEvent = p => {
    console.log('p', p);
  };
  // eslint-disable-next-line promise/catch-or-return
  cs.renderAsync().then(() => {
    cs.on('click', { level: 'chart' }, handlerEvent);
    cs.release();

    cs.off('click', handlerEvent);
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
