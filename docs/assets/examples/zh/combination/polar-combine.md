---
category: examples
group: combination
title: 极坐标系下的组合图
keywords: commonChart
order: 22-6
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/combination/polar-combine.png
option: commonChart
---

# 极坐标系下的组合图

该示例展示了极坐标系下的组合图，雷达系列与玫瑰图系列的组合

## 关键配置

- `type: 'common'` 声明为组合图
- `series` 中配置对应的系列
- `axes` 声明角度轴和半径轴，注意，坐标轴信息必须声明，否则无法绘制

## 代码演示

```javascript livedemo
const spec = {
  type: 'common',
  outerRadius: 0.9,
  series: [
    {
      type: 'rose',
      data: {
        values: [
          { key: '北', value: 31 },
          { key: '东北', value: 32 },
          { key: '东', value: 21 },
          { key: '东南', value: 15 },
          { key: '南', value: 50 },
          { key: '西南', value: 44 },
          { key: '西', value: 32 },
          { key: '西北', value: 32 },
          { key: '北', value: 31 },
          { key: '东北', value: 32 }
        ]
      },
      categoryField: 'key',
      valueField: 'value',
      stack: false,
      rose: {
        style: {
          lineWidth: 1,
          stroke: '#fff',
          fill: '#FF6666'
        }
      }
    },
    {
      type: 'radar',
      data: {
        values: [
          { key: '北', value: 31, category: '驱逐舰' },
          { key: '东北', value: 32, category: '驱逐舰' },
          { key: '东', value: 21, category: '驱逐舰' },
          { key: '东南', value: 15, category: '驱逐舰' },
          { key: '南', value: 50, category: '驱逐舰' },
          { key: '西南', value: 44, category: '驱逐舰' },
          { key: '西', value: 32, category: '驱逐舰' },
          { key: '西北', value: 32, category: '驱逐舰' },
          { key: '北', value: 31, category: '驱逐舰' },
          { key: '东北', value: 32, category: '驱逐舰' },
          { key: '东南', value: 40, category: '航母' },
          { key: '南', value: 25, category: '航母' },
          { key: '西南', value: 22, category: '航母' },
          { key: '西', value: 18, category: '航母' },
          { key: '西北', value: 7, category: '航母' },
          { key: '北', value: 24, category: '航母' },
          { key: '东北', value: 43, category: '航母' },
          { key: '东', value: 42, category: '航母' }
        ]
      },
      categoryField: 'key',
      valueField: 'value',
      seriesField: 'category',
      area: {
        style: {
          visible: datum => {
            return datum.category === '驱逐舰' ? false : true;
          },
          fillOpacity: 0.5
        }
      },
      line: {
        style: {
          lineWidth: 2
        }
      }
    }
  ],
  axes: [
    {
      orient: 'angle',
      grid: {
        alignWithLabel: false,
        style: {
          lineDash: [0]
        }
      }
    },
    {
      orient: 'radius',
      domainLine: {
        visible: false
      }
    }
  ],
  legends: {
    visible: true,
    interactive: true
  }
};
const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[柱状图](link)
