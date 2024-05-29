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
const createText = VRender.createText;

const layout = (data, getRelatedGraphic) => {
  // Find the maximum value of the bars
  const maxValue = Math.max(...data.map(d => d.data.value));
  console.log('data', data);
  console.log('getRelatedGraphic', getRelatedGraphic);

  return data.map(d => {
    // Find the graphic related to the current data point
    const baseMark = getRelatedGraphic(d);
    const x = baseMark.AABBBounds.x2 + (maxValue - d.data.value);
    const y = (baseMark.AABBBounds.y1 + baseMark.AABBBounds.y2) / 2;

    return createText({ ...d, x, y });
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
  // yField: ['province', 'value'],
  yField: 'province',
  seriesField: 'province',
  axes: [
    {
      orient: 'bottom',
      nice: false,
      visible: false
    },
    {
      orient: 'left',
      // showAllGroupLayers: true,
      // layers: [
      //   {
      //     visible: false
      //   },
      //   {
      //     visible: true
      //   }
      // ],
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
    // {
    //   orient: 'right',
    //   showAllGroupLayers: true,
    //   layers: [
    //     {
    //       visible: true
    //     },
    //     {
    //       visible: false
    //     }
    //   ],
    //   domainLine: {
    //     visible: false
    //   },
    //   tick: {
    //     visible: false
    //   }
    // }
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
    // customShape: (datum, attrs, path) => {
    //   Assuming 'barWidth' is the calculated width of the bar
    //   const barWidth = attrs.width; // Replace this with the actual logic to get bar width
    //   // Start the path for the bar background
    //   path.moveTo(0, 0);
    //   path.lineTo(barWidth, 0);
    //   path.lineTo(barWidth, attrs.height);
    //   path.lineTo(0, attrs.height);
    //   path.closePath();
    //   // Return the modified path
    //   return path;
    // },
    style: {
      cornerRadius: [5, 5, 5, 5],
      height: 10
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
