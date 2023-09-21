---
category: demo
group: tooltip
title: 自定义 tooltip
keywords: tooltip
order: 26-1
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/57a706137957fce7388f3ab03.png
option: barChart#tooltip
---

# 自定义 tooltip

默认 tooltip 在样式、内容、位置上均支持自定义配置。

## 代码演示

```javascript livedemo
const data = [
  {
    x: '2:00',
    y: 82
  },
  {
    x: '4:00',
    y: 50
  },
  {
    x: '6:00',
    y: 64
  },
  {
    x: '8:00',
    y: 10
  },
  {
    x: '10:00',
    y: 30
  },
  {
    x: '12:00',
    y: 40
  },
  {
    x: '14:00',
    y: 56
  },
  {
    x: '16:00',
    y: 40
  },
  {
    x: '18:00',
    y: 64
  },
  {
    x: '20:00',
    y: 74
  },
  {
    x: '22:00',
    y: 98
  }
];
const sum = data.reduce((sum, cur) => sum + cur.y, 0);

const spec = {
  type: 'bar',
  data: {
    id: 'data1',
    values: data
  },
  xField: 'x',
  yField: 'y',
  bar: {
    style: {
      fill: {
        gradient: 'linear',
        x0: 0.5,
        y0: 0.4,
        x1: 1,
        y1: 0.5,
        stops: [
          {
            offset: 0,
            color: '#4FC6B4'
          },
          {
            offset: 1,
            color: '#31679E'
          }
        ]
      },
      cornerRadius: 10
    }
  },
  tooltip: {
    mark: {
      position: 'top',
      content: [
        {
          key: 'Measure',
          value: datum => datum.y
        },
        {
          key: 'Ratio',
          value: datum => Math.floor((datum.y / sum) * 10000) / 100 + '%',
          hasShape: false
        }
      ],
      updateContent: prev =>
        (prev ?? [])
          .map(c => {
            c.key += ' Value:';
            return c;
          })
          .concat({
            key: 'I AM',
            value: 'A NEW LINE'
          })
    },
    dimension: {
      position: 'tl',
      positionMode: 'pointer',
      updateContent: prev =>
        (prev ?? []).concat({
          key: 'I AM',
          value: 'A NEW LINE'
        })
    },
    style: {
      panel: {
        padding: {
          top: 5,
          bottom: 10,
          left: 10,
          right: 10
        },
        backgroundColor: '#272d54',
        border: {
          color: '#999',
          width: 4,
          radius: 10
        },
        shadow: {
          x: 0,
          y: 0,
          blur: 10,
          spread: 5,
          color: '#666'
        }
      },
      titleLabel: {
        fontSize: 20,
        fontColor: 'white',
        fontWeight: 'bold',
        align: 'center',
        lineHeight: 24
      },
      keyLabel: {
        fontSize: 14,
        fontColor: 'orange',
        align: 'center',
        lineHeight: 15,
        spacing: 10
      },
      valueLabel: {
        fontSize: 14,
        fontColor: 'yellow',
        align: 'center',
        lineHeight: 15,
        spacing: 10
      },
      shape: {
        size: 15,
        spacing: 10
      },
      spaceRow: 10
    },
    offset: {
      y: 20
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

附上和该 demo 配置相关联的教程或者 api 文档的链接。
