---
category: examples
group: morphing
title: 柱状图、散点图间切换的全局动画
keywords: animation,morphing,bar,scatter,barChart,scatterChart
order: 42-1
cover: http://tosv.byted.org/obj/bit-cloud/morph-bar-to-scatter.gif
option: commonChart#series-bar.animationUpdate
---

# 柱状图、散点图间切换的全局动画

全局动画在一定场景下，可以增强观察者对数据变化的追踪，比如下面这个例子中，散点向柱子的融合变得更加生动。

## 关键配置

- `morph.morphKey`: 指定不同图表的系列之间的关联关系；拥有相同 `morphKey` 的系列数据变化将被自动分析。
- `morph.morphElementKey`：指定拥有关联关系的系列数据的匹配字段。

## 代码演示

```javascript livedemo
function calculateAverage(data, dim) {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += data[i][dim];
  }
  return (total /= data.length);
}

function generateData(type) {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({ x: i, y: Math.random(), type });
  }
  return data;
}
const DataA = generateData('A');

const DataB = generateData('B');

const barSpec = {
  type: 'common',
  series: [
    {
      type: 'bar',
      data: { values: [{ value: calculateAverage(DataA, 'y'), type: 'A' }] },
      xField: 'type',
      yField: 'value',
      morph: {
        morphKey: 'A'
      }
    },
    {
      type: 'bar',
      data: { values: [{ value: calculateAverage(DataB, 'y'), type: 'B' }] },
      xField: 'type',
      yField: 'value',
      morph: {
        morphKey: 'B'
      }
    }
  ],
  axes: [
    { orient: 'left', type: 'linear', max: 1 },
    { orient: 'bottom', type: 'band' }
  ]
};

const scatterSpec = {
  type: 'common',
  series: [
    {
      type: 'scatter',
      data: { values: DataA },
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      morph: {
        morphKey: 'A',
        morphElementKey: 'type'
      }
    },
    {
      type: 'scatter',
      data: { values: DataB },
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      morph: {
        morphKey: 'B',
        morphElementKey: 'type'
      }
    }
  ],
  axes: [
    { orient: 'left', type: 'linear', zero: false, max: 1 },
    { orient: 'bottom', type: 'band' }
  ]
};


const specs = [barSpec, scatterSpec];

const vchart = new VChart(specs[0], { dom: CONTAINER_ID });

vchart.renderAsync().then(() => {
    let count = 1;
    setInterval(() => {
      vchart.updateSpec(specs[count % 2]);
      count++;
    }, 3000);
});
```

## 相关教程

[散点图](link)
