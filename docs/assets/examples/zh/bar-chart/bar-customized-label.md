---
category: examples
group: bar chart
title: 自定义标签的条形图
keywords: barChart,comparison,distribution,rectangle,comparison,rank,axis,label
cover: ../../../../public/vchart/preview/bar-customized-label_1.11.1.png
option: barChart
---

# 自定义标签的条形图

可以使用`customLayoutFunc`配置自定义标签位置；可以自定义条形图的背景达到类似进度条的效果；详细信息的标题可以隐藏。

## 关键配置

- 设置 `label.customLayoutFunc` 属性为自定义标签位置的函数，让标签出现在图表右侧。
- 设置 `barBackground.style` 和 `axes.style` 的圆角等属性，使呈现出进度条的效果。
- 配置 `barBackground.style.scaleX` 属性的值，来缩短背景条形图的长度，使齐和最长的 bar 长度一致。
- 配置 `tooltip.mark.title.visible` 属性为 false，隐藏 tooltip 的标题。

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
