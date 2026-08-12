import { default as VChart, type ISpec } from '../../../../src/index';

const WIDTH = 640;
const HEIGHT = 360;
const DATA_COUNT = 1000;

const values = Array.from({ length: DATA_COUNT }, (_, index) => {
  const itemIndex = index + 1;
  const category = `R${itemIndex.toString().padStart(5, '0')}`;

  return {
    category: itemIndex % 17 === 0 ? `${category}-resize-label-long-text` : category,
    value: (itemIndex * 37 + 1) % 997,
    value2: (itemIndex * 53 + 18) % 991,
    word: `word-${itemIndex.toString().padStart(5, '0')}`
  };
});

const spec: ISpec = {
  type: 'pie',
  width: WIDTH,
  height: HEIGHT,
  autoFit: false,
  animation: false,
  background: '#ffffff',
  color: ['#3370ff', '#00b8d9', '#34c724', '#ff7d00', '#7b67ee', '#f54a45'],
  padding: { top: 24, right: 24, bottom: 52, left: 60 },
  data: [{ id: 'main', values }],
  tooltip: { visible: true },
  categoryField: 'category',
  valueField: 'value',
  outerRadius: 0.82,
  label: { visible: true, style: { fontSize: 10 }, position: 'outside' },
  legends: { visible: true, orient: 'right' }
};

const chartContainer = document.getElementById('chartContainer') as HTMLElement;
const chartDom = document.getElementById('chart') as HTMLElement;
const controlPanel = document.getElementById('controlPanel') as HTMLElement;

chartContainer.style.flexGrow = '0';
chartContainer.style.width = `${WIDTH}px`;
chartContainer.style.height = `${HEIGHT}px`;
chartContainer.style.margin = '12px auto 0';
chartDom.style.width = '100%';
chartDom.style.height = '100%';

const renderButton = document.createElement('button');
renderButton.type = 'button';
renderButton.textContent = '渲染 pie.small.100';

const resetButton = document.createElement('button');
resetButton.type = 'button';
resetButton.textContent = '释放并重置';

const status = document.createElement('span');
status.style.marginLeft = '8px';
status.textContent = '100 个数据点，等待录制后点击渲染';

let chart: VChart | undefined;

const reset = () => {
  chart?.release();
  chart = undefined;
  chartDom.replaceChildren();
  renderButton.disabled = false;
  status.textContent = '已重置，可开始下一次录制';
};

renderButton.addEventListener('click', () => {
  reset();
  performance.mark('vchart-pie-small:create-start');
  chart = new VChart(spec, { dom: chartDom, mode: 'desktop-browser', animation: false });
  performance.mark('vchart-pie-small:render-start');
  chart.renderSync();
  performance.mark('vchart-pie-small:render-end');
  renderButton.disabled = true;
  window['vchart'] = chart;
  status.textContent = '已渲染；使用“释放并重置”后可进行下一次录制';
});

resetButton.addEventListener('click', reset);
controlPanel.append(renderButton, resetButton, status);
