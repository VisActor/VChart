import { isMobile } from 'react-device-detect';
// eslint-disable-next-line no-duplicate-imports
import type { IBarChartSpec } from '../../../../src/index';
import { default as VChart, registerVennChart } from '../../../../src/index';

const spec: IBarChartSpec = {
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

const run = () => {
  // setTimeout(() => {
  //   VChart.ThemeManager.setCurrentTheme('dark');
  // }, 3000);
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

  window['vchart'] = cs;
  console.log(cs);

  const themeButton = document.createElement('button');
  themeButton.textContent = 'Switch Theme';
  themeButton.onclick = () => {
    // get current theme
    const currentTheme = VChart.ThemeManager.getCurrentThemeName();
    VChart.ThemeManager.setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  // Insert the button before the chart container
  const chartContainer = document.getElementById('chart');
  chartContainer.parentNode.insertBefore(themeButton, chartContainer);
};
run();
