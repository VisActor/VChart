---
category: examples
group: marker
title: markArea to mark range
keywords: marker, lineChart
order: 33-12
cover: /vchart/preview/mark-area-range.png
option: lineChart#markArea
---


## Key configuration

- Use the `markArea.coordinates` to mark range points.

## Demo source

```javascript livedemo
const spec = {
  type: 'line',
  data: {
    values: [
      {
        time: '2:00',
        value: 38
      },
      {
        time: '4:00',
        value: 56
      },
      {
        time: '6:00',
        value: 10
      },
      {
        time: '8:00',
        value: 70
      },
      {
        time: '10:00',
        value: 36
      },
      {
        time: '12:00',
        value: 94
      },
      {
        time: '14:00',
        value: 24
      },
      {
        time: '16:00',
        value: 44
      },
      {
        time: '18:00',
        value: 36
      },
      {
        time: '20:00',
        value: 68
      },
      {
        time: '22:00',
        value: 22
      }
    ]
  },
  xField: 'time',
  yField: 'value',
  markArea: [{
    coordinates: [{
      time: '2:00',
      value: 20
    }, {
      time: '2:00',
      value: 60
    }, {
      time: '4:00',
      value: 60
    }, {
      time: '4:00',
      value: 20
    }]
  }, {
    coordinates: [{
      time: '10:00',
      value: 36
    }, {
      time: '10:00',
      value: 94
    }, {
      time: '12:00',
      value: 94
    }, {
      time: '12:00',
      value: 36
    }]
  }],
  markPoint: [
    {
      coordinate: {
        time: '4:00',
        value: 60,
      },
      itemLine: {
        visible: false,
      },
      itemContent: {
        offsetY: 0,
        type: "image",
        autoRotate: false,
        imageStyle: {
          dx: -55,
          width: 30,
          height: 30,
          image:
            "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/%E7%AE%AD%E5%A4%B4%20%E4%B8%8B%E9%99%8D.png",
        },
      },
    },
    {
      coordinate: {
        time: '12:00',
        value: 94,
      },
      itemLine: {
        visible: false,
      },
      itemContent: {
        type: "image",
        offsetY: 0,
        autoRotate: false,
        imageStyle: {
          dx: -50,
          width: 30,
          height: 30,
          image: "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/%E4%B8%8A%E5%8D%87.png",
        },
      },
    },
  ],
  line: {
    style: {
      curveType: 'monotone'
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## Related tutorials

[markPoint](link)
