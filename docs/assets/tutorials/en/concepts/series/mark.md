# Graphic Elements

## Basic Concepts

Graphic elements are the basic drawing units in charts, and all the graphics in the charts are composed of graphic elements. Graphic elements can be points, lines, rectangles, circles, sectors, rings, paths, etc. In a chart, the type of graphic elements is usually determined by the series type. The number and style of the graphic elements are determined by the data, such as the points in a line chart, the columns in a column chart, the sectors in a pie chart, etc.

## Style Attributes of Graphic Elements

There are usually two types of attributes for graphic elements: common attributes and specific attributes. Common attributes are those shared by all graphic elements, such as position, size, rotation angle, transparency, etc. Specific attributes are usually unique to specific types of graphic elements, for example, the points in a line chart can be configured with `shape`, and the sectors in a pie chart can be configured with `inner radius` | `outer radius`, etc.

The configurable attributes of specific graphic elements can be found in the corresponding chart documentation.

## States of Graphic Elements

In VChart, the states of graphic elements are abstracted based on common chart interactions and are divided into the following categories:

- `default`: Default state, the initial state of the graphic element.
- `hover`: Pointer hover state, the state of the graphic element when it is hovered over by the mouse pointer.
- `hover_reverse`: Non-pointer hover state, the state of other graphic elements when a graphic element enters the `hover` state.
- `selected`: Selected state, the state of the graphic element when it is selected.
- `selected_reverse`: Non-selected state, the state of other graphic elements when a graphic element enters the `selected` state.
- `dimension_hover`: Dimension hover state, the state when the mouse pointer hovers within a certain `x` axis area.
- `dimension_hover_reverse`: Non-dimension hover state, the state of other graphic elements when a graphic element enters the `dimension_hover` state.

In different states, graphic elements can be individually configured with styles. For example, in the `hover` state, the color of the graphic element can be configured to be red, while in the `default` state, the color can be configured to be blue. Moreover, multiple states can be active simultaneously. For example, in the `hover` state, the color of the graphic element can be configured to be red, while in the `selected` state, the size can be configured. In this case, when the selected element is hovered over, the color is red and the size is 10. See the example below:

```javascript livedemo
const spec = {
  type: 'line',
  data: [
    {
      id: 'lineData',
      values: [
        { date: 'Monday', class: 'classNo.1', score: 20 },
        { date: 'Monday', class: 'classNo.2', score: 30 },

        { date: 'Tuesday', class: 'classNo.1', score: 25 },
        { date: 'Tuesday', class: 'classNo.2', score: 28 }
      ]
    }
  ],
  seriesField: 'class',
  xField: 'date',
  yField: 'score',
  point: {
    style: {
      fill: 'blue'
    },
    state: {
      hover: {
        style: {
          fill: 'red'
        }
      },
      selected: {
        style: {
          size: 10
        }
      }
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();
```

### Custom States of Graphic Elements

In addition to the built-in interaction states, VChart also supports custom states. The configuration method for custom states is consistent with that for built-in states. However, when configuring, the state name needs to be specified. For example, in the following example, a `custom` state is configured. When the graphic element enters the `custom` state, its color is red.

```javascript livedemo
const spec = {
  type: 'line',
  data: [
    {
      id: 'lineData',
      values: [
        { date: 'Monday', class: 'classNo.1', score: 20 },
        { date: 'Monday', class: 'classNo.2', score: 30 },

        { date: 'Tuesday', class: 'classNo.1', score: 25 },
        { date: 'Tuesday', class: 'classNo.2', score: 28 }
      ]
    }
  ],
  seriesField: 'class',
  xField: 'date',
  yField: 'score',
  point: {
    state: {
      custom: {
        filter: datum => {
          return datum.score >= 30;
        },
        style: {
          fill: 'red'
        }
      }
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();
```

## Style Configuration of Graphic Elements

The most common configuration method can be seen in the examples above, where the style values can be directly configured in the corresponding styles. In addition to this method, VChart also supports two other configuration methods.

### Scale Configuration

By configuring styles through `scale`. The advantage of this method is that by configuring the styles of graphic elements through `scale`, a relationship between the styles of graphic elements and the data can be established. For example, the size of graphic elements can be configured according to the data size, or the color of graphic elements can be configured according to the data color, etc.

```javascript livedemo
const spec = {
  type: 'common',
  data: [
    {
      id: 'data1',
      values: [
        { x: 'Q1', y: 0, type: 'typeA' },
        { x: 'Q1', y: 50, type: 'typeB' },
        { x: 'Q2', y: 100, type: 'typeA' },
        { x: 'Q2', y: 200, type: 'typeB' }
      ]
    },
    {
      id: 'data2',
      values: [
        { x: 'Q1', y: 80, group: 'typeC' },
        { x: 'Q1', y: -50, group: 'typeD' },
        { x: 'Q2', y: 150, group: 'typeC' },
        { x: 'Q2', y: 180, group: 'typeD' }
      ]
    }
  ],
  series: [
    {
      type: 'scatter',
      xField: 'x',
      yField: 'y',
      dataId: 'data1',
      seriesField: 'type',
      point: {
        style: {
          size: {
            field: 'y',
            scale: 'sizeScale'
          },
          shape: {
            field: 'type',
            scale: 'shapeScale'
          }
        }
      }
    },
    {
      type: 'line',
      xField: 'x',
      yField: 'y',
      dataId: 'data2',
      seriesField: 'group',
      point: {
        style: {
          size: {
            field: 'y',
            scale: 'sizeScale'
          },
          shape: {
            field: 'group',
            scale: 'shapeScale'
          }
        }
      }
    }
  ],
  scales: [
    {
      id: 'shapeScale',
      type: 'ordinal',
      domain: [{
        dataId: 'data1',
        fields: ['type']
      }, {
        dataId: 'data2',
        fields: ['group']
      }],
      range: ['circle', 'rect','triangle','diamond']
    },
    {
      id: 'sizeScale',
      type: 'ordinal',
      domain: [{
        dataId: 'data1',
        fields: ['y']
      }, {
        dataId: 'data2',
        fields: ['y']
      }],
      range: [10, 20]
    },
  ],
  axes: [{ orient: 'left' }, { orient: 'bottom' }]
}
// 最终 scale 的 domain 如下：
// shapeScale.domain() === ['typeA','typeB','typeC','typeD'];
// sizeScale.domain() === [-50,200];

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();
```

For the specific usage of scales, please refer to the documentation [scale](../../../option/barChart#scales).

### Function Configuration

By configuring styles through functions, the highest level of flexibility can be achieved, and arbitrary customizations can be made to the styles of graphic elements. For example, in the following example, the color of the graphic element is configured through a function. When the `y` value of the data is greater than or equal to 30, the color of the graphic element is red; otherwise, it is blue.

```javascript livedemo
const spec = {
  type: 'line',
  data: [
    {
      id: 'lineData',
      values: [
        { date: 'Monday', class: 'classNo.1', score: 20 },
        { date: 'Monday', class: 'classNo.2', score: 30 },

        { date: 'Tuesday', class: 'classNo.1', score: 25 },
        { date: 'Tuesday', class: 'classNo.2', score: 28 }
      ]
    }
  ],
  seriesField: 'class',
  xField: 'date',
  yField: 'score',
  point: {
    style: {
      fill: datum => {
        if (datum.score >= 30) {
          return 'red';
        }
        return 'blue';
      }
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();
```