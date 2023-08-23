---
category: examples
group: marker
title: markArea Quadrant Chart Simulation
keywords: marker,scatterChart,scatter
order: 33-7
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/marker/mark-area-quadrant.png
option: scatterChart#markArea
---

# markArea Quadrant Chart Simulation

By using markArea, you can configure fill styles for different regions of the chart, thus simulating the effect of a quadrant chart.

## Key Configurations

Data point positioning:

- The `coordinates` attribute declares an array of data points or data aggregation values for constructing the markArea outline, with aggregation methods as mentioned before. The declaration of the data point is in the form `{xKey: value, yKey: value}`, where `xKey` is the data field corresponding to the x-axis, `yKey` is the data field corresponding to the y-axis, and `value` is the value corresponding to the data field or the aggregation type.

Area style configuration:

- The `area.style` attribute declares the style for the area region, supporting graphic attributes such as `fill` and `stroke`.

## Code Demonstration

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

// Just for the convenience of console debugging, do not copy
window['vchart'] = vchart;
```

## Related Tutorials

[scrollBar](link)
