import VChart from '@visactor/vchart';
import { isMobile } from 'react-device-detect';
import { createElement } from '@internal/story-player';
import { charts } from './charts';
import { IColorSchemeStruct } from '@visactor/vchart/esm/theme/color-scheme/interface';

let chartInstanceList: VChart[] = [];
let cardList: HTMLDivElement[] = [];

const chartHeight = 400;

export function init(theme?: string) {
  release();
  for (const chart of charts) {
    const card = createElement('div', undefined, {
      width: '50%',
      padding: '30px',
      display: 'inline-block'
    }) as HTMLDivElement;
    document.getElementById('app')?.appendChild(card);

    const chartContainer = createElement('div', undefined, {
      outline: `1px solid ${theme === 'dark' ? '#404349' : '#e3e5e8'}`
    }) as HTMLDivElement;
    card.appendChild(chartContainer);

    const chartInstance = new VChart(
      {
        height: chartHeight,
        ...chart.spec
      },
      {
        ...chart.option,
        dom: chartContainer,
        mode: isMobile ? 'mobile-browser' : 'desktop-browser',
        theme
      }
    );
    chartInstance.renderAsync();

    chartInstanceList.push(chartInstance);
    cardList.push(card);
  }

  document.body.style.backgroundColor = (
    VChart.ThemeManager.getTheme(theme ?? 'light')?.colorScheme?.default as IColorSchemeStruct
  )?.palette?.backgroundColor as string;
}

function release() {
  for (const chart of chartInstanceList) {
    chart.release();
  }
  chartInstanceList = [];
  for (const chartContainer of cardList) {
    chartContainer.remove();
  }
  cardList = [];
}

[...VChart.ThemeManager.themes.keys()].forEach(theme => {
  const button = createElement('button') as HTMLButtonElement;
  button.innerText = `${theme} theme`;
  button.onclick = () => init(theme);
  document.getElementById('buttons')?.appendChild(button);
});

init('dark');
