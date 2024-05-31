---
category: examples
group: bar chart
title: Bar chart with custom label
keywords: barChart,comparison,distribution,rectangle,comparison,rank,axis,label
cover: ../../../../public/vchart/preview/bar-customized-label_1.11.1.png
option: barChart
---

# Bar Chart with Custom Label

You can use `customLayoutFunc` to configure custom label positions; you can customize the background of the bar chart to achieve a progress bar-like effect; the title of the details can be hidden.

## Key option

- Set the `label.customLayoutFunc` property to a custom function for label positioning, making the labels appear on the right side of the chart.
- Set the `cornerRadius` of `barBackground.style` and `bar.style` to achieve a progress bar effect.
- Configure the `barBackground.style.scaleX` property to shorten the length of the background bar chart, making it consistent with the length of the longest bar.
- Set the `tooltip.mark.title.visible` property to false to hide the tooltip title.

## Demo source

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
          province: 'Beijing',
          value: 3080,
          type: 'top1'
        },
        {
          province: 'Tianjin',
          value: 2880,
          type: 'top2'
        },
        {
          province: 'Chongqing',
          value: 880,
          type: 'top3'
        },
        {
          province: 'Shenzhen',
          value: 780,
          type: 'common'
        },
        {
          province: 'Guangzhou',
          value: 680,
          type: 'common'
        },
        {
          province: 'Shandong',
          value: 580,
          type: 'common'
        },
        {
          province: 'Zhejiang',
          value: 480,
          type: 'common'
        },
        {
          province: 'Fujian',
          value: 100,
          type: 'common'
        },
        {
          province: 'Shihkiachwang',
          value: 100,
          type: 'common'
        },
        {
          province: 'Guangxi Zhuang Autonomous Region',
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

## Related Tutorials

[Bar Chart](link)
