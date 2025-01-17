---
category: examples
group: pictogram chart
title: 商场业态示意图
keywords: pictogramChart, space
order: 26-0
cover: /vchart/preview/pictogram-mall_1.13.0.png
option: pictogramChart
---

# 象形图-商场业态示意图

象形图是一种数据可视化形式，它通过使用图形符号（通常是 SVG 格式）来表示数据中的具体值或类别。这种图表结合了图形艺术和数据分析，使得信息更具视觉吸引力和直观性。

## 关键配置

- 在 SVG 文件中，为图元配置 `name` 属性，则在图表配置中可以通过 `name` 配置指定图元样式；
- 通过 `VChart.registerSVG` 接口来注册 svg 资源；
- `svg` 属性声明为注册的 svg 名称；
- 使用 `tooltip` 配置来实现鼠标悬停时显示名称。

## Code Demo

```javascript livedemo
/** --Add the following code when using in business context-- */
// When using in business context, please additionally import
// import { registerPictogramChart } from '@visactor/vchart';
// registerPictogramChart();
/** --Add the above code when using in business context-- */
VCHART_MODULE.registerPictogramChart();
/** --Delete the above code when using in business context-- */

const response = await fetch('https://raw.githubusercontent.com/EchoChenGithub/pictures/refs/heads/main/mallmap-color2.svg');
const shape = await response.text();

const spec = {
    type: 'pictogram',
    data: {
        id: 'data',
        values: [
          { name: 'Starbucks', value: 'food_and_dining' },
          { name: 'Foot Locker', value: 'apparel_and_shoes' },
          { name: 'Dave and Busters', value: 'entertainment' },
          { name: 'Best Buy', value: 'electronics' },
          { name: 'Kay Jewelers', value: 'jewelry' },
          { name: 'Target', value: 'shopping' },
          { name: 'McDonalds', value: 'food_and_dining' },
          { name: 'Nike Store', value: 'apparel_and_shoes' },
          { name: 'AMC Theatres', value: 'entertainment' },
          { name: 'Apple Store', value: 'electronics' },
          { name: 'Tiffany Co', value: 'jewelry' },
          { name: "Macy's", value: 'shopping' },
          { name: 'Chipotle', value: 'food_and_dining' },
          { name: 'Old Navy', value: 'apparel_and_shoes' },
          { name: 'GameStop', value: 'entertainment' },
          { name: 'Samsung Store', value: 'electronics' },
          { name: 'Pandora', value: 'jewelry' },
          { name: 'Walmart', value: 'shopping' },
          { name: 'Subway', value: 'food_and_dining' },
          { name: 'Maintenance', value: 'infrastructure' },
          { name: 'Restroom', value: 'infrastructure' },
          { name: 'Management', value: 'infrastructure' },
          { name: 'Adidas Store', value: 'apparel_and_shoes' },
          { name: 'Round 1', value: 'entertainment' },
          { name: 'HP Store', value: 'electronics' },
          { name: 'Zales Jewelers', value: 'jewelry' },
          { name: 'TJ Maxx', value: 'shopping' },
          { name: 'Pizza Hut', value: 'food_and_dining' },
          { name: 'HM', value: 'apparel_and_shoes' },
          { name: 'Regal Cinemas', value: 'entertainment' },
          { name: 'Microsoft Store', value: 'electronics' },
          { name: 'Jared', value: 'jewelry' },
          { name: "Kohl's", value: 'shopping' },
          { name: 'Panera Bread', value: 'food_and_dining' },
          { name: 'Gap', value: 'apparel_and_shoes' },
          { name: 'Barnes and Noble', value: 'entertainment' },
          { name: 'Radio Shack', value: 'electronics' },
          { name: "Claire's", value: 'jewelry' },
          { name: 'JCPenney Outlet', value: 'shopping' },
          { name: 'Taco Bell', value: 'food_and_dining' },
          { name: 'Express', value: 'apparel_and_shoes' },
          { name: 'Chuck E Cheese', value: 'entertainment' },
          { name: 'GameStop', value: 'electronics' },
          { name: 'Swarovski', value: 'jewelry' },
          { name: 'HomeGoods', value: 'shopping' },
          { name: 'Burger King', value: 'food_and_dining' },
          { name: 'American Eagle', value: 'apparel_and_shoes' },
          { name: 'Sky Zone', value: 'entertainment' },
          { name: 'Verizon', value: 'electronics' },
          { name: 'Sephora', value: 'jewelry' },
          { name: 'Best Buy Mobile', value: 'shopping' },
          { name: 'Five Guys', value: 'food_and_dining' },
          { name: "Levi's", value: 'apparel_and_shoes' },
          { name: 'Arcade', value: 'entertainment' },
          { name: 'GameStop', value: 'electronics' },
          { name: 'Helzberg Diamonds', value: 'jewelry' },
          { name: 'Marshalls', value: 'shopping' },
          { name: 'Chick-fil-A', value: 'food_and_dining' },
          { name: 'Banana Republic', value: 'apparel_and_shoes' },
          { name: 'Main Event', value: 'entertainment' },
          { name: 'Frys Electronics', value: 'electronics' },
          { name: 'JCPenney Jewelers', value: 'jewelry' },
          { name: 'Burlington', value: 'shopping' },
          { name: 'Dunkin Donuts', value: 'food_and_dining' },
          { name: 'Forever 21', value: 'shopping' },
          { name: 'Mall Kiosk 1', value: 'shopping' },
          { name: 'Mall Kiosk 2', value: 'food_and_dining' },
          { name: 'Mall Kiosk 3', value: 'apparel_and_shoes' },
          { name: 'Mall Kiosk 4', value: 'entertainment' },
          { name: 'Mall Kiosk 5', value: 'electronics' },
          { name: 'Mall Kiosk 6', value: 'jewelry' },
          { name: 'Mall Kiosk 7', value: 'shopping' },
          { name: 'JCPenney', value: 'apparel_and_shoes' },
          { name: 'Belk', value: 'apparel_and_shoes' },
          { name: 'Bealls', value: 'apparel_and_shoes' },
          { name: 'Kmart', value: 'shopping' },
          { name: 'AMC Theatres', value: 'entertainment' },
          { name: 'Sears', value: 'shopping' }
        ]
      },
    color: {
        specified: {
          food_and_dining: '#A52A2A',   //  棕红色 (Brown Red)
          apparel_and_shoes: '#228B22',  //  森林绿 (Forest Green)
          entertainment: '#4682B4',   // 钢青色 (Steel Blue)
          jewelry: '#9400D3',        // 深紫罗兰 (Dark Violet)
          electronics: '#DAA520', // 金麒麟色 (Goldenrod)
          shopping: '#008B8B',    // 深青色 (Dark Cyan)
          infrastructure: '#556B2F',  // 暗橄榄绿 (Dark Olive Green)
          undefined: 'white',
        },
        field: 'value'
      },
    seriesField: 'value',
    nameField: 'name',
    svg: 'mall',
    pictogram: {
        style: {
          fill: {
            scale: 'color',
            field: 'value'
          }
        },
        state: {
            legend_hover_reverse: {
                fill: '#ccc',
            }
        }
      },

    title: {
        text: 'Shopping Mall Tenant Layout'
    },
    legends: [
        {
          orient: 'top',
          position: 'middle',
          padding: {
            bottom: 12
          },
          visible: true,
          field: 'value',
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

VChart.registerSVG('mall', shape);

const vchart = new VChart(spec, { dom: CONTAINER_ID });

vchart.on('legendItemHover', e => {
    const hoveredName = e?.value?.data?.label;
    if (hoveredName) {
        vchart.updateState({
            legend_hover_reverse: {
                filter: d => {
                    // True - Grey
                    return d.data?.value && d.data.value !== hoveredName;
                }
            }
        });
    }
});
vchart.on('legendItemUnHover', e => {
    vchart.updateState({
        legend_hover_reverse: {
            filter: d => false
        }
    });
});

vchart.renderSync();

```

## Related Tutorials

[PictogramChart](link)
