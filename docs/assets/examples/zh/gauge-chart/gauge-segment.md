---
category: examples
group: gauge
title: 使用gauge系列声明仪表图
keywords: gauge,comparison,circle
order: 15-4
cover: /vchart/preview/gauge-segment_1.4.0.png
option: gaugeChart
---

# 使用 gauge 系列声明仪表图

## 关键配置

- `categoryField`、`valueField` 属性分别用于指定数据类别与指针角度字段
- `innerRadius`、`outerRadius` 属性用于指定仪表盘的内外半径
- `startAngle`、`endAngle` 属性用于指定仪表盘的开始、结束角度
- `gauge`属性可以配置[仪表图的背景板系列](../../option/gaugeChart#gauge)

## 代码演示

```javascript livedemo
const spec = {
  type: 'gauge',
  data: [
    {
      id: 'pointer',
      values: [
        {
          type: 'A',
          value: 0.6
        }
      ]
    },
    {
      id: 'segment',
      values: [
        {
          type: 'level1',
          value: 0.4
        },
        {
          type: 'level2',
          value: 0.6
        },
        {
          type: 'level3',
          value: 0.8
        }
      ]
    }
  ],
  gauge: {
    type: 'gauge',
    dataIndex: 1,
    categoryField: 'type',
    valueField: 'value',
    seriesField: 'type',
    segment: {
      style: {
        cornerRadius: 10
      }
    }
  },
  pointer: {
    style: {
      fill: '#666666'
    }
  },
  categoryField: 'type',
  valueField: 'value',
  outerRadius: 0.8,
  innerRadius: 0.5,
  startAngle: -180,
  endAngle: 0,
  axes: [{ type: 'linear', orient: 'angle', grid: { visible: false } }]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[仪表图](link)
