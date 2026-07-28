import { default as VChart } from '../../../../src';

const CONTAINER_ID = 'chart';
const eventCountElement = document.getElementById('eventCount') as HTMLElement;
const targetIndexElement = document.getElementById('targetIndex') as HTMLElement;

const spec = {
  type: 'common' as const,
  data: [
    {
      id: 'A',
      values: [
        { x: 'Q1', y: 45 },
        { x: 'Q2', y: 35 },
        { x: 'Q3', y: 20 }
      ]
    },
    {
      id: 'B',
      values: [
        { x: 'Q1', y: 35 },
        { x: 'Q2', y: 40 },
        { x: 'Q3', y: 45 }
      ]
    },
    {
      id: 'C',
      values: [
        { x: 'Q1', y: 20 },
        { x: 'Q2', y: 25 },
        { x: 'Q3', y: 35 }
      ]
    }
  ],
  series: [
    {
      type: 'bar' as const,
      dataId: 'A',
      xField: 'x',
      yField: 'y',
      stack: true,
      bar: { style: { fill: '#22c55e' } }
    },
    {
      type: 'bar' as const,
      dataId: 'B',
      xField: 'x',
      yField: 'y',
      stack: true,
      zIndex: 2,
      bar: {
        style: {
          fill: '#eab308',
          outerBorder: { stroke: '#3370ff', lineWidth: 3, distance: 2 }
        }
      }
    },
    {
      type: 'bar' as const,
      dataId: 'C',
      xField: 'x',
      yField: 'y',
      stack: true,
      bar: { style: { fill: '#ef4444' } }
    }
  ],
  axes: [{ orient: 'left' as const }, { orient: 'bottom' as const, type: 'band' as const }]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID, animation: false });
let eventCount = 0;

vchart.renderSync();

vchart.on('pointerdown', { markName: 'bar' }, event => {
  const targetIndex = event.model.getSpecIndex();

  spec.series.forEach((series, index) => {
    if (index === targetIndex) {
      series.zIndex = 2;
      series.bar.style.outerBorder = { stroke: '#3370ff', lineWidth: 3, distance: 2 };
    } else {
      series.zIndex = 1;
      series.bar.style.outerBorder = {
        stroke: false
      };
    }
  });

  eventCount += 1;
  eventCountElement.textContent = `${eventCount}`;
  targetIndexElement.textContent = `${targetIndex}`;
  console.log('pointerdown target index:', targetIndex);
  vchart.updateSpec(spec);
});

document.getElementById('reset')?.addEventListener('click', () => {
  window.location.reload();
});

// 仅用于在浏览器控制台检查实例，不是公共 API 使用示例。
window['vchart'] = vchart;
