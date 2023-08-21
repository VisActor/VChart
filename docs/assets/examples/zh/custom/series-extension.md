---
category: examples
group: customMark
title: 自定义 symbol mark
order: 40-1
cover: http://tosv.byted.org/obj/bit-cloud/vchart/preview/custom/series-extension.png
option: barChart#customMark
---

# 自定义 symbol mark

## 关键配置

- `extensionMark` 属性配置自定义文字图元
  - `extensionMark.type` 属性配置图元的类型
  - `extensionMark.dataId` 属性配置图元的数据来源
  - `extensionMark.style` 属性配置图元的样式

## 代码演示

```javascript livedemo
const spec = {
  type: 'common',
  data: [
    {
      id: 'barData',
      values: [
        { date: '第一天', class: 'A', score: 20, highest: true },
        { date: '第一天', class: 'B', score: 18 },
        { date: '第一天', class: 'C', score: 19 },
        { date: '第一天', class: 'D', score: 15 },

        { date: '第二天', class: 'A', score: 16 },
        { date: '第二天', class: 'B', score: 19, highest: true },
        { date: '第二天', class: 'C', score: 18 },
        { date: '第二天', class: 'D', score: 14 },

        { date: '第三天', class: 'A', score: 19, highest: true },
        { date: '第三天', class: 'B', score: 16 },
        { date: '第三天', class: 'C', score: 18 },
        { date: '第三天', class: 'D', score: 13 },

        { date: '第四天', class: 'A', score: 18 },
        { date: '第四天', class: 'B', score: 20 },
        { date: '第四天', class: 'C', score: 22 },
        { date: '第四天', class: 'D', score: 26, highest: true }
      ]
    }
  ],
  series: [
    {
      type: 'bar',
      yField: 'score',
      xField: ['date', 'class'],
      seriesField: 'class',
      extensionMark: [
        {
          type: 'symbol',
          dataId: 'barData',
          visible: true,
          style: {
            // flag path
            symbolType:
              'M134.404 233.406C131.29 211.4 146.482 191.016 168.334 187.88c21.852-3.136 42.092 12.16 45.206 34.17l91.124 644.016c3.114 22.008-12.076 42.39-33.928 45.526-21.854 3.136-42.092-12.162-45.206-34.17L134.404 233.406zM637.48 287.434c-47.104 5.628-97.372 0.908-168.788-12.58-11.554-2.18-22.494-4.346-40.062-7.894-44.648-9.018-57.702-11.546-77.862-14.79-26.226-4.22-47.57-6.34-65.826-6.34-22.23 0-40.25-18.034-40.25-40.28 0-22.244 18.02-40.278 40.25-40.278 23.156 0 48.506 2.52 78.608 7.364 21.64 3.482 35.172 6.1 81.006 15.36 17.26 3.484 27.926 5.596 39.064 7.7 63.93 12.072 107.426 16.158 144.314 11.75 64.332-7.686 129.64-36.462 196.136-87.112 28.106-21.41 68.172 1.206 64.4 36.352l-20.932 194.948a40.3 40.3 0 0 1-3.698 13.052c-62.652 131.306-150.578 203.8-262.236 211.334-84 5.668-154.226 44.084-212.82 117.14-13.916 17.346-39.25 20.122-56.586 6.2-17.336-13.926-20.11-39.278-6.194-56.626 72.352-90.206 163.13-139.866 270.184-147.088 77.876-5.254 141.41-56.51 192.058-159.576l11.078-103.188c-53.446 29.78-107.416 48.048-161.846 54.552z',
            x: (datum, ctx, elements, dataView) => {
              return ctx.valueToX([datum.date, datum.class]);
            },
            y: (datum, ctx, elements, dataView) => {
              return ctx.valueToY([datum.score]) - 28;
            },
            fill: 'red',
            size: 20,
            visible: datum => datum.highest === true
          }
        }
      ]
    }
  ],
  title: {
    visible: true,
    text: 'Mark the class with the highest daily score with a red flag',
    padding: {
      left: 50,
      bottom: 10
    }
  },
  axes: [
    { orient: 'left', type: 'linear', nice: true, range: { max: 30 } },
    { orient: 'bottom', type: 'band' }
  ]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[自定义 mark](link)
