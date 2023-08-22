---
category: demo
group: axis
title: General Style Configuration
keywords: lineChart,comparison,trend,line,axis
order: 25-1
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/axis/style.png
option: lineChart#axes
---

# General Style Configuration

In this example, we configure the axis style through the configuration options provided by `axes`, and we can draw multiple axes by configuring them.

## Key Configurations

For the axes of the Cartesian coordinate system, we provide configurations for the `left`, `right`, `top`, and `bottom` directions, with the default Y-axis displayed on the left and the X-axis displayed at the bottom. We can control the axis display on different directions by adding corresponding direction configurations to the `axes` property, such as `{orient: 'top'}`.

For axis style configuration, configure through:

- `domainLine` Coordinate axis line configuration
- `label` Coordinate axis label configuration
- `tick` Coordinate axis scale line configuration
- `grid` Coordinate axis grid line configuration
- `title` Coordinate axis title configuration

## Code Demo

```javascript livedemo
const spec = {
  type: 'line',
  theme: {
    fontFamily: 'serif' // configure global font
  },
  data: [
    {
      id: 'line',
      values: [
        { x: '周一', y: 12 },
        { x: '周二', y: 13 },
        { x: '周三', y: 11 },
        { x: '周四', y: 10 },
        { x: '周五', y: 12 },
        { x: '周六', y: 14 },
        { x: '周日', y: 17 }
      ]
    }
  ],
  xField: 'x',
  yField: 'y',
  axes: [
    {
      orient: 'right',
      title: {
        visible: true,
        space: 12,
        text: '右轴标题'
      },
      label: {
        formatMethod: val => `${val}°C`,
        style: {
          fill: '#000'
        }
      },
      tick: {
        visible: true,
        tickStep: 2,
        tickSize: 6,
        style: {
          stroke: '#000'
        }
      },
      domainLine: {
        visible: true,
        style: {
          stroke: '#000'
        }
      },
      grid: {
        visible: false
      }
    },
    {
      orient: 'left',
      title: {
        visible: true,
        space: 12,
        text: '左轴标题'
      },
      label: {
        formatMethod: val => `${val}°C`,
        style: {
          fill: '#000'
        }
      },
      tick: {
        visible: true,
        tickStep: 2,
        tickSize: 6,
        style: {
          stroke: '#000'
        }
      },
      domainLine: {
        visible: true,
        style: {
          stroke: '#000'
        }
      },
      grid: {
        visible: true,
        style: {
          lineDash: [0]
        }
      }
    },
    {
      orient: 'top',
      label: {
        style: {
          fill: '#000'
        }
      },
      tick: {
        inside: true,
        tickSize: 8,
        style: {
          stroke: '#000'
        }
      },
      domainLine: {
        style: {
          stroke: '#000'
        }
      },
      grid: {
        visible: true,
        style: {
          lineDash: [0]
        }
      }
    },
    {
      orient: 'bottom',
      label: {
        inside: true,
        style: {
          fill: '#000'
        }
      },
      domainLine: {
        style: {
          stroke: '#000'
        }
      },
      grid: {
        visible: false
      },
      tick: {
        inside: true,
        tickSize: 8,
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

Please provide the link(s) to the tutorial(s) or API documentation related to this demo configuration.
