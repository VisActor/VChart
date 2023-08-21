---
category: examples
group: pie
title: Basic Pie Chart
keywords: pieChart,comparison,composition,proportion,circle
order: 6-0
cover: https://tosv.byted.org/obj/bit-cloud/c0de7ff0a101bd4cb25c81707.png
option: pieChart
---

# Basic Pie Chart

A pie chart, also known as a pie-shaped chart, is a circular statistical chart divided into several sectors, used to describe the relative relationship between quantity, frequency, or percentage. In a pie chart, the length of each sector's arc (as well as its central angle and area) is proportional to the amount it represents. These sectors combined make up a complete circle.

## When to use

1. Display the proportion of different categories of data.
2. Compare the size of different categories, with a relatively noticeable difference in category values.

## Key configurations

- `categoryField` and `valueField` attributes are used to specify the pie chart category and sector angle fields, respectively
- `innerRadius` and `outerRadius` attributes are used to specify the inner and outer radius of the sector

## Code demo

```javascript livedemo
const spec = {
  type: 'pie',
  data: [
    {
      id: 'id0',
      values: [
        { type: 'oxygen', value: '46.60' },
        { type: 'silicon', value: '27.72' },
        { type: 'aluminum', value: '8.13' },
        { type: 'iron', value: '5' },
        { type: 'calcium', value: '3.63' },
        { type: 'sodium', value: '2.83' },
        { type: 'potassium', value: '2.59' },
        { type: 'others', value: '3.5' }
      ]
    }
  ],
  outerRadius: 0.8,
  valueField: 'value',
  categoryField: 'type',
  title: {
    visible: true,
    text: 'Statistics of Surface Element Content'
  },
  legends: {
    visible: true,
    orient: 'left'
  },
  label: {
    visible: true
  },
  tooltip: {
    mark: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## Related tutorials

[Pie chart](link)