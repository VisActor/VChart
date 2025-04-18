---
category: examples
group: box plot
title: 分组箱型图
keywords: boxPlot,distribution,comparison,strip
order: 5-1
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/box-plot/grouped-box-plot.png
option: boxPlotChart
---

# 分组箱型图

该图展示了 2021 年全球各个国家 GDP 总量（以 10 为底取对数处理），并按照发展中国家和发达国家分组。

## 何时使用

1. 用于反映原始数据分布的特征，展示数据的最大最小值、中位数与上下四分位数、异常值。
2. 比较多个组之间的数据分布。

## 关键配置

- `xField` 属性指定用于分组的字段，支持字符串和数组。在这个例子中，根据数据中的 x 和 group 字段进行分组
- `seriesField`属性指定用于区分不同系列的字段
- `color` 属性指定每个系列的颜色

## 代码演示

```javascript livedemo
const data = [
  {
    name: 'boxPlot',
    values: [
      {
        x: 'Sub-Saharan Africa',
        y1: 9.16270124,
        y2: 10.07530816,
        y3: 10.09027907,
        y4: 10.27579542,
        y5: 11.62222959,
        group: 'High income'
      },
      {
        x: 'Sub-Saharan Africa',
        y1: 8.721525214,
        y2: 9.641352839,
        y3: 10.1736233,
        y4: 10.57169914,
        y5: 11.64427467,
        group: 'Low income'
      },
      {
        x: 'South Asia',
        y1: 9.404757278,
        y2: 10.36482449,
        y3: 10.94903493,
        y4: 11.5806383,
        y5: 12.50192084,
        group: 'Low income'
      },
      {
        x: 'South Asia',
        y1: 9.732841997,
        y2: 9.732841997,
        y3: 9.732841997,
        y4: 9.732841997,
        y5: 9.732841997,
        group: 'High income'
      },
      {
        x: 'Middle East & North Africa',
        y1: 9.541951901,
        y2: 10.33719892,
        y3: 10.91206173,
        y4: 11.29821858,
        y5: 11.60653481,
        group: 'Low income'
      },
      {
        x: 'Middle East & North Africa',
        y1: 10.2396509,
        y2: 10.63879995,
        y3: 11.09996104,
        y4: 11.54301107,
        y5: 11.92092709,
        group: 'High income'
      },
      {
        x: 'Latin America & Caribbean',
        y1: 10.14653181,
        y2: 10.32106777,
        y3: 10.45467215,
        y4: 10.45844052,
        y5: 10.6064696,
        group: 'Low income'
      },
      {
        x: 'Latin America & Caribbean',
        y1: 8.743652009,
        y2: 9.413881158,
        y3: 10.16606248,
        y4: 11.00011805,
        y5: 12.20655104,
        group: 'High income'
      },
      {
        x: 'East Asia & Pacific',
        y1: 7.800035977,
        y2: 8.850646235,
        y3: 10.14633178,
        y4: 11.59877618,
        y5: 13.24880824,
        group: 'High income'
      },
      {
        x: 'East Asia & Pacific',
        y1: 8.316035904,
        y2: 9.038602613,
        y3: 10.22954548,
        y4: 10.71782871,
        y5: 12.07411874,
        group: 'Low income'
      },
      {
        x: 'Europe & Central Asia',
        y1: 9.831631935,
        y2: 9.939275167,
        y3: 10.39108655,
        y4: 10.95556656,
        y5: 11.3012157,
        group: 'Low income'
      },
      {
        x: 'Europe & Central Asia',
        y1: 9.522480948,
        y2: 10.43085982,
        y3: 11.06642694,
        y4: 11.73822523,
        y5: 12.62940296,
        group: 'High income'
      }
    ]
  }
];

const spec = {
  type: 'boxPlot',
  data: data,
  xField: ['x', 'group'],

  minField: 'y1',
  q1Field: 'y2',
  medianField: 'y3',
  q3Field: 'y4',
  maxField: 'y5',
  seriesField: 'group',

  direction: 'vertical',
  color: ['#62CDFF', '#9E4784'],

  legends: {
    visible: true,
    data: data => {
      return data.map(obj => {
        obj.shape.fill = obj.shape.stroke;
        return obj;
      });
    }
  },

  title: {
    visible: true,
    text: 'Global GDP 2021'
  },

  boxPlot: {
    style: {
      // adaptive width if not specified
      // boxWidth: 50,
      // shaftWidth: 60,
      shaftShape: 'line',
      lineWidth: 2
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[箱型图](link)
