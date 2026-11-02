# Tooltip 配置

## 基础配置

```javascript
tooltip: {
  visible: true,
  trigger: 'hover',   // 悬停触发；其他触发方式见下文
  activeType: 'mark'  // 内容类型：'mark' | 'dimension' | 'group'
}
```

## 触发方式 (trigger)

| 值 | 说明 | 适用场景 |
|---|------|---------|
| `'hover'` | 悬停触发 tooltip | 默认交互 |
| `'click'` | 点击触发 tooltip | 移动端/点选场景 |
| `'none'` | 不自动触发 tooltip | 配合 API 手动控制 |
| `['hover', 'click']` | 组合内置触发方式 | 同时支持悬停与点击 |
| `{ eventType, source?, consume? }` | 自定义事件对象，也可与内置触发方式组合为数组 | 高级事件编排 |

自定义事件必须使用对象形式，不能将事件名直接写成字符串或字符串数组。完整类型见 [ITooltipSpec](../type-details/ITooltipSpec-Type-Definition.md#trigger-configuration)。

```javascript
// 默认：hover 触发
tooltip: {
  trigger: 'hover'
}

// click 触发
tooltip: {
  trigger: 'click'
}

// 不自动触发（手动控制）
tooltip: {
  trigger: 'none'
}

// 自定义事件，也可与 'hover' / 'click' 组合为数组
tooltip: {
  trigger: { eventType: 'pointerdown', source: 'chart' }
}
```

> `trigger` 负责“何时触发”；`activeType` 负责“展示 mark / dimension / group 哪种 tooltip 内容”。

## 内容配置

### 回调参数层级

- `content: (data, params) => [...]` 是内容工厂，接收 `TooltipData` 集合（如 mark 类型的 `[{ datum: [图元数据], series }]`），不是单条记录。不要直接访问 `data.value`。
- `content: [{ key: ..., value: (datum, params) => ... }]` 中的行回调接收当前图元数据，不保证就是输入的业务记录；`title.value` 同理。普通柱状图等可直接读取业务字段，经过布局转换的图表需按该图表的数据结构取值。只需格式化字段时优先使用行回调。
- Treemap 的行回调和标题回调接收布局节点。先按 [Treemap 数据与回调](../chart/treemap.md) 解包，再读取业务字段；标签或配色中的解包不会自动应用到 tooltip。完整示例见 [hierarchy-treemap.js](../examples/treemap/hierarchy-treemap.js)。
- 工厂返回的是行配置，仍可让行的 `value` 回调读取当前记录。dimension/group 的集合结构不同，不要把 mark 的集合索引写成通用取值逻辑。

### mark 类型内容

以下示例适用于业务字段直接位于图元数据上的普通图表；Treemap 使用上面的专项取值方式。

```javascript
tooltip: {
  mark: {
    // 标题
    title: {
      visible: true,
      value: (datum) => datum.category
    },
    
    // 内容
    content: [
      {
        key: '数值',                    // 左侧标签
        value: (datum) => datum.value   // 右侧数值
      },
      {
        key: '占比',
        value: (datum) => `${(datum.ratio * 100).toFixed(1)}%`
      }
    ]
  }
}
```

### dimension 类型内容（按维度聚合）

```javascript
tooltip: {
  trigger: 'hover',
  activeType: 'dimension',
  dimension: {
    title: {
      value: (datum) => datum[0]?.category
    },
    content: [
      {
        key: (datum) => datum.type,
        value: (datum) => datum.value
      }
    ]
  }
}
```

## 模板字符串格式化

`key` / `value` 接收普通字符串或回调；模板使用 `keyFormatter` / `valueFormatter`，不能把模板写进 value 后期待求值。例如 `content: [{key: '数量', valueFormatter: '{value:,.0f}'}]`。完整类型见 [ITooltipSpec](../type-details/ITooltipSpec-Type-Definition.md)。

## 内容格式化（函数方式）

### 基础格式化

```javascript
tooltip: {
  mark: {
    content: [
      {
        key: '销售额',
        value: (datum) => {
          // 数值格式化
          return datum.value.toLocaleString() + ' 元';
        }
      }
    ]
  }
}
```

### 条件显示

```javascript
tooltip: {
  mark: {
    content: [
      {
        key: '状态',
        value: (datum) => datum.value > 100 ? '达标' : '未达标',
        visible: (datum) => datum.value !== null  // 条件显示
      }
    ]
  }
}
```

### 自定义形状颜色

```javascript
tooltip: {
  mark: {
    content: [
      {
        key: '系列A',
        value: (datum) => datum.value,
        shapeType: 'circle',
        shapeColor: '#1890ff'
      }
    ]
  }
}
```

## 样式配置

```javascript
tooltip: {
  style: {
    // 面板样式
    panel: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: {
        color: '#333',
        width: 1,
        radius: 4
      },
      shadow: {
        x: 0,
        y: 2,
        blur: 10,
        color: 'rgba(0, 0, 0, 0.2)'
      },
      padding: {
        top: 10,
        bottom: 10,
        left: 14,
        right: 14
      }
    },
    
    // 标题样式
    titleLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#fff'
    },
    
    // 内容键样式
    keyLabel: {
      fontSize: 12,
      fill: '#aaa'
    },
    
    // 内容值样式
    valueLabel: {
      fontSize: 12,
      fill: '#fff'
    },
    
    // 形状样式
    shape: {
      size: 8,
      spacing: 6
    }
  }
}
```

## 位置配置

```javascript
tooltip: {
  // 偏移
  offset: { x: 10, y: 10 },
  
  // dimension tooltip 可通过回调自定义位置
  dimension: {
    position: (event, params) => {
      return {
        x: event.canvasX + 20,
        y: event.canvasY + 20
      };
    }
  },

  // mark tooltip 也支持单独配置
  mark: {
    position: (event, params) => {
      return {
        x: event.canvasX + 12,
        y: event.canvasY + 12
      };
    }
  },
  
  // 限制在图表区域内
  confine: true
}
```

## 交互配置

```javascript
tooltip: {
  // 进入延迟
  enterable: true,        // 鼠标可进入tooltip
  
  // 显示延迟
  showDelay: 50,
  
  // 隐藏延迟  
  hideTimer: 100,

  // 显示触发与关闭触发可分离
  trigger: 'hover',
  triggerOff: 'hover',
  
  // 过渡动画
  transitionDuration: 100
}
```

## 自定义渲染

### 使用 renderMode

```javascript
tooltip: {
  renderMode: 'html',      // 'canvas' | 'html'
  
  // HTML模式可以完全自定义
  handler: {
    showTooltip: (activeType, data, params) => {
      // 自定义显示逻辑
      const container = document.getElementById('custom-tooltip');
      container.innerHTML = `<div>${data[0].datum.value}</div>`;
      container.style.display = 'block';
    },
    hideTooltip: () => {
      document.getElementById('custom-tooltip').style.display = 'none';
    }
  }
}
```

### DOM 自定义

```javascript
tooltip: {
  mark: {
    content: [
      {
        // 使用DOM配置
        hasShape: true,
        key: (datum) => datum.type,
        value: (datum) => {
          return {
            type: 'rich',
            text: [
              { text: datum.value, fill: '#333', fontWeight: 'bold' },
              { text: ' 元', fill: '#999' }
            ]
          };
        }
      }
    ]
  }
}
```

## 禁用 Tooltip

```javascript
// 完全禁用
tooltip: {
  visible: false
}

// 或在特定系列禁用
series: [
  {
    type: 'bar',
    tooltip: {
      visible: false
    }
  }
]
```

## 完整示例

```javascript
tooltip: {
  visible: true,
  trigger: 'hover',
  activeType: 'dimension',
  
  dimension: {
    title: {
      value: (datum) => datum[0]?.month || ''
    },
    content: [
      {
        key: (datum) => datum.type,
        value: (datum) => `${datum.value.toLocaleString()} 万元`,
        shapeType: 'square'
      }
    ]
  },
  
  style: {
    panel: {
      backgroundColor: '#fff',
      border: {
        color: '#e8e8e8',
        width: 1,
        radius: 8
      },
      shadow: {
        x: 0,
        y: 4,
        blur: 12,
        color: 'rgba(0, 0, 0, 0.15)'
      },
      padding: { top: 12, bottom: 12, left: 16, right: 16 }
    },
    titleLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#333'
    },
    keyLabel: {
      fontSize: 12,
      fill: '#666'
    },
    valueLabel: {
      fontSize: 12,
      fill: '#333',
      fontWeight: 500
    }
  },
  
  enterable: false,
  offset: { x: 8, y: 8 },
  confine: true,
  hideTimer: 120,
  transitionDuration: 150
}
```
