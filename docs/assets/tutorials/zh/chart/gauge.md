# 仪表图

## 简介

仪表图是一种拟物化的图表，就像汽车的速度表一样，刻度表示度量，指针角度表示当前数值。

## 图表构成
仪表图由扇区图元和具有进度指向性的仪表图指针等基本元素构成。
![](https://tosv.byted.org/obj/bit-cloud/b42a7699efcd4dfa8b8aa3a03.png)

从数据系列角度而言，仪表图由`gauge`和`gaugePointer`系列封装而成，他们绘制仪表盘扇形区域和指针。利用这一特性，您可以以[组合图](./combination)的方式声明仪表图，以更灵活的方式调整仪表图绘制效果。


扇区图元和仪表图指针为仪表图的基本要素，相关的绘制配置必不可少:
- `gaugeChart.type`: 图表类型，仪表图的类型为`'gauge'`
- `gaugeChart.data`: 图表绘制的数据源
- `gaugeChart.categoryField`: 分类字段，映射不同的扇区
- `gaugeChart.valueField`: 数值字段，映射指针角度
- `gaugeChart.innerRadius`: 指定仪表图表盘的内半径
- `gaugeChart.outerRadius`: 指定仪表图表盘的外半径
- `gaugeChart.startAngle`: 指定仪表图表盘的开始角度
- `gaugeChart.endAngle`: 指定仪表图表盘的结束角度

## 快速上手

```javascript livedemo
const spec = {
  type: 'gauge',
  data: [
    {
      id: 'id0',
      values: [
        {
          type: 'targetA',
          value: 0.6
        }
      ]
    }
  ],
  categoryField: 'type',
  valueField: 'value',
  outerRadius: 0.8,
  innerRadius: 0.5,
  startAngle: -180,
  endAngle: 0
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// 只为了方便控制台调试用，不要拷贝
window['vchart'] = vchart;
```

### 关键配置

- `categoryField`、`valueField` 属性分别用于指定数据类别与指针角度字段
- `innerRadius`、`outerRadius` 属性用于指定仪表盘的内外半径
- `startAngle`、`endAngle` 属性用于指定仪表盘的开始、结束角度

## 仪表图特性

### 数据

- 一个`离散` 字段，如: `type` ，表示数据类别，也可以理解为仪表盘所展示的是何种项目的进度
- 一个`数值`字段，如: `value`  ，表示指针角度，也可以理解为要展示的进度值

由于一个仪表盘通常只展示一个项目的进度，所以数据通常只有一条。

```ts
data: [
    {
      id: 'gauge',
      values: [
        {
          type: 'targetA',
          value: 0.6
        }
      ]
    }
  ]
```
### 以组合图的形式声明更灵活的仪表图
为了让仪表图有更拟物化的效果，可以以组合图的形式同时声明`gauge`和`gaugePointer`系列，并配置动画从而达到动态展示进度的效果。

下面这个例子应用当前获取的时间作为源数据，巧妙的拟合出动态表盘效果，充分证明VChart的灵活性、实用性。

```javascript livedemo
const getClockData = () => {
  const date = new Date();
  const s = date.getSeconds();
  const m = date.getMinutes();
  const h = ((date.getHours() % 12) + m / 60) * 5;
  const time = date.getTime();
  return { s, m, h, time };
};

const formatDate = date => {
  let m = date.getMonth();
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  const mString = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  return `${d} ${mString[m]}`;
};
const dateString = formatDate(new Date());

const pointerAnimate = {
  channels: ['angle'],
  custom: (ratio, from, to, nextAttributes) => {
    if ((!from.angle && from.angle !== 0) || (!to.angle && to.angle !== 0)) {
      return;
    }
    const toAngle = to.angle;
    const fromAngle = from.angle > to.angle ? from.angle - Math.PI * 2 : from.angle;
    nextAttributes.angle = ratio * (toAngle - fromAngle) + fromAngle;
  },
  easing: 'bounceOut'
};

const { s: initS, m: initM, h: initH, time: initTime } = getClockData();

const getGalaxyData = time => {
  return [
    {
      type: 1,
      angle: (time / 500) % 360,
      value: 100
    },
    {
      type: 2,
      angle: (time / 700) % 360,
      value: 150
    },
    {
      type: 3,
      angle: (time / 900) % 360,
      value: 200
    }
  ];
};

const spec = {
  type: 'common',
  width: 500,
  height: 500,
  background: 'black',
  theme: {
    colorScheme: {
      default: {
        palette: {
          darkest: '#383e65',
          dark: '#6287f8',
          light: '#73fffe',
          lighter: '#ff6e27',
          lightest: '#fbf665',
          axisLabel: '#ccc'
        }
      }
    }
  },
  data: [
    {
      id: 'pointerData1',
      values: [
        {
          type: 'm',
          value: initM,
          length: 250
        },
        {
          type: 'h',
          value: initH,
          length: 200
        }
      ]
    },
    {
      id: 'pointerData2',
      values: [
        {
          type: 's',
          value: initS,
          length: 300
        }
      ]
    },
    {
      id: 'segmentData',
      values: Array(12)
        .fill(0)
        .map((_, i) => ({
          value: (12 - i) * 5,
          opacity: 0.4
        }))
    },
    {
      id: 'galaxy',
      values: getGalaxyData(initTime)
    }
  ],
  startAngle: -90,
  endAngle: 270,
  color: [
    { type: 'palette', key: 'lighter' },
    { type: 'palette', key: 'light' },
    { type: 'palette', key: 'dark' }
  ],
  series: [
    {
      type: 'radar',
      dataIndex: 3,
      valueField: 'value',
      seriesField: 'type',
      categoryField: 'angle',
      outerRadius: 0.8,
      innerRadius: 0,
      point: {
        style: {
          lineWidth: 0,
          size: 10,
          fillOpacity: 0.8
        }
      },
      animation: false
    },
    {
      type: 'gauge',
      dataIndex: 2,
      valueField: 'value',
      seriesField: 'value',
      stack: true,
      outerRadius: 0.78,
      innerRadius: 0.6,
      padAngle: 0.04,
      segment: {
        style: {
          cornerRadius: 4,
          fillOpacity: datum => datum.opacity
        }
      },
      animationAppear: false,
      animationUpdate: {
        segment: {
          channels: ['fillOpacity'],
          duration: 1000,
          easing: 'easeInOut'
        }
      }
    },
    {
      type: 'gaugePointer',
      dataIndex: 0,
      valueField: 'value',
      seriesField: 'type',
      radiusField: 'length',
      pointer: {
        type: 'path',
        width: 0.5
      },
      pin: {
        visible: false
      },
      pinBackground: {
        visible: false
      },
      animationAppear: false,
      animationUpdate: {
        pointer: pointerAnimate
      }
    },
    {
      type: 'gaugePointer',
      dataIndex: 1,
      valueField: 'value',
      seriesField: 'type',
      pointer: {
        type: 'rect',
        width: 0.03,
        height: 0.88,
        center: [0.5, 0.25],
        style: {
          fill: { type: 'palette', key: 'lightest' },
          cornerRadius: 100
        }
      },
      pin: {
        width: 0.13,
        height: 0.13,
        style: {
          fill: { type: 'palette', key: 'dark' },
          lineWidth: 0,
          fillOpacity: 0.5
        }
      },
      pinBackground: {
        width: 0.16,
        height: 0.16,
        style: {
          fill: { type: 'palette', key: 'darkest' }
        }
      },
      animationAppear: false,
      animationUpdate: {
        pointer: pointerAnimate
      }
    }
  ],
  axes: [
    {
      visible: true,
      type: 'linear',
      orient: 'angle',
      radius: 0.8,
      min: 0,
      max: 60,
      domain: { visible: true, smooth: false },
      grid: {
        visible: false
      },
      tick: {
        visible: false,
        tickCount: 12
      },
      label: {
        style: {
          fontSize: 24,
          fontFamily: 'Times New Roman',
          fill: { type: 'palette', key: 'axisLabel' },
          text: ({ value }) => {
            if (!value) {
              return;
            }
            return ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][value / 5];
          }
        }
      }
    },
    {
      visible: true,
      type: 'linear',
      orient: 'radius',
      min: 0,
      max: 250,
      outerRadius: 0.5,
      innerRadius: 0,
      label: {
        visible: false
      },
      domainLine: {
        visible: false
      },
      grid: {
        style: {
          lineDash: [],
          lineWidth: 18,
          stroke: { type: 'palette', key: 'darkest' },
          opacity: 0.65
        }
      },
      tick: {
        visible: false
      }
    }
  ],
  indicator: {
    visible: true,
    fixed: true,
    content: [
      {
        style: {
          fontSize: 18,
          fontFamily: 'Times New Roman',
          text: dateString.split(' ')[0],
          fill: 'white',
          fontWeight: 'bolder'
        }
      },
      {
        style: {
          fontSize: 18,
          fontFamily: 'Times New Roman',
          text: dateString.split(' ')[1],
          fill: 'white',
          fontWeight: 'bolder'
        }
      }
    ]
  },
  tooltip: {
    visible: false
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });

let tempSecond = -1;
const update = () => {
  const { s, m, h, time } = getClockData();
  if (s !== tempSecond) {
    tempSecond = s;
    vchart.updateData('pointerData1', [
      {
        type: 'm',
        value: m,
        length: 250
      },
      {
        type: 'h',
        value: h,
        length: 200
      }
    ]);
    vchart.updateData('pointerData2', [
      {
        type: 's',
        value: s,
        length: 300
      }
    ]);
    const highlightGaugeIndex = s % 3;
    const segmentData = Array(12)
      .fill(0)
      .map((_, i) => ({
        value: (12 - i) * 5,
        opacity: i % 3 === 2 - highlightGaugeIndex ? 1 : 0.4
      }));
    vchart.updateData('segmentData', segmentData);
  }
  vchart.updateData('galaxy', getGalaxyData(time));
};

vchart.renderAsync().then(() => {
  setInterval(update, 50);
});

// 只为了方便控制台调试用，不要拷贝
window['vchart'] = vchart;
```

### 图元及样式

#### 扇区渐变

在VChart中，您可以使用`fill.gradient: 'conical'`为图元添加环形渐变效果，这将提高图表表现力。同理，仪表图的扇区图元为`progress`, 所以只需`gaugeChart.progress.style.fill`中进行配置即可, 具体配置请见[VChart 图元渐变详细配置](todo)

```javascript livedemo
const pointerPath =
  'M-0.020059 -0.978425 C-0.018029 -0.9888053 -0.013378 -1 0 -1 C0.01342 -1 0.01812 -0.989146 0.0201 -0.978425 C0.02161 -0.9702819 0.0692 -0.459505 0.09486 -0.184807 C0.10298 -0.097849 0.1089 -0.034548 0.11047 -0.018339 C0.11698 0.04908 0.07373 0.11111 0.00002 0.11111 C-0.07369 0.11111 -0.117184 0.04991 -0.110423 -0.018339 C-0.103662 -0.086591 -0.022089 -0.9680447 -0.020059 -0.978425Z';
const circlePath =
  'M1 0 C1 0.55228 0.55228 1 0 1 C-0.552285 1 -1 0.55228 -1 0 C-1 -0.552285 -0.552285 -1 0 -1 C0.55228 -1 1 -0.552285 1 0Z';

const spec = {
  type: 'gauge',
  data: [
    {
      id: 'id0',
      values: [
        {
          type: 'targetA',
          value: 0.6
        }
      ]
    }
  ],
  radiusField: 'type',
  angleField: 'value',
  seriesField: 'type',
  outerRadius: 0.8,
  innerRadius: 0.5,
  startAngle: -225,
  endAngle: 45,
  gauge: {
    type: 'circularProgress',
    progress: {
      style: {
        fill: {
          gradient: 'conical',
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
        }
      }
    },
    track: {
      style: {
        fill: '#ccc'
      }
    }
  },
  pointer: {
    width: 0.5,
    height: 0.5,
    style: {
      path: pointerPath,
      fill: '#5A595E'
    }
  },
  pin: {
    style: {
      path: circlePath,
      fill: '#888'
    }
  },
  pinBackground: {
    width: 0.08,
    height: 0.08,
    style: {
      path: circlePath,
      fill: '#ddd'
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// 只为了方便控制台调试用，不要拷贝
window['vchart'] = vchart;
```


