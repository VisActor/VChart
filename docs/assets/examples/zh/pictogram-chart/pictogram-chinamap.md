---
category: examples
group: pictogram chart
title: 中国地图吃辣程度一览象形图       
keywords: pictogramChart,map,comparison,china
order: 26-6
cover: https://cdn.jsdelivr.net/gh/UC-web291/picture_storing/chinamapv4.gif
option: pictogramChart
---

# 中国地图象形图--中国省份吃辣程度一览

由 Qian_Shark 贡献

通过象形图展示中国各地区的分类信息，可根据吃辣的不同类别进行颜色映射，从强到弱颜色越来越骗冷调，同时支持图例悬停交互显示省份信息。

## 关键配置

- 在 SVG 文件中，为图元配置 name 属性，则在图表配置中可以通过 name 配置指定图元样式；
- 通过 `VChart.registerSVG` 接口来注册 svg 资源；
- `svg` 属性声明为注册的 svg 名称
- `type: pictogram` 属性声明为象形图
- `data` 属性定义数据来源
- `color` 属性进行颜色映射配置
- `seriesField` 和 `nameField` 分别声明系列字段和名称字段
- `svg` 属性指定使用的 SVG 图形
- `pictogram.style` 属性声明象形图元的样式
- 监听 `legendItemHover` 和 `legendItemUnHover` 事件实现图例悬停交互

## 代码演示

```javascript livedemo
/** --Add the following code when using in business context-- */
// When using in business context, please additionally import
// import { registerPictogramChart } from '@visactor/vchart';
// registerPictogramChart();
/** --Add the above code when using in business context-- */
VCHART_MODULE.registerPictogramChart();
/** --Delete the above code when using in business context-- */
const response = await fetch('https://cdn.jsdelivr.net/gh/UC-web291/picture_storing/chinamap.svg');
const shape = await response.text();
// 定义地图数据
const chinamap_data = [
  { id: 'CN-11', name: 'Beijing', category: 'gold' },
  { id: 'CN-12', name: 'Tianjin', category: 'gold' },
  { id: 'CN-13', name: 'Hebei', category: 'gold' },
  { id: 'CN-14', name: 'Shanxi', category: 'diamond' },
  { id: 'CN-15', name: 'Inner Mongolia', category: 'diamond' },
  { id: 'CN-21', name: 'Liaoning', category: 'diamond' },
  { id: 'CN-22', name: 'Jilin', category: 'diamond' },
  { id: 'CN-23', name: 'Heilongjiang', category: 'diamond' },
  { id: 'CN-31', name: 'Shanghai', category: 'silver' },
  { id: 'CN-32', name: 'Jiangsu', category: 'silver' },
  { id: 'CN-33', name: 'Zhejiang', category: 'silver' },
  { id: 'CN-34', name: 'Anhui', category: 'silver' },
  { id: 'CN-35', name: 'Fujian', category: 'silver' },
  { id: 'CN-36', name: 'Jiangxi', category: 'diamond' },
  { id: 'CN-37', name: 'Shandong', category: 'gold' },
  { id: 'CN-41', name: 'Henan', category: 'gold' },
  { id: 'CN-42', name: 'Hubei', category: 'diamond' },
  { id: 'CN-43', name: 'Hunan', category: 'MVP' },
  { id: 'CN-44', name: 'Guangdong', category: 'silver' },
  { id: 'CN-46', name: 'Hainan', category: 'bronze' },
  { id: 'CN-50', name: 'Chongqing', category: 'MVP' },
  { id: 'CN-51', name: 'Sichuan', category: 'MVP' },
  { id: 'CN-52', name: 'Guizhou', category: 'MVP' },
  { id: 'CN-53', name: 'Yunnan', category: 'diamond' },
  { id: 'CN-54', name: 'Tibet', category: 'bronze' },
  { id: 'CN-61', name: 'Shaanxi', category: 'gold' },
  { id: 'CN-62', name: 'Gansu', category: 'MVP' },
  { id: 'CN-63', name: 'Qinghai', category: 'bronze' },
  { id: 'CN-64', name: 'Ningxia', category: 'bronze' },
  { id: 'CN-65', name: 'Xinjiang', category: 'MVP' },
  { id: 'CN-91', name: 'Hong Kong', category: 'bronze' },
  { id: 'CN-92', name: 'Macau', category: 'bronze' },
  { id: 'CN-71', name: 'Taiwan', category: 'bronze' },
  { id: 'CN-45', name: 'Guangxi', category: 'gold' }
]
// 定义图表配置对象
const spec = {
  // 图表类型为象形图
  type: 'pictogram',
  data: {
    // 数据的唯一标识符
    id: 'data',
    // 数据的值
    values: chinamap_data,
  },
  color: {
    specified: {
      // 钻石--粉色
      diamond: 'pink',
      // 黄金--橙色
      gold: 'orange',
      // 白银--黄色
      silver: 'yellow',
      // 青铜--绿色
      bronze: 'green',
      // 大师--红色
      MVP: 'red',
      // 未定义类别的颜色为白色
      undefined: 'white',
    },
    // 颜色映射的字段为类别
    field: 'category'
  },
  // 系列字段为类别
  seriesField: 'category',
  // 名称字段为名称
  nameField: 'id',
  valueField: 'name',
  // 使用的 SVG 图形名称
  svg: 'chinamap',
  pictogram: {
    style: {
      fill: {
        // 填充颜色使用 color 颜色映射，字段为类别
        scale: 'color',
        field: 'category'
      }
    },
    state: {
      // 图例悬停时的填充颜色为灰色
      legend_hover_reverse: {
        fill: '#ccc',
      }
    }
  },
  // 图表标题
  title: {
    text: 'Spicy food in China at a glance'
  },
  legends: [
    {
      orient: 'top',
      position: 'middle',
      padding: {
        bottom: 12
      },
      visible: true,
      field: 'category',
      filter: false,
      select: false,
      data: items => {
        return items.map(item => {
          item.shape.outerBorder = {
            stroke: item.shape.fill,
            distance: 2,
            lineWidth: 1
          };
          return item;
        });
      },
    }
  ],
};

// VChart.registerPictogramChart();
// VChart.default.registerSVG('chinamap', shape);

// 注册 SVG 图形资源，名称为 chinamap，图形数据为 shape
VChart.registerSVG('chinamap', shape);

// 创建 VChart 实例，传入图表配置对象和容器 ID
const vchart = new VChart(spec, { dom: CONTAINER_ID });

// 监听图例项悬停事件
vchart.on('legendItemHover', e => {
  // 获取悬停的图例项名称
  const hoveredName = e?.value?.data?.label;
  if (hoveredName) {
    // 更新图表状态，将未悬停的图例项颜色设置为灰色
    vchart.updateState({
      legend_hover_reverse: {
        filter: d => {
          // 查找当前数据项的类别
          const category = chinamap_data.find(chinamap_data => chinamap_data.id === d.data?.id)?.category;
          // 如果类别存在且不等于悬停的图例项名称，则返回 true，否则返回 false
          return category && category!== hoveredName;
        }
      }
    });
  }
});

// 监听图例项取消悬停事件
vchart.on('legendItemUnHover', e => {
  // 更新图表状态，将所有图例项颜色恢复为原始颜色
  vchart.updateState({
    legend_hover_reverse: {
      filter: d => false
    }
  });
});

// 渲染图表
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```
## 相关教程

[象形图](link)
