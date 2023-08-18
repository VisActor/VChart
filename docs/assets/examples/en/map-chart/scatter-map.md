---
category: examples
group: map chart
title: Scatter Map
keywords: map,space,polygon,scatter,distribution,comparison
order: 11-1
cover: http://tosv.byted.org/obj/bit-cloud/vchart/preview/map-chart/scatter-map.png
option: mapChart
---

# Scatter Map

## Key Configurations

- Specify the chart type `type: common` as a combination chart
- `series` field configures 2 chart series, this example configures a map series and a scatter series
  - `series[0]` is the map series
  - `series[1]` is the scatter series, which has a breathing point loop animation for data points with values greater than 6
    - `animationNormal` is the normal animation of the series, which is executed after the chart entrance animation, and is usually used for loop animation configuration;
- `region` configures a geographical coordinate system region for rendering maps. Meanwhile, the scatter series is associated with the current region by default, and the point position is calculated through geographic mapping.

  - `region[0].roam: true` configures the current region to support map zooming and dragging
  - `region[0].longitudeField` declares the longitude data field
  - `region[0].latitudeField` declares the latitude data field

- The continuous legend slider value defaults to a precision of 0, and for the current scenario where the data range is small, the display precision of the value is configured with `handlerText.precision`

## Code Demo

```javascript livedemo
const spec = {
  type: 'common',
  map: 'china',
  series: [
    {
      type: 'map',
      map: 'china',
      nameField: 'name',
      valueField: 'value',
      tooltip: { visible: false }
    },
    {
      type: 'scatter',
      xField: 'name',
      yField: 'value',
      // Numerical field configuration associated with the size of the scatter point
      sizeField: 'value',
     // The size of the scatter point is a continuous numerical map, the minimum value of size is 10, and the maximum value is 40
      size: {
        type: 'linear',
        range: [10, 40]
      },
      tooltip: {
        mark: {
          content: [{ key: 'count', value: datum => datum.value }]
        }
      },
      point: {
        style: {
          fill: 'rgb(253, 175, 89)',
          fillOpacity: datum => (datum.value > 6 ? 0.8 : 0.6)
        }
      },
      animationNormal: {
        point: {
          loop: true,
          timeSlices: [
            {
              duration: 1000,
              effects: {
                easing: 'circleIn',
                channel: {
                  size: {
                    from: (datum, element) => {
                      return element.getGraphicItem().attribute.size;
                    },
                    to: (datum, element) => {
                      const size = element.getGraphicItem().attribute.size;
                      if (datum.value > 6) {
                        return size + 5;
                      }
                      return size;
                    }
                  }
                }
              }
            },
            {
              duration: 1000,
              effects: {
                easing: 'circleIn',
                channel: {
                  size: {
                    from: (datum, element) => {
                      const size = element.getGraphicItem().attribute.size;
                      if (datum.value > 6) {
                        return size + 5;
                      }
                      return size;
                    },
                    to: (datum, element) => {
                      return element.getGraphicItem().attribute.size;
                    }
                  }
                }
              }
            }
          ]
        }
      }
    }
  ],
  legends: [
    {
      visible: true,
      type: 'size',
      field: 'value',
      orient: 'bottom',
      position: 'start',
      handlerText: {
        precision: 2
      }
    }
  ],
  region: [
    {
      roam: true,
      // Specify the chart display area as the geographic coordinate system
      coordinate: 'geo',
      // Declare the longitude data field
      longitudeField: 'lng',
      // Declare the latitude data field
      latitudeField: 'lat'
    }
  ],
  data: [
    {
      name: 'data',
      values: [
        { lng: '121.056', lat: '31.255', value: 1 },
        { lng: '109.156', lat: '18.305', value: 2 },
        { lng: '109.156', lat: '18.305', value: 2 },
        { lng: '108.725', lat: '18.643', value: 3 },
        { lng: '110.072', lat: '19.181', value: 2 },
        { lng: '110.294', lat: '20.004', value: 1 },
        { lng: '110.639', lat: '21.64', value: 1 },
        { lng: '120.193', lat: '50.176', value: 2 },
        { lng: '120.125', lat: '50.442', value: 1 },
        { lng: '119.759', lat: '49.153', value: 3 },
        { lng: '119.763', lat: '49.226', value: 1 },
        { lng: '105.763', lat: '35.523', value: 7 },
        { lng: '121.071', lat: '43.575', value: 8 },
        { lng: '80.872', lat: '44.017', value: 1 },
        { lng: '116.14', lat: '40.078', value: 2 },
        { lng: '116.939', lat: '33.764', value: 2 },
        { lng: '114.579', lat: '30.495', value: 1 },
        { lng: '109.756', lat: '26.833', value: 1 },
        { lng: '110.151', lat: '22.638', value: 1 },
        { lng: '113.499', lat: '27.425', value: 3 },
        { lng: '112.71', lat: '25.471', value: 2 },
        { lng: '114.133', lat: '23.011', value: 1 },
        { lng: '113.302', lat: '22.765', value: 2 },
        { lng: '118.805', lat: '30.935', value: 4 },
        { lng: '120.349', lat: '36.12', value: 2 },
        { lng: '106.108', lat: '30.782', value: 1 },
        { lng: '111.861', lat: '34.749', value: 3 },
        { lng: '102.073', lat: '36.49', value: 1 },
        { lng: '106.244', lat: '27.5', value: 1 },
        { lng: '113.573', lat: '37.851', value: 1 },
        { lng: '113.216', lat: '40.001', value: 1 },
        { lng: '114.524', lat: '23.486', value: 3 },
        { lng: '118.791', lat: '31.725', value: 2 },
        { lng: '115.795', lat: '32.861', value: 1 },
        { lng: '115.805', lat: '33.896', value: 1 },
        { lng: '103.957', lat: '30.694', value: 1 },
        { lng: '117.251', lat: '39.041', value: 1 },
        { lng: '114.32', lat: '29.886', value: 1 },
        { lng: '118.631', lat: '31.169', value: 2 },
        { lng: '110.814', lat: '32.617', value: 1 },
        { lng: '119.656', lat: '30.594', value: 1 },
        { lng: '120.618', lat: '31.513', value: 1 },
        { lng: '85.14', lat: '45.696', value: 2 },
        { lng: '117.027', lat: '39.195', value: 5 },
        { lng: '109.387', lat: '24.706', value: 2 },
        { lng: '118.337', lat: '32.346', value: 1 },
        { lng: '113.06', lat: '36.071', value: 1 },
        { lng: '113.69', lat: '34.594', value: 2 },
        { lng: '111.933', lat: '25.595', value: 1 },
        { lng: '119.905', lat: '28.925', value: 1 },
        { lng: '110.283', lat: '25.373', value: 1 },
        { lng: '101.794', lat: '36.61', value: 1 },
        { lng: '112.733', lat: '34.037', value: 2 },
        { lng: '113.546', lat: '23.203', value: 1 },
        { lng: '108.941', lat: '34.233', value: 1 },
        { lng: '110.891', lat: '34.524', value: 1 },
        { lng: '115.825', lat: '28.707', value: 1 },
        { lng: '113.783', lat: '23.031', value: 1 },
        { lng: '114.045', lat: '30.563', value: 1 },
        { lng: '106.681', lat: '26.514', value: 1 },
        { lng: '113.584', lat: '24.796', value: 1 },
        { lng: '116.822', lat: '35.768', value: 1 },
        { lng: '121.572', lat: '38.968', value: 2 },
        { lng: '113.902', lat: '22.987', value: 1 },
        { lng: '104.202', lat: '30.529', value: 1 },
        { lng: '114.451', lat: '22.978', value: 1 },
        { lng: '120.126', lat: '30.688', value: 7 },
        { lng: '118.446', lat: '32.2', value: 2 },
        { lng: '114.157', lat: '22.787', value: 1 },
        { lng: '112.745', lat: '22.852', value: 2 },
        { lng: '114.926', lat: '25.425', value: 3 },
        { lng: '108.738', lat: '34.377', value: 1 },
        { lng: '120.14', lat: '30.406', value: 2 },
        { lng: '116.58', lat: '32.802', value: 2 },
        { lng: '121.253', lat: '37.507', value: 1 },
        { lng: '107.197', lat: '30.748', value: 1 },
        { lng: '120.91', lat: '28.054', value: 1 },
        { lng: '113.268', lat: '38.722', value: 1 },
        { lng: '111.234', lat: '35.602', value: 1 },
        { lng: '119.598', lat: '31.746', value: 1 },
        { lng: '111.866', lat: '21.905', value: 1 }
      ]
    }
  ]
};
const vchart = new VChart(spec, { dom: CONTAINER_ID });
if (VChart.getMap('china')) {
    vchart.renderAsync();
}
```

## Key Configurations

None

## Related Tutorials

[Map](link)
