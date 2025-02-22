---
category: examples
group: pictogram chart
title: Chinese Map Pictogram --- Contributed by [Qian_Shark]
keywords: pictogramChart,map,comparison,china
order: 1-13
cover: https://github.com/UC-web291/picture_storing/blob/main/chinamap.png
option: pictogramChart
---

# Chinese Map Pictogram - A Glance at the Spiciness Level in Chinese Provinces
This pictogram chart shows the classification information of different regions in China. The colors are mapped according to different spiciness categories, with warmer colors indicating a higher tolerance for spicy food and cooler colors indicating a lower tolerance. It also supports legend hover interaction to display provincial information.

## Key Configurations
- In the SVG file, configure the name attribute for the graphic elements. Then, in the chart configuration, you can specify the element styles through the name configuration.
- Register SVG resources using the VChart.registerSVG interface.
- Declare the registered SVG name using the svg attribute.
- Declare the chart type as a pictogram using the type: pictogram attribute.
- Define the data source using the data attribute.
- onfigure color mapping using the color attribute.
- Declare the series field and name field using the seriesField and nameField attributes respectively.
- Specify the SVG graphic to use with the svg attribute.
- Declare the styles of the pictogram elements using the pictogram.style attribute.
- Listen for the legendItemHover and legendItemUnHover events to implement legend hover interaction.

## Code Demonstration

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
>>>>>>> docs: add custom pictogram-chinamap demo and related docs
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
      ];
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

      VChart.registerPictogramChart();
      VChart.default.registerSVG('chinamap', shape);
      const vchart = new VChart.default(spec, { dom: 'vchart' });
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
       
