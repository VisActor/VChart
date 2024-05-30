---
categorvalue: examples
group: bar chart
title: 自定义标签的条形图
keywords: barChart,comparison,distribution,rank,rectangle
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/23e5d313c2c3a66d4ca806005.png
option: barChart
---

# 自定义标签的条形图

待完善

## 关键配置

待完善

## 代码演示

```javascript livedemo
const layout = (attribute, text, getRelatedGraphic) => {
  const maxX2 = Math.max(...attribute.map(attr => getRelatedGraphic(attr).AABBBounds.x2));
  return text.map(t => {
    const barRect = getRelatedGraphic(t.attribute);
    if (barRect) {
      const x = maxX2 + 30;
      const y = Math.abs(barRect.AABBBounds.y1 + barRect.AABBBounds.y2) / 2;
      t.setAttributes({ x, y });
    }
    return t;
  });
};

const spec = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        {
          province: '北京',
          value: 3080,
          type: 'top1'
        },
        {
          province: '天津',
          value: 2880,
          type: 'top2'
        },
        {
          province: '重庆',
          value: 880,
          type: 'top3'
        },
        {
          province: '深圳',
          value: 780,
          type: 'common'
        },
        {
          province: '广州',
          value: 680,
          type: 'common'
        },
        {
          province: '山东',
          value: 580,
          type: 'common'
        },
        {
          province: '浙江',
          value: 480,
          type: 'common'
        },
        {
          province: '福建',
          value: 100,
          type: 'common'
        },
        {
          province: '石家庄',
          value: 100,
          type: 'common'
        },
        {
          province: '广西壮族自治区',
          value: 100,
          type: 'common'
        }
      ]
    }
  ],
  direction: 'horizontal',
  xField: 'value',
  yField: 'province',
  seriesField: 'province',
  axes: [
    {
      orient: 'bottom',
      max: 3500,
      visible: false
    },
    {
      orient: 'left',
      maxWidth: 65,
      label: {
        autoLimit: true
      },
      domainLine: {
        visible: false
      },
      tick: {
        visible: false
      }
    }
  ],
  label: {
    customLayoutFunc: layout,
    visible: true
  },
  bar: {
    style: {
      cornerRadius: [5, 5, 5, 5],
      // scaleX: 0.8,
      // scaleCenter: ['0%', '50%'],
      height: 10
    }
  },
  barBackground: {
    visible: true,
    style: {
      cornerRadius: [5, 5, 5, 5],
      scaleX: 3080 / 3500,
      height: 10
    }
  },
  tooltip: {
    mark: {
      title: {
        visible: false
      }
    },
    dimension: {
      title: {
        visible: false
      }
    },
    style: {
      shape: {
        shapeType: 'circle'
      }
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[柱状图](link)
