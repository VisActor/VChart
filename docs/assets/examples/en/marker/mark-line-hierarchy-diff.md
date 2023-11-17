---
category: examples
group: marker
title: Hierarchy diff markLine
keywords: marker,barChart
order: 33-11
cover: /vchart/preview/mark-line-hierarchy-diff_1.7.0.png
option: barChart#markLine
---

# Hierarchy diff markLine

Using the `'type-step'` type annotation of `markLine`, you can draw hierarchical difference annotations.

## Key configuration

- Declare the `markLine` attribute
- configure `type: 'type-step'`
- Configure data points: `coordinates`
- Configure `line.style` as an array to realize multi-segment style annotation of lines

## Demo source

```javascript livedemo
const spec = {
  type: 'bar',
  padding: [12, 80, 12, 12],
  data: [
    {
      id: 'barData',
      values: [
        { type: 'Autocracies', year: '1930', value: 129 },
        { type: 'Autocracies', year: '1940', value: 133 },
        { type: 'Autocracies', year: '1950', value: 130 },
        { type: 'Autocracies', year: '1960', value: 126 },
        { type: 'Autocracies', year: '1970', value: 117 },
        { type: 'Autocracies', year: '1980', value: 114 },
        { type: 'Autocracies', year: '1990', value: 111 },
        { type: 'Autocracies', year: '2000', value: 89 },
        { type: 'Autocracies', year: '2010', value: 80 },
        { type: 'Autocracies', year: '2018', value: 80 },
        { type: 'Democracies', year: '1930', value: 22 },
        { type: 'Democracies', year: '1940', value: 13 },
        { type: 'Democracies', year: '1950', value: 25 },
        { type: 'Democracies', year: '1960', value: 29 },
        { type: 'Democracies', year: '1970', value: 38 },
        { type: 'Democracies', year: '1980', value: 41 },
        { type: 'Democracies', year: '1990', value: 57 },
        { type: 'Democracies', year: '2000', value: 87 },
        { type: 'Democracies', year: '2010', value: 98 },
        { type: 'Democracies', year: '2018', value: 99 }
      ]
    }
  ],
  xField: 'year',
  yField: 'value',
  seriesField: 'type',
  stack: true,
  legends: {
    visible: true,
    orient: 'top',
    position: 'start'
  },
  markLine: {
    type: 'type-step',
    coordinates: [
      { type: 'Autocracies', year: '1930', value: 129 },
      { type: 'Autocracies', year: '2018', value: 80 }
    ],
    connectDirection: 'right',
    expandDistance: 80,
    line: {
      multiSegment: true,
      mainSegmentIndex: 1,
      style: [
        {
          lineDash: [2, 2],
          stroke: '#000',
          lineWidth: 2
        },
        {
          stroke: '#000',
          lineWidth: 2
        },
        {
          lineDash: [2, 2],
          stroke: '#000',
          lineWidth: 2
        }
      ]
    },
    label: {
      position: 'middle',
      text: `${(((80 - 129) / 80) * 100).toFixed(0)}%`,
      labelBackground: {
        padding: { left: 4, right: 4, top: 4, bottom: 4 },
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
      refX: -4
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```
