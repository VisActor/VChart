---
category: examples
group: marker
title: markArea 模拟象限图
keywords: marker,scatterChart,scatter
order: 33-7
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/marker/mark-area-quadrant.png
option: scatterChart#markArea
---

# markArea 模拟象限图

利用 markArea 可以为图表的不同区域配置填充样式, 从而模拟象限图的效果.

## 关键配置

数据点定位:

- `coordinates`属性声明构建 markArea 轮廓的数据点或数据聚合值数组, 聚合方式同上. 数据点的声明方式为`{ xKey: value , yKey: value }`, 其中`xKey`为 x 轴对应的数据字段; `yKey`为 y 轴对应的数据字段; `value`为数据字段对应的数值 或 数据聚合类型

area 样式配置:

- `area.style`属性声明为 area 区域的样式, 支持`fill` `stroke`等图元属性

## 代码演示

```javascript livedemo
const spec = {
  type: 'scatter',
  xField: 'x',
  yField: 'y',
  label: {
    visible: true,
    style: {
      fill: '#222'
    }
  },
  axes: [
    {
      orient: 'bottom',
      type: 'linear',
      range: {
        min: 140,
        max: 220
      },
      visible: false
    },
    {
      orient: 'left',
      visible: false
    }
  ],
  markArea: [
    {
      coordinates: [
        {
          x: 140,
          y: 0
        },
        {
          x: 220,
          y: 0
        },
        {
          x: 220,
          y: 80
        },
        {
          x: 140,
          y: 80
        }
      ],
      area: {
        style: {
          fill: '#5B8FF9',
          fillOpacity: 0,
          stroke: '#5B8FF9'
        }
      }
    },
    {
      coordinates: [
        {
          x: 140,
          y: 0
        },
        {
          x: 180,
          y: 0
        },
        {
          x: 180,
          y: 40
        },
        {
          x: 140,
          y: 40
        }
      ],
      area: {
        style: {
          fill: '#5B8FF9',
          fillOpacity: 0.15
        }
      }
    },
    {
      coordinates: [
        {
          x: 180,
          y: 40
        },
        {
          x: 220,
          y: 40
        },
        {
          x: 220,
          y: 80
        },
        {
          x: 180,
          y: 80
        }
      ],
      area: {
        style: {
          fill: '#5B8FF9',
          fillOpacity: 0.15
        }
      }
    }
  ],
  data: {
    id: 'data2',
    values: [
      {
        name: 'Denmark',
        x: 201.53,
        y: 26.84
      },
      {
        name: 'Switzerland',
        x: 196.44,
        y: 21.73
      },
      {
        name: 'Australia',
        x: 196.4,
        y: 24.09
      },
      {
        name: 'New Zealand',
        x: 196.09,
        y: 19.43,
        label: {
          anchor: 'left'
        }
      },
      {
        name: 'Germany',
        x: 189.87,
        y: 27.68
      },
      {
        name: 'Austria',
        x: 187,
        y: 25.43
      },
      {
        name: 'Netherlands',
        x: 186.46,
        y: 29.08,
        label: {
          anchor: 'left'
        }
      },
      {
        name: 'Spain',
        x: 184.69,
        y: 40.37,
        label: {
          anchor: 'left'
        }
      },
      {
        name: 'Finland',
        x: 183.98,
        y: 14.57
      },
      {
        name: 'United States',
        x: 181.91,
        y: 32.73,
        label: {
          anchor: 'left'
        }
      },
      {
        name: 'Portugal',
        x: 180.66,
        y: 29.87
      },
      {
        name: 'Sweden',
        x: 177.93,
        y: 16.59
      },
      {
        name: 'United Kingdom',
        x: 177.73,
        y: 34.24
      },
      {
        name: 'Norway',
        x: 176.23,
        y: 19.28,
        label: {
          anchor: 'left'
        }
      },
      {
        name: 'Canada',
        x: 172.83,
        y: 28.17,
        label: {
          anchor: 'left'
        }
      },
      {
        name: 'Japan',
        x: 172.72,
        y: 40.9
      },
      {
        name: 'France',
        x: 172.3,
        y: 42.04,
        label: {
          anchor: 'left'
        }
      },
      {
        name: 'Estonia',
        x: 171.71,
        y: 19.19
      },
      {
        name: 'Ireland',
        x: 170.83,
        y: 27.47
      },
      {
        name: 'Czech Republic',
        x: 167.77,
        y: 42.17
      },
      {
        name: 'South Korea',
        x: 167.52,
        y: 50.28,
        label: {
          anchor: 'left'
        }
      },
      {
        name: 'Croatia',
        x: 167.51,
        y: 30.69
      },
      {
        name: 'Belgium',
        x: 162.57,
        y: 50.46,
        label: {
          anchor: 'top',
          offsetX: 0,
          offsetY: 3
        }
      },
      {
        name: 'Israel',
        x: 160.72,
        y: 61.91
      },
      {
        name: 'Italy',
        x: 160.21,
        y: 52.96
      },
      {
        name: 'Saudi Arabia',
        x: 156.98,
        y: 72.12
      },
      {
        name: 'Greece',
        x: 156.8,
        y: 49.1
      },
      {
        name: 'Slovakia',
        x: 154.13,
        y: 44.28
      },
      {
        name: 'Taiwan',
        x: 150.62,
        y: 64.3
      },
      {
        name: 'Poland',
        x: 150.13,
        y: 50.79
      }
    ]
  }
};
const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[scrollBar](link)
