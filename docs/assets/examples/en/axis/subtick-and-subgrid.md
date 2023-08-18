---
category: demo
group: axis
title: Sub-ticks and Sub-grid lines
keywords: lineChart,comparison,trend,line,axis
order: 25-0
cover: http://tosv.byted.org/obj/bit-cloud/vchart/preview/axis/subtick-and-subgrid.png
option: lineChart#axes
---

# Sub-ticks and Sub-grid lines

The axis provides `subTick` and `subGrid` properties, which are used to configure sub-ticks and sub-grid lines.

## Key Configurations

Configure the specified direction axis on the `axes` property:

- `subTick` property, used to configure sub-ticks, which are turned off by default. Set `{ visible: true }` to enable
- `subGrid` property, used to configure sub-grid lines

## Code Demo

```javascript livedemo
// just mock a dataset
function func(x) {
  x /= 10;
  return Math.cos(x * 2 + 1) * Math.sin(x * 2 + 1) * 50;
}

function generateData() {
  let data = [];
  const length = 100;
  for (let i = -1 * length; i <= length; i += 0.1) {
    data.push({
      x: i,
      y: func(i)
    });
  }

  return data;
}

const data = generateData();

const spec = {
  type: 'line',
  data: [
    {
      id: 'line',
      values: data
    }
  ],
  xField: 'x',
  yField: 'y',
  point: {
    visible: false
  },
  axes: [
    {
      orient: 'bottom',
      type: 'linear',
      min: -100,
      max: 100,
      label: {
        formatMethod: val => parseInt(val),
        style: {
          fill: '#000'
        }
      },
      tick: {
        visible: true,
        tickCount: 10,
        tickSize: 10,
        style: {
          stroke: '#000'
        }
      },
      subTick: {
       // Turn on sub-ticks
        visible: true,
        tickSize: 6,
        style: {
          stroke: '#000'
        }
      },
      grid: {
        visible: true,
        style: {
          lineDash: [0]
        }
      },
      subGrid: {
        // 开启子网格线
        visible: true,
        style: {
          lineDash: [0]
        }
      },
      domainLine: {
        visible: true,
        style: {
          stroke: '#000'
        }
      }
    },
    {
      orient: 'left',
      type: 'linear',
      min: -50,
      max: 50,
      tick: {
        visible: true,
        tickSize: 10,
        style: {
          stroke: '#000'
        }
      },
      label: {
        style: {
          fill: '#000'
        }
      },
      subTick: {
        visible: true,
        tickSize: 6,
        style: {
          stroke: '#000'
        }
      },
      grid: {
        visible: true,
        style: {
          lineDash: [0]
        }
      },
      subGrid: {
        visible: true,
        style: {
          lineDash: [0]
        }
      },
      domainLine: {
        visible: true,
        style: {
          stroke: '#000'
        }
      }
    }
  ]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, do not copy
window['vchart'] = vchart;
```

## Related Tutorials

Attached is the link to the tutorial or API documentation associated with this demo configuration.