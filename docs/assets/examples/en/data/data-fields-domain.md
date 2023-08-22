---
category: demo
group: data
title: Data Filtering By Domain
keywords: data,filter
order: 34-3
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/data/data-fields-domain.png
option: scatterChart#data
---

# Data Filtering By Domain

The `fields` configuration of data supports processing dimensions, and configuring `domain` can filter the data. In the current demo, some data is entered incorrectly, with incorrect units used, such as **centimeters** for height, but some data is in **meters**. We need to filter out this wrong information.

## Key Configurations

- `type`: The data type of the current data dimension, linear means continuous values, ordinal means discrete data.
- `domain`: It is used to represent the current dimension in the data, and the content displayed in the chart should be within which interval. For continuous types, it is a numerical range, and for discrete types, it is an array item match.

## Code Demonstration

```javascript livedemo
const spec = {
  type: 'scatter',
  data: [
    {
      id: 'data',
      values: [
        {
          height: 150,
          weight: 45.5
        },
        {
          height: 152,
          weight: 52.5
        },
        {
          height: 154.3,
          weight: 53.5
        },
        {
          height: 161.6,
          weight: 53.5
        },
        {
          height: 156,
          weight: 55.5
        },
        {
          height: 158,
          weight: 57.5
        },
        {
          height: 160,
          weight: 52.5
        },
        {
          height: 161,
          weight: 58.5
        },
        {
          height: 160.4,
          weight: 56.5
        },
        {
          height: 160.6,
          weight: 64.5
        },
        {
          height: 162,
          weight: 54.5
        },
        {
          height: 162,
          weight: 54.5
        },
        {
          height: 162,
          weight: 56.5
        },
        {
          height: 162,
          weight: 58.5
        },
        {
          height: 162,
          weight: 64.5
        },
        {
          height: 161,
          weight: 56.5
        },
        {
          height: 164,
          weight: 60.5
        },
        {
          height: 166,
          weight: 64.5
        },
        {
          height: 168,
          weight: 67.5
        },
        {
          height: 170,
          weight: 63.5
        },
        {
          height: 172,
          weight: 64.5
        },
        {
          height: 174,
          weight: 65.5
        },
        {
          height: 176,
          weight: 65.5
        },
        {
          height: 170,
          weight: 70
        },
        {
          height: 170,
          weight: 70
        },
        {
          height: 170,
          weight: 70
        },
        {
          height: 170,
          weight: 70
        },
        {
          height: 170,
          weight: 70
        },
        {
          height: 170,
          weight: 70
        },
        {
          height: 160,
          weight: 59
        },
        {
          height: 173,
          weight: 75
        },
        {
          height: 165,
          weight: 68
        },
        {
          height: 167,
          weight: 69
        },
        {
          height: 174,
          weight: 75
        },
        {
          height: 173.4,
          weight: 75
        },
        {
          height: 173,
          weight: 72
        },
        {
          height: 173,
          weight: 76
        },
        {
          height: 171,
          weight: 71
        },
        {
          height: 172,
          weight: 70
        },
        {
          height: 172,
          weight: 70
        },
        {
          height: 172,
          weight: 70
        },
        {
          height: 172,
          weight: 70
        },
        {
          height: 175,
          weight: 76
        },
        {
          height: 174,
          weight: 79
        },
        {
          height: 172,
          weight: 81
        },
        {
          height: 172,
          weight: 70
        },
        {
          height: 170,
          weight: 73
        },
        {
          height: 185,
          weight: 80
        },
        {
          height: 1.89,
          weight: 86
        },
        {
          height: 1.7,
          weight: 86
        },
        {
          height: 1.8,
          weight: 80
        },
        {
          height: 1.7,
          weight: 75
        },
        {
          height: 1.6,
          weight: 62
        },
        {
          height: 1.65,
          weight: 70
        },
        {
          height: 1.58,
          weight: 66
        },
        {
          height: 1.65,
          weight: 67200
        },
        {
          height: 1.55,
          weight: 50000
        },
        {
          height: 160,
          weight: 56000
        },
        {
          height: 152,
          weight: 46000
        }
      ],
      fields: {
        height: {
          domain: [30, 300]
        },
        weight: {
          domain: [10, 200]
        }
      }
    }
  ],
  xField: 'height',
  yField: 'weight',
  axes: [
    { orient: 'left', type: 'linear', zero: false, title: { visible: true, text: 'Unit: kg' } },
    { orient: 'bottom', type: 'linear', zero: false, title: { visible: true, text: 'Unit: cm' } }
  ],
  title: {
    visible: true,
    text: 'Sampling the height and weight of students in a certain school - some data entry errors'
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## Related Tutorials

[Data](link)
