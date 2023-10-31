# Taro VChart

- Repository address: [https://github.com/VisActor/VChart/tree/main/packages/taro-vchart](https://github.com/VisActor/VChart/tree/main/packages/taro-vchart)

[Taro](https://docs.taro.zone/docs/) is a widely used cross-platform and cross-framework solution, and VChart also provides the corresponding chart component: `@visactor/taro-vchart`.

## Environment Requirements

**Taro Version: >= 3.3.17**

> Taro has some incompatible break changes due to minor versions, so try to use version 3.3

## Support environment

The environments currently supported by the component are: **WeChat applet** ('weapp'), **Byte applet** ('tt'), **Feishu applet** ('lark'), ** browser**('h5', 'web').

The above environment is declared through the `type` attribute. The `type` attribute value and corresponding environment are as follows:

- `weapp` WeChat applet.
- `tt` byte applet.
- `lark` Feishu applet.
- `h5` browser environment, equivalent to `web`.
- `web` browser environment, equivalent to `h5`.

### Cross-platform Support

If users need to support multiple platforms, they need to dynamically pass the `type` attribute according to `Taro.getEnv()`.

```tsx
<VChart
  type={Taro.getEnv()}
  canvasId="chartId"
  spec={spec}
  style={{ height: '100%', width: '100%' }}
  onChartInit={chart => {}}
  onChartReady={chart => {}}
  onChartUpdate={chart => {}}
/>
```

### Version Requirements

> taro Because the minor version has some incompatible break changes, try to use version 3.3

**WeChat Mini Program**

Need to ensure **Taro version >= 3.3.17**

**Byte Mini Program**

Make sure **Taro Version >= 3.3.17**

**Lark Mini Program**

Make sure **Taro Version >= 3.2.0**, **Lark Version >= 3.45.0**

## Installation

```
npm install @visactor/taro-vchart
```

## API

Usage example of the chart component:

```tsx
<VCHart
  type="tt"
  spec={spec}
  canvasId="pie"
  style={{ height: '35vh', width: '100%' }}
  onChartInit={chart => {
    console.log('init pie');
  }}
  onChartReady={chart => {
    console.log('ready pie');
  }}
  onChartUpdate={chart => {
    console.log('update pie');
  }}
/>
```

| API           | Type     | Description                                                                                                                                                                 |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type          | string   | Configured environment, currently supported environments: **Byte Mini Program** ('tt'), **Lark Mini Program** ('lark'), **Browser** ('h5', 'web')                           |
| canvasId      | String   | Chart id, must be unique                                                                                                                                                    |
| spec          | Object   | Chart configuration item, please refer to [VChart Configuration Item](../../../option)                                                                                      |
| style         | Object   | Chart container style                                                                                                                                                       |
| events        | Object[] | Event binding configuration                                                                                                                                                 |
| options       | Object   | Additional configuration items passed to the VChart instance during initialization, the same as [VChart instantiation configuration items](../../../api/API/vchart#options) |
| onChartInit   | Function | Callback triggered after the chart is initialized                                                                                                                           |
| onChartReady  | Function | Callback triggered after the chart is rendered                                                                                                                              |
| onChartUpdate | Function | Callback triggered after the chart is updated                                                                                                                               |

## Quick Start

```tsx
import React, { useState } from 'react';
import { View } from '@tarojs/components';
import VChart from '@visactor/taro-vchart';

export function Pie() {
  // 1. Prepare chart configuration items and data
  const [spec, setSpec] = useState({
    data: [
      {
        id: 'data1',
        values: [
          {
            value: 335,
            name: 'Direct access'
          },
          {
            value: 310,
            name: 'Email marketing'
          },
          {
            value: 274,
            name: 'Affiliate Advertising'
          },
          {
            value: 235,
            name: 'Video Advertising'
          },
          {
            value: 400,
            name: 'Search Engine'
          }
        ]
      }
    ],
    type: 'pie',
    outerRadius: 0.6,
    innerRadius: 0.5,
    categoryField: 'name',
    valueField: 'value',
    legends: {
      visible: true
    }
  });

  // Pass parameters to the Chart component.
  return (
    <View
      style={{
        border: '1px solid #eeeeee',
        width: '90vw'
      }}
    >
      <VChart
        type="tt"
        spec={spec}
        canvasId="pie"
        style={{ height: '35vh', width: '100%' }}
        onChartInit={() => {
          console.log('init pie');
        }}
        onChartReady={() => {
          console.log('ready pie');
        }}
        onChartUpdate={() => {
          console.log('update pie');
        }}
      />
    </View>
  );
}
```

## Common Examples

### Chart State Update

Inside the chart, `spec` changes are monitored. When `spec` changes, the chart will be updated based on the new `spec`.

In addition, users can also use the rendering interface provided by the VChart instance for chart rendering, updating, and destruction operations.

> The VChart instance can be obtained through the `onChartInit` interface.

#### API

- `chartInstance.renderAsync()` Update chart

- `chartInstance.release()` Destroy chart

- `chartInstance.updateSpec()` Update chart based on Spec

- `chartInstance.updateData()` Update chart based on data

For detailed usage, please refer to: [VChart API](../../../api/API)

#### Example

Compatible with React's state management. Update the configuration item through setState, and the chart can be redrawn.

```tsx
import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import VChart from '@visactor/taro-vchart';

export function Pie() {
  const [spec, setSpec] = useState({
    data: [
      {
        id: 'data1',
        values: [
          {
            value: 335,
            name: 'Direct access'
          },
          {
            value: 310,
            name: 'Email marketing'
          },
          {
            value: 274,
            name: 'Affiliate Advertising'
          },
          {
            value: 235,
            name: 'Video Advertising'
          },
          {
            value: 400,
            name: 'Search Engine'
          }
        ]
      }
    ],
    type: 'pie',
    outerRadius: 0.6,
    innerRadius: 0.5,
    categoryField: 'name',
    valueField: 'value',
    legends: {
      visible: true
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setSpec({
        data: [
          {
            id: 'data1',
            values: [
              {
                value: 335,
                name: 'Direct access'
              },
              {
                value: 310,
                name: 'Email marketing'
              }
            ]
          }
        ],
        type: 'pie',
        outerRadius: 0.6,
        innerRadius: 0.5,
        categoryField: 'name',
        valueField: 'value',
        legends: {
          visible: true
        }
      });
    }, 3000);
  }, []);

  return (
    <View
      style={{
        border: '1px solid #eeeeee',
        width: '90vw'
      }}
    >
      <VChart
        type="tt"
        spec={spec}
        canvasId="pie"
        style={{ height: '35vh', width: '100%' }}
        onChartInit={() => {
          console.log('init pie');
        }}
        onChartReady={() => {
          console.log('ready pie');
        }}
        onChartUpdate={() => {
          console.log('update pie');
        }}
      />
    </View>
  );
}
```
