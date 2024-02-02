# ReactLynx

ReactLynx is a React syntax version of Lynx, a high-performance cross-end framework for quickly building native views using web technology stacks. VChart also provides chart rendering capabilities based on ReactLynx 3.0.

## How to get Lynx-VChart

### npm package

You can directly install the lynx-vchart dependency package (this package is an intranet package) in the ReactLynx project: @dp/lynx-vchart.

## Unified chart tag <VChart />

<VChart /> receives a complete **spec** as the chart definition, and its **spec** data structure is exactly the same as that of VChart, so developers can send any spec that is legal for VChart to Lynx-VChart for chart rendering.

Example:

```javascript
import VChart from '@dp/lynx-vchart';
export function PieChart() {
  const spec = {
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: [
          { type: 'oxygen', value: '46.60' },
          { type: 'silicon', value: '27.72' },
          { type: 'aluminum', value: '8.13' },
          { type: 'iron', value: '5' },
          { type: 'calcium', value: '3.63' },
          { type: 'sodium', value: '2.83' },
          { type: 'potassium', value: '2.59' },
          { type: 'others', value: '3.5' }
        ]
      }
    ],
    outerRadius: 0.8,
    valueField: 'value',
    categoryField: 'type',
    title: {
      visible: true,
      text: 'Statistics of Surface Element Content'
    },
    legends: {
      visible: true,
      orient: 'left'
    },
    label: {
      visible: true
    },
    tooltip: {
      mark: {
        content: [
          {
            key: datum => datum['type'],
            value: datum => datum['value'] + '%'
          }
        ]
      }
    }
  };

  return (
    <div className="cusomized-pie-chart">
      <VChart spec={spec} onReady={() => console.log('ready')} width="700rpx" height="900rpx" />
    </div>
  );
}
```

### Props

If you already have a spec chart description, using the unified chart tag is a faster way, just import the VChart component:

```typescript
import VChart from '@dp/lynx-vchart';
```

The VChart component is the encapsulated ReactLynx component, and its props definition is as follows:

```typescript
interface VChartProps extends EventsProps {
  /** 图表定义 */
  spec: any;
  /** 图表配置 */
  options?: ChartOptions;
  /** 图表渲染完成事件 */
  onReady?: (instance: VChart, isInitial: boolean) => void;
  /** throw error when chart run into an error */
  onError?: (err: Error) => void;
  /**
   * 切换到同步渲染
   *
   * @since 1.8.3
   **/
  useSyncRender?: boolean;
  /**
   * props更新的时候，跳过所有函数的检查，即所有的函数都认为没有更新
   *
   * @since 1.6.5
   **/
  skipFunctionDiff?: boolean;
}
```

onReady is a built-in callback event that is triggered when the chart is rendered or updated. Its input parameters represent the chart instance object and whether it is the first rendering.

For example, developers can register the callback events that need to be triggered on the chart instance during the first rendering to achieve chart interaction functions.

## Theme style

If you use a custom theme in VChart, you can achieve it in two ways, one is to define the theme in spec, and the other is to register the theme through ThemeManager. Because in Lynx-VChart, there is no need to reference the VChart npm package. Therefore, Lynx-VChart exposes the VChart base class, named VChartCore, which is convenient for developers to register custom themes on the VChart base class through static methods.

Refer to VChart Theme for VChart theme configuration.

Note that for the case of using VChart on demand, it is recommended to directly call the VChart API to use the theme.

## Summary

Through this tutorial, you should have learned how to use VChart to create a simple bar chart in the LynxVChart project. At the same time,

```

```
