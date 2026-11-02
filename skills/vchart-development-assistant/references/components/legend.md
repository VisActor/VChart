# 图例配置

图例用于解释颜色或符号编码，不是每张图的必选组件。类别已由标签或分组标题清楚表达时可省略。显示图例时，图例项及颜色、符号应与实际数据编码一致；启用筛选交互时，还需验证筛选行为。

## 基础配置

```javascript
legends: {
  visible: true,
  orient: 'top',
  position: 'middle'
}
```

## 位置配置

### orient - 方向

| 值 | 说明 |
|---|------|
| `'top'` | 顶部 |
| `'bottom'` | 底部 |
| `'left'` | 左侧 |
| `'right'` | 右侧 |

### position - 对齐

| 值 | 说明 |
|---|------|
| `'start'` | 起始位置 |
| `'middle'` | 居中 |
| `'end'` | 结束位置 |

## 布局配置

```javascript
legends: {
  visible: true,
  orient: 'bottom',
  position: 'middle',
  
  // 布局类型
  layoutType: 'normal',     // 'normal' | 'absolute'
  
  // 间距
  padding: {
    top: 10,
    bottom: 10,
    left: 20,
    right: 20
  },
  
  // 与图表的间距
  offsetX: 0,
  offsetY: 0,
  
  // 最大宽高
  maxWidth: 200,
  maxHeight: 100
}
```

## 图例项配置

```javascript
legends: {
  item: {
    // 图例项间距
    spaceCol: 10,           // 列间距
    spaceRow: 5,            // 行间距
    
    // 图例图形
    shape: {
      visible: true,
      space: 4,             // 图形与文字间距
      style: {
        size: 10,
        symbolType: 'circle',  // 'circle' | 'square' | 'rect' | ...
        fillOpacity: 1
      }
    },
    
    // 图例文字
    label: {
      space: 4,
      style: {
        fontSize: 12,
        fill: '#333',
        fontWeight: 'normal'
      },
      // 格式化
      formatMethod: (label, datum, index) => {
        return `${label} (${datum.value})`;
      }
    },
    
    // 数值（用于连续图例）
    value: {
      visible: false,
      space: 4,
      style: {
        fontSize: 12,
        fill: '#666'
      }
    },
    
    // 背景
    background: {
      visible: false,
      style: {
        fill: '#f5f5f5',
        cornerRadius: 2
      }
    }
  }
}
```

## 交互配置

```javascript
legends: {
  // 选择模式
  selectMode: 'multiple',   // 'single' | 'multiple'
  
  // hover 效果
  hover: true,
  
  // 选中状态
  select: true,
  
  // 默认选中
  defaultSelected: ['系列1', '系列2'],
  
  // 反选（取消选中的显示）
  reversed: false
}
```

## 图例状态样式

```javascript
legends: {
  item: {
    shape: {
      state: {
        // 选中状态
        selected: {
          fillOpacity: 1
        },
        // 未选中状态
        unSelected: {
          fillOpacity: 0.3
        },
        // hover状态
        selectedHover: {
          fillOpacity: 1
        },
        unSelectedHover: {
          fillOpacity: 0.5
        }
      }
    },
    label: {
      state: {
        selected: {
          fill: '#333'
        },
        unSelected: {
          fill: '#ccc'
        }
      }
    }
  }
}
```

## 自定义图例内容与样式

离散图例通过 `data` 回调调整图例项及顺序，通过 `item` 配置图标、文字和交互状态样式。可以基于自动生成的图例项修改，也可以返回完全自定义的图例项。

以下示例反转图例顺序、使用圆形图标，并自定义文字显示和样式，同时保留图表生成的颜色等属性：

```javascript
legends: {
  visible: true,
  data: items => items.slice().reverse().map(item => ({
    ...item,
    shape: { ...item.shape, symbolType: 'circle' }
  })),
  item: {
    shape: {
      style: { size: 10 }
    },
    label: {
      formatMethod: label => `${label}（系列）`,
      style: { fontSize: 14, fill: '#333' }
    }
  }
}
```

如果需要自行定义图例内容，可通过回调返回图例项。下面假设图表已使用“系列A/系列B”作为分类，并采用相同的颜色映射：

```javascript
legends: {
  visible: true,
  data: () => [
    { label: '系列A', shape: { fill: '#1890ff', symbolType: 'circle' } },
    { label: '系列B', shape: { fill: '#52c41a', symbolType: 'square' } }
  ]
}
```

注意：`label` 同时是默认筛选键，应与数据分类一致；仅修改显示文字时用 `item.label.formatMethod`。纯展示图例可设置 `filter: false` 关闭筛选，但颜色、符号仍应与图表编码对应。

## 图例标题

```javascript
legends: {
  title: {
    visible: true,
    text: '图例标题',
    space: 10,
    style: {
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#333'
    }
  }
}
```

## 翻页配置

当图例项过多时：

```javascript
legends: {
  pager: {
    visible: true,
    
    // 翻页按钮
    handler: {
      style: {
        fill: '#666'
      },
      state: {
        hover: { fill: '#333' },
        disable: { fill: '#ccc' }
      }
    },
    
    // 页码文字
    textStyle: {
      fill: '#666',
      fontSize: 12
    }
  },
  
  // 最大行/列数
  maxRow: 2,
  maxCol: 4
}
```

## 连续图例（颜色/尺寸）

用于热力图、散点图等连续映射：

```javascript
// 颜色图例
legends: {
  visible: true,
  type: 'color',
  field: 'value',
  orient: 'right',
  
  // 滑块
  rail: {
    width: 200,
    height: 10,
    style: {
      cornerRadius: 5
    }
  },
  
  // 滑块手柄
  handler: {
    visible: true
  },
  
  // 范围文字
  startText: {
    visible: true,
    style: { fill: '#666' }
  },
  endText: {
    visible: true,
    style: { fill: '#666' }
  }
}

// 尺寸图例
legends: {
  visible: true,
  type: 'size',
  field: 'population',
  orient: 'bottom'
}
```

## 多图例

```javascript
// 使用数组配置多个图例
legends: [
  {
    visible: true,
    orient: 'top',
    seriesId: ['bar'],      // 关联的系列
    id: 'legend1'
  },
  {
    visible: true,
    orient: 'right',
    seriesId: ['scatter'],
    id: 'legend2'
  }
]
```

## 完整示例

```javascript
legends: {
  visible: true,
  orient: 'top',
  position: 'start',
  padding: { left: 50 },
  
  title: {
    visible: true,
    text: '产品类型',
    style: {
      fontSize: 12,
      fontWeight: 'bold'
    }
  },
  
  item: {
    spaceCol: 20,
    spaceRow: 8,
    
    shape: {
      space: 6,
      style: {
        size: 12,
        symbolType: 'square',
        cornerRadius: 2
      }
    },
    
    label: {
      style: {
        fontSize: 12,
        fill: '#333'
      }
    }
  },
  
  selectMode: 'multiple',
  hover: true,
  
  pager: {
    visible: true,
    handler: {
      style: { fill: '#666' }
    }
  },
  
  maxRow: 1
}
```
