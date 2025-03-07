import { default as VChart, registerPictogramChart } from '../../../../src/index';
registerPictogramChart();

// 加载本地SVG文件（确保路径正确）
const response = await fetch(
  'https://raw.githubusercontent.com/xilzy/images/refs/heads/main/pictogram-bagua-name3.svg'
);
const shape = await response.text();

// 定义容器ID常量（与HTML中的id一致）
const CONTAINER_ID = 'chartContainer';

const spec = {
  type: 'pictogram',
  data: {
    id: 'data',
    // 八卦数据配置,中心阴阳可分为正负两类，外围八卦对应五行属性分类
    values: [
      { name: 'yin', value: '阴', category: 'positive' },
      { name: 'yang', value: '阳', category: 'negative' },
      { name: 'yao_yin', value: '爻阴', category: 'positive' },
      { name: 'yao_yang', value: '爻阳', category: 'negative' },
      { name: 'tian', value: '天', category: 'jin' },
      { name: 'feng', value: '风', category: 'mu' },
      { name: 'shui', value: '水', category: 'shui' },
      { name: 'shan', value: '山', category: 'tu' },
      { name: 'di', value: '地', category: 'tu' },
      { name: 'lei', value: '雷', category: 'mu' },
      { name: 'huo', value: '火', category: 'huo' },
      { name: 'ze', value: '泽', category: 'jin' },
      { name: 'qian', value: '乾', category: 'jin' },
      { name: 'xun', value: '巽', category: 'mu' },
      { name: 'kan', value: '坎', category: 'shui' },
      { name: 'gen', value: '艮', category: 'tu' },
      { name: 'kun', value: '坤', category: 'tu' },
      { name: 'zhen', value: '震', category: 'mu' },
      { name: 'li', value: '离', category: 'huo' },
      { name: 'dui', value: '兑', category: 'jin' },
      { name: 'line', category: 'background' }
    ]
  },
  region: [
    {
      roam: { blank: true }
    }
  ],
  seriesField: 'category',
  nameField: 'name',
  valueField: 'value',
  svg: 'bagua', // 使用自定义SVG标识
  color: {
    specified: {
      // 阴阳元素配色
      positive: '#FFFFFF', // 阳用纯白
      negative: '#000000', // 阴用纯黑

      // 五行元素配色（根据《周易》五行归属）
      jin: '#FFFF00', // 金-乾属金（琥珀金）
      mu: '#00FF00', // 风-巽属木（翠竹绿）
      shui: '#0000FF', // 水-坎属水（靛青）
      huo: '#FF0000', // 火-离属火（朱砂红）
      tu: '#964B00', // 土-坤属土（同山色）
      background: '#FFFFFF' // 背景色
    },
    // 颜色映射的字段为类别
    field: 'category'
  },
  //交互配置
  interactions: [
    {
      type: 'element-active-by-legend'
    }
  ],
  //象形图配置
  pictogram: {
    style: {
      fill: {
        scale: 'color',
        field: 'category'
      },
      stroke: '#000000', // 边框颜色为黑色
      lineWidth: 2 // 确保有描边宽度
    },
    state: {
      active: {
        fillOpacity: 0.8,
        stroke: {
          //激活状态的颜色设置
          scale: 'color',
          field: 'category'
        },
        lineWidth: 2
      },
      hover: {
        fillOpacity: 0.8,
        stroke: {
          //悬浮状态的颜色设置
          scale: 'color',
          field: 'category'
        },
        lineWidth: 1
      }
    }
  },
  // 标题配置
  title: {
    text: '太极八卦图',
    textStyle: {
      fontSize: 18,
      fill: '#333'
    }
  },
  // 图例配置
  legends: {
    orient: 'top',
    top: '5%', // 将图例向上移动 5% 的位置
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
