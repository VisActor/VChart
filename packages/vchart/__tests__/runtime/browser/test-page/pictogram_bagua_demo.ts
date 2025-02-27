/** --Add the following code when using in business context-- */
// 业务使用时需额外引入
import { registerPictogramChart } from '@visactor/vchart';
registerPictogramChart();
import VChart from '../../../../src';
/** --Add the above code when using in business context-- */
// VCHART_MODULE.registerPictogramChart();
/** --Delete the above code when using in business context-- */

// 加载本地SVG文件（确保路径正确）
const response = await fetch('D:\\xilzy\\openSource\\ByteDance\\VisActor\\pictogram-bagua.svg');
const shape = await response.text();

const spec = {
  type: 'pictogram',
  data: {
    id: 'data',
    // 五行数据配置
    values: [
      { name: 'Metal', value: '金' },
      { name: 'Wood', value: '木' },
      { name: 'Water', value: '水' },
      { name: 'Fire', value: '火' },
      { name: 'Earth', value: '土' }
    ]
  },
  region: [
    {
      roam: { blank: true }
    }
  ],
  seriesField: 'name',
  nameField: 'name',
  valueField: 'value',
  svg: 'bagua', // 使用自定义SVG标识
  color: {
    specified: {
      // 五行传统配色（可根据SVG实际分区调整）
      Metal: '#D4AF37', // 金色
      Wood: '#009A00', // 木绿
      Water: '#0070FF', // 水蓝
      Fire: '#FE3E00', // 火红
      Earth: '#8B4513', // 土褐
      undefined: '#FFFFFF' // 背景白
    }
  },
  interactions: [
    {
      type: 'element-active-by-legend',
      filterField: 'name'
    }
  ],
  pictogram: {
    style: {
      fill: {
        scale: 'color',
        field: 'name'
      }
    },
    state: {
      active: {
        fillOpacity: 0.8,
        stroke: '#333',
        lineWidth: 2
      },
      hover: {
        fillOpacity: 0.9,
        stroke: '#666',
        lineWidth: 1
      }
    }
  },
  title: {
    text: '五行八卦能量分布图',
    textStyle: {
      fontSize: 18,
      fill: '#333'
    }
  },
  legends: {
    orient: 'top',
    item: {
      label: {
        style: {
          fill: '#666',
          fontSize: 12
        }
      }
    }
  }
};

// 注册自定义SVG（标识符需与spec.svg字段对应）
VChart.registerSVG('bagua', shape);

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// 控制台调试用，实际部署时删除
window['vchart'] = vchart;
