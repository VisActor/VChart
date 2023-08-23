# 自定义主题

在前面的章节中，我们介绍了主题和色板的基本配置。本节将详细介绍如何配置和更新自定义主题。

## 配置主题

VChart 提供了两种方式配置图表主题：通过图表 spec 配置主题以及通过 `ThemeManager` 注册主题。接下来，我们将分别介绍这两种方法的使用。

### 通过 spec 配置主题

在定义图表时，我们可以直接将符合 `ITheme` 类型的主题对象传入图表 spec 的 `theme` 配置项，从而应用这个自定义主题。下面的示例演示了如何为一个柱状图设置一个自定义的主题：

```javascript livedemo
const data = [
  { type: 'oxygen', value: '46.60', formula: 'O', texture: 'circle' },
  { type: 'silicon', value: '27.72', formula: 'Si', texture: 'horizontal-line' },
  { type: 'aluminum', value: '8.13', formula: 'Al', texture: 'vertical-line' },
  { type: 'iron', value: '5', formula: 'Fe', texture: 'rect' },
  { type: 'calcium', value: '3.63', formula: 'Ca', texture: 'grid' },
  { type: 'sodium', value: '2.83', formula: 'Na', texture: 'bias-rl' },
  { type: 'potassium', value: '2.59', formula: 'K', texture: 'diamond' },
  { type: 'others', value: '3.5', formula: 'Others', texture: 'bias-lr' }
];

const theme = {
  colorScheme: {
    default: [
      '#5383F4',
      '#7BCF8E',
      '#FF9D2C',
      '#FFDB26',
      '#7568D9',
      '#80D8FB',
      '#1857A3',
      '#CAB0E8',
      '#FF8867',
      '#B9E493',
      '#2CB4A8',
      '#B9E4E3'
    ]
  },
  series: {
    bar: {
      barMaxWidth: 15,
      label: {
        visible: true,
        position: 'top',
        formatMethod: text => text + '%'
      }
    }
  },
  component: {
    axis: {
      label: {
        style: { fontFamily: 'Times New Roman' }
      }
    }
  },
  markByName: {
    bar: {
      style: {
        cornerRadius: 15
      }
    }
  }
};

const spec = {
  type: 'bar',
  data: [
    {
      id: 'id0',
      values: data
    }
  ],
  theme, // 设置主题
  yField: 'value',
  xField: 'type',
  seriesField: 'type',
  title: {
    visible: true,
    text: 'Surface element content statistics'
  },
  tooltip: {
    mark: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    },
    dimension: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();
```

### 通过 ThemeManager 注册主题

VChart 还提供了一个名为`ThemeManager`的主题管理器，你可以使用它来全局注册自定义主题。同时也可以用 `ThemeManager.setCurrentTheme` 通过主题名称来应用已注册的主题。

```javascript livedemo
const data = [
  { type: 'oxygen', value: '46.60', formula: 'O', texture: 'circle' },
  { type: 'silicon', value: '27.72', formula: 'Si', texture: 'horizontal-line' },
  { type: 'aluminum', value: '8.13', formula: 'Al', texture: 'vertical-line' },
  { type: 'iron', value: '5', formula: 'Fe', texture: 'rect' },
  { type: 'calcium', value: '3.63', formula: 'Ca', texture: 'grid' },
  { type: 'sodium', value: '2.83', formula: 'Na', texture: 'bias-rl' },
  { type: 'potassium', value: '2.59', formula: 'K', texture: 'diamond' },
  { type: 'others', value: '3.5', formula: 'Others', texture: 'bias-lr' }
];

const theme = {
  colorScheme: {
    default: [
      '#5383F4',
      '#7BCF8E',
      '#FF9D2C',
      '#FFDB26',
      '#7568D9',
      '#80D8FB',
      '#1857A3',
      '#CAB0E8',
      '#FF8867',
      '#B9E493',
      '#2CB4A8',
      '#B9E4E3'
    ]
  },
  series: {
    bar: {
      barMaxWidth: 15,
      label: {
        visible: true,
        position: 'top',
        formatMethod: text => text + '%'
      }
    }
  },
  component: {
    axis: {
      label: {
        style: { fontFamily: 'Times New Roman' }
      }
    }
  },
  markByName: {
    bar: {
      style: {
        cornerRadius: 15
      }
    }
  }
};

// 注册主题
VChart.ThemeManager.registerTheme('userTheme', theme);
// 应用主题
VChart.ThemeManager.setCurrentTheme('userTheme');

const spec = {
  type: 'bar',
  data: [
    {
      id: 'id0',
      values: data
    }
  ],
  yField: 'value',
  xField: 'type',
  seriesField: 'type',
  title: {
    visible: true,
    text: 'Surface element content statistics'
  },
  tooltip: {
    mark: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    },
    dimension: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();
```

## 更新主题

在某些应用场景下，我们可能需要根据用户的操作或其他状态来动态更新图表的主题。下面将介绍如何热更新单个图表实例和全局图表实例的主题：

### 更新单个实例的主题

VChart 实例提供了 `setCurrentTheme` 方法用于实现这一功能。用户需要在`ThemeManager`注册主题后，通过主题名称来更新已注册的主题。

```javascript livedemo
const data = [
  { type: 'oxygen', value: '46.60', formula: 'O', texture: 'circle' },
  { type: 'silicon', value: '27.72', formula: 'Si', texture: 'horizontal-line' },
  { type: 'aluminum', value: '8.13', formula: 'Al', texture: 'vertical-line' },
  { type: 'iron', value: '5', formula: 'Fe', texture: 'rect' },
  { type: 'calcium', value: '3.63', formula: 'Ca', texture: 'grid' },
  { type: 'sodium', value: '2.83', formula: 'Na', texture: 'bias-rl' },
  { type: 'potassium', value: '2.59', formula: 'K', texture: 'diamond' },
  { type: 'others', value: '3.5', formula: 'Others', texture: 'bias-lr' }
];

const theme = {
  colorScheme: {
    default: [
      '#5383F4',
      '#7BCF8E',
      '#FF9D2C',
      '#FFDB26',
      '#7568D9',
      '#80D8FB',
      '#1857A3',
      '#CAB0E8',
      '#FF8867',
      '#B9E493',
      '#2CB4A8',
      '#B9E4E3'
    ]
  },
  series: {
    bar: {
      barMaxWidth: 15,
      label: {
        visible: true,
        position: 'top',
        formatMethod: text => text + '%'
      }
    }
  },
  component: {
    axis: {
      label: {
        style: { fontFamily: 'Times New Roman' }
      }
    }
  },
  markByName: {
    bar: {
      style: {
        cornerRadius: 15
      }
    }
  }
};

// 注册主题
VChart.ThemeManager.registerTheme('userTheme', theme);

const spec = {
  type: 'bar',
  data: [
    {
      id: 'id0',
      values: data
    }
  ],
  yField: 'value',
  xField: 'type',
  seriesField: 'type',
  title: {
    visible: true,
    text: 'Surface element content statistics'
  },
  tooltip: {
    mark: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    },
    dimension: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });

vchart.renderAsync().then(() => {
  // 主题热更新
  vchart.setCurrentTheme('userTheme');
});
```

### 通过 ThemeManager 更新所有图表的主题

在`ThemeManager`注册主题后，可以用 `ThemeManager.setCurrentTheme` 通过主题名称来热更新已注册的主题。注意：这个方法将影响页面上的所有图表实例。

```javascript livedemo
const data = [
  { type: 'oxygen', value: '46.60', formula: 'O', texture: 'circle' },
  { type: 'silicon', value: '27.72', formula: 'Si', texture: 'horizontal-line' },
  { type: 'aluminum', value: '8.13', formula: 'Al', texture: 'vertical-line' },
  { type: 'iron', value: '5', formula: 'Fe', texture: 'rect' },
  { type: 'calcium', value: '3.63', formula: 'Ca', texture: 'grid' },
  { type: 'sodium', value: '2.83', formula: 'Na', texture: 'bias-rl' },
  { type: 'potassium', value: '2.59', formula: 'K', texture: 'diamond' },
  { type: 'others', value: '3.5', formula: 'Others', texture: 'bias-lr' }
];

const theme = {
  colorScheme: {
    default: [
      '#5383F4',
      '#7BCF8E',
      '#FF9D2C',
      '#FFDB26',
      '#7568D9',
      '#80D8FB',
      '#1857A3',
      '#CAB0E8',
      '#FF8867',
      '#B9E493',
      '#2CB4A8',
      '#B9E4E3'
    ]
  },
  series: {
    bar: {
      barMaxWidth: 15,
      label: {
        visible: true,
        position: 'top',
        formatMethod: text => text + '%'
      }
    }
  },
  component: {
    axis: {
      label: {
        style: { fontFamily: 'Times New Roman' }
      }
    }
  },
  markByName: {
    bar: {
      style: {
        cornerRadius: 15
      }
    }
  }
};

// 注册主题
VChart.ThemeManager.registerTheme('userTheme', theme);

const spec = {
  type: 'bar',
  data: [
    {
      id: 'id0',
      values: data
    }
  ],
  yField: 'value',
  xField: 'type',
  seriesField: 'type',
  title: {
    visible: true,
    text: 'Surface element content statistics'
  },
  tooltip: {
    mark: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    },
    dimension: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });

vchart.renderAsync().then(() => {
  // 主题热更新
  VChart.ThemeManager.setCurrentTheme('userTheme');
});
```

## 总结

在这个章节中，我们学习了主题和色板配置，以及如何使用自定义主题为图表设置个性化的样式，并介绍了两种注册自定义主题的方法。此外，我们还学习了如何根据需要动态更新图表主题。了解这些技巧后，你将能够更好地使用 VChart 来展示漂亮且易于理解的数据可视化效果。希望本教程能帮助你快速上手，让数据可视化变得更简单，更有趣！
