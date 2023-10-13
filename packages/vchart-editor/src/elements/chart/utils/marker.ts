/**
 * @description 获取标注的默认初始配置
 */
import { IChartSpec, IVChart } from '@visactor/vchart';

type Datum = {
  [key: string]: any;
};

type Data = Datum[];

// 获取复合增长标记的初始配置
export function getDefaultGrowthMarkLineConfig(chart: IVChart) {
  // 根据已绘制的图表
  // TODO：需要根据图表的spec 来获取初始 coordinates
  // TODO: 需要区分分组和堆叠场景
  // 水平：offsetX 30
  // 垂直：offsetY -30
  return {
    coordinates: [
      {
        State: 'WY',
        Age: 'Under 5 Years',
        Population: 25635
      },
      {
        State: 'AK',
        Age: 'Under 5 Years',
        Population: 72083
      }
    ],
    line: {
      style: {
        lineDash: [0],
        lineWidth: 2,
        stroke: '#000'
      }
    },
    label: {
      position: 'middle',
      text: 'xxxx',
      labelBackground: {
        style: {
          fill: '#fff',
          fillOpacity: 1,
          stroke: '#000',
          lineWidth: 1,
          cornerRadius: 4
        }
      },
      style: {
        fill: '#000'
      }
    },
    endSymbol: {
      size: 12,
      refX: -6
    },
    offsetY: -30,
    interactive: true,
    name: 'growthMarkLine'
  };
}
