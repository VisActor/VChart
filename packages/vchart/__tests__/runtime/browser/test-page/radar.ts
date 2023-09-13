import { isMobile } from 'react-device-detect';
import type { IRadarChartSpec } from '../../../../src/index';
import { VChart } from '../../../../src/index';

const run = () => {
  const mockData: any[] = [];
  const types = ['A', 'B', 'C'];

  types.forEach(type => {
    for (let i = 1; i <= 12; i++) {
      mockData.push({ month: i + '月', value: Math.random() * 100 + 10, type });
    }
  });

  const spec: IRadarChartSpec = {
    type: 'radar',
    data: [
      {
        values: mockData
      }
    ],
    categoryField: 'month',
    valueField: 'value',
    seriesField: 'type', // 声明分组字段
    axes: [
      {
        orient: 'radius', // 半径轴配置
        grid: {
          smooth: true, // 平滑的网格线
          style: {
            lineDash: [0]
          },
          alternateColor: '#f5f5f5' // 配置栅格线间的背景色
        }
      },
      {
        orient: 'angle', // 角度轴配置
        tick: {
          visible: false
        },
        domainLine: {
          visible: true,
          style: {
            stroke: '#333'
          }
        },
        grid: {
          style: {
            lineDash: [0]
          }
        }
      }
    ],
    crosshair: {
      categoryField: { visible: true },
      valueField: { visible: true }
    },
    legends: {
      visible: true,
      orient: 'top'
    }
  };
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
