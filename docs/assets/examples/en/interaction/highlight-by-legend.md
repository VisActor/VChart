---
category: demo
group: interaction
title: Legend Trigger Series Highlight
keywords: commonChart
order: 42-1
cover:
option: commonChart
---

# Legend Trigger Series Highlight

By configuring the `element-highlight-by-legend` interaction type, the legend triggers the highlight and blur states of the graphic elements.

## Key Configuration

- `interactions` set the interaction of the series
- `bar.state.highlight` set the style corresponding to the `highlight` state of the bar graphic element
- `bar.state.blur` set the style corresponding to the `blur` state of the bar graphic element
- `line.state.highlight` set the style corresponding to the `highlight` state of the line graphic element
- `line.state.blur` set the style corresponding to the `blur` state of the line graphic element
- `point.state.highlight` set the style corresponding to the `highlight` state of the point graphic element
- `point.state.blur` set the style corresponding to the `blur` state of the point graphic element
- `label.syncState` set the label state to synchronize with the sector state
- `label.state.highlight` set the style of the label in the `highlight` state

## Code Demo

```javascript livedemo
const spec = {
  type: 'common',
  seriesField: 'color',
  data: [
    {
      id: 'id0',
      values: [
        { x: '周一', type: '早餐', y: 15 },
        { x: '周一', type: '午餐', y: 25 },
        { x: '周二', type: '早餐', y: 12 },
        { x: '周二', type: '午餐', y: 30 },
        { x: '周三', type: '早餐', y: 15 },
        { x: '周三', type: '午餐', y: 24 },
        { x: '周四', type: '早餐', y: 10 },
        { x: '周四', type: '午餐', y: 25 },
        { x: '周五', type: '早餐', y: 13 },
        { x: '周五', type: '午餐', y: 20 },
        { x: '周六', type: '早餐', y: 10 },
        { x: '周六', type: '午餐', y: 22 },
        { x: '周日', type: '早餐', y: 12 },
        { x: '周日', type: '午餐', y: 19 }
      ]
    },
    {
      id: 'id1',
      values: [
        { x: '周一', type: '饮料', y: 22 },
        { x: '周二', type: '饮料', y: 43 },
        { x: '周三', type: '饮料', y: 33 },
        { x: '周四', type: '饮料', y: 22 },
        { x: '周五', type: '饮料', y: 10 },
        { x: '周六', type: '饮料', y: 30 },
        { x: '周日', type: '饮料', y: 50 }
      ]
    }
  ],
  series: [
    {
      type: 'bar',
      id: 'bar',
      dataIndex: 0,
      label: {
        visible: true,
        syncState: true,
        state: {
          highlight: { fontWeight: 'bold' },
          blur: { opacity: 0.2 }
        }
      },
      seriesField: 'type',
      dataIndex: 0,
      xField: ['x', 'type'],
      yField: 'y',
      bar: {
        state: {
          highlight: {
            stroke: '#000',
            lineWidth: 2
          },
          blur: {
            opacity: 0.2
          }
        }
      },
      interactions: [
        {
          type: 'element-highlight-by-legend'
        }
      ]
    },
    {
      type: 'line',
      id: 'line',
      dataIndex: 1,
      label: {
        visible: true,
        syncState: true,
        state: {
          highlight: { fontWeight: 'bold' },
          blur: { opacity: 0.2 }
        }
      },
      seriesField: 'type',
      xField: 'x',
      yField: 'y',
      stack: false,
      line: {
        state: {
          highlight: {
            lineWidth: 4
          },
          blur: {
            opacity: 0.2
          }
        }
      },
      point: {
        state: {
          highlight: {
            size: 10
          },
          blur: {
            opacity: 0.2
          }
        }
      },
      interactions: [
        {
          type: 'element-highlight-by-legend'
        }
      ]
    }
  ],
  axes: [
    { orient: 'left', seriesIndex: [0] },
    { orient: 'right', seriesId: ['line'], gird: { visible: false } },
    { orient: 'bottom', label: { visible: true }, type: 'band' }
  ],
  legends: {
    visible: true,
    orient: 'bottom'
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## Related Tutorials
