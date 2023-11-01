---
category: examples
group: bar chart
title: 带条形背景的条形图
keywords: barChart,comparison,distribution,rectangle,composition,rank
cover: /vchart/preview/bar-background_1.6.0.png
option: barChart
---

# 带条形背景的条形图

条形图和柱状图都可以设置 bar 图元的背景图元 barBackground。

## 关键配置

- 在 `xField` 属性上设置 x 轴的映射字段以及**分组字段**。
- `seriesField` 属性声明了颜色映射字段。
- `stack` 属性声明为 true 用来配置堆叠，会根据 `seriesField` 属性声明的字段进行堆叠
- `axes` 属性中为位于 `bottom` 位置的坐标轴轴线开启配置 `domainLine.onZero`，将轴线调整到纵轴数值 0 处
- `barBackground` 属性为背景图元的设置，设置项与 `bar` 相同。背景图元默认不显示

## 代码演示

```javascript livedemo
const spec = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        {
          date: '2019-08-29',
          group: 'Cake',
          value: 154,
          stack: 'Dessert'
        },
        {
          date: '2019-08-29',
          group: 'Bread',
          value: 378,
          stack: 'Dessert'
        },
        {
          date: '2019-08-29',
          group: 'Tea',
          value: 103,
          stack: 'Drink'
        },
        {
          date: '2019-08-29',
          group: 'Coffee',
          value: 310,
          stack: 'Drink'
        },
        {
          date: '2019-08-29',
          group: 'Rib',
          value: 419,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-29',
          group: 'Crayfish',
          value: 810,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-30',
          group: 'Cake',
          value: 153,
          stack: 'Dessert'
        },
        {
          date: '2019-08-30',
          group: 'Bread',
          value: 398,
          stack: 'Dessert'
        },
        {
          date: '2019-08-30',
          group: 'Tea',
          value: 105,
          stack: 'Drink'
        },
        {
          date: '2019-08-30',
          group: 'Coffee',
          value: 298,
          stack: 'Drink'
        },
        {
          date: '2019-08-30',
          group: 'Rib',
          value: 416,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-30',
          group: 'Crayfish',
          value: 796,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-31',
          group: 'Cake',
          value: 151,
          stack: 'Dessert'
        },
        {
          date: '2019-08-31',
          group: 'Bread',
          value: 408,
          stack: 'Dessert'
        },
        {
          date: '2019-08-31',
          group: 'Tea',
          value: 110,
          stack: 'Drink'
        },
        {
          date: '2019-08-31',
          group: 'Coffee',
          value: 302,
          stack: 'Drink'
        },
        {
          date: '2019-08-31',
          group: 'Rib',
          value: 400,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-31',
          group: 'Crayfish',
          value: 811,
          stack: 'Meat dishes'
        },
        {
          date: '2019-09-01',
          group: 'Cake',
          value: 135,
          stack: 'Dessert'
        },
        {
          date: '2019-09-01',
          group: 'Bread',
          value: 407,
          stack: 'Dessert'
        },
        {
          date: '2019-09-01',
          group: 'Tea',
          value: 944,
          stack: 'Drink'
        },
        {
          date: '2019-09-01',
          group: 'Coffee',
          value: 298,
          stack: 'Drink'
        },
        {
          date: '2019-09-01',
          group: 'Rib',
          value: 343,
          stack: 'Meat dishes'
        },
        {
          date: '2019-09-01',
          group: 'Crayfish',
          value: 771,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-29',
          group: 'Cake(last week)',
          value: -365,
          stack: 'Dessert'
        },
        {
          date: '2019-08-29',
          group: 'Bread(last week)',
          value: -235,
          stack: 'Dessert'
        },
        {
          date: '2019-08-29',
          group: 'Tea(last week)',
          value: -832,
          stack: 'Drink'
        },
        {
          date: '2019-08-29',
          group: 'Coffee(last week)',
          value: -610,
          stack: 'Drink'
        },
        {
          date: '2019-08-29',
          group: 'Rib(last week)',
          value: -305,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-29',
          group: 'Crayfish(last week)',
          value: -462,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-30',
          group: 'Cake(last week)',
          value: -522,
          stack: 'Dessert'
        },
        {
          date: '2019-08-30',
          group: 'Bread(last week)',
          value: -258,
          stack: 'Dessert'
        },
        {
          date: '2019-08-30',
          group: 'Tea(last week)',
          value: -689,
          stack: 'Drink'
        },
        {
          date: '2019-08-30',
          group: 'Coffee(last week)',
          value: -688,
          stack: 'Drink'
        },
        {
          date: '2019-08-30',
          group: 'Rib(last week)',
          value: -106,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-30',
          group: 'Crayfish(last week)',
          value: -159,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-31',
          group: 'Cake(last week)',
          value: -352,
          stack: 'Dessert'
        },
        {
          date: '2019-08-31',
          group: 'Bread(last week)',
          value: -760,
          stack: 'Dessert'
        },
        {
          date: '2019-08-31',
          group: 'Tea(last week)',
          value: -332,
          stack: 'Drink'
        },
        {
          date: '2019-08-31',
          group: 'Coffee(last week)',
          value: -368,
          stack: 'Drink'
        },
        {
          date: '2019-08-31',
          group: 'Rib(last week)',
          value: -222,
          stack: 'Meat dishes'
        },
        {
          date: '2019-08-31',
          group: 'Crayfish(last week)',
          value: -205,
          stack: 'Meat dishes'
        },
        {
          date: '2019-09-01',
          group: 'Cake(last week)',
          value: -471,
          stack: 'Dessert'
        },
        {
          date: '2019-09-01',
          group: 'Bread(last week)',
          value: -535,
          stack: 'Dessert'
        },
        {
          date: '2019-09-01',
          group: 'Tea(last week)',
          value: -319,
          stack: 'Drink'
        },
        {
          date: '2019-09-01',
          group: 'Coffee(last week)',
          value: -363,
          stack: 'Drink'
        },
        {
          date: '2019-09-01',
          group: 'Rib(last week)',
          value: -243,
          stack: 'Meat dishes'
        },
        {
          date: '2019-09-01',
          group: 'Crayfish(last week)',
          value: -129,
          stack: 'Meat dishes'
        }
      ]
    }
  ],
  direction: 'horizontal',
  xField: 'value',
  yField: ['date', 'stack'],
  seriesField: 'group',
  stack: true,
  barBackground: {
    visible: true
  },
  axes: [
    {
      orient: 'top',
      title: {
        visible: true,
        text: 'Week-on-week (sales)'
      },
      tick: {
        tickCount: 10
      }
    },
    {
      orient: 'left',
      domainLine: {
        onZero: true // Axis baseline is at value 0
      }
    }
  ],
  legends: {
    visible: true,
    orient: 'right',
    position: 'end'
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 关键配置

## 相关教程

[柱状图](link)
