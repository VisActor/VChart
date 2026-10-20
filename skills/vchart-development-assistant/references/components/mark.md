# 标注与自定义图元

按需求定位对应章节：

- [MarkLine：标注线](#markline---标注线)
- [MarkArea：标注区域](#markarea---标注区域)
- [MarkPoint：标注点](#markpoint---标注点)
- [标签位置](#标签位置配置)与[完整标注示例](#完整示例)
- [customMark：空数据与居中提示](#空数据与居中提示)

## MarkLine - 标注线

### 基础配置

```javascript
markLine: [
  {
    y: 100,              // Y轴位置
    // 或
    x: 'A',              // X轴位置（类目）
    
    // 标签
    label: {
      visible: true,
      text: '平均值'
    }
  }
]
```

### 水平参考线

```javascript
markLine: [
  {
    y: 150,
    line: {
      style: {
        stroke: '#f5222d',
        lineWidth: 2,
        lineDash: [4, 4]
      }
    },
    label: {
      visible: true,
      text: '目标值: 150',
      position: 'end',
      style: {
        fill: '#f5222d',
        fontSize: 12
      }
    }
  }
]
```

### 垂直参考线

```javascript
markLine: [
  {
    x: '3月',
    line: {
      style: {
        stroke: '#1890ff',
        lineWidth: 1,
        lineDash: [4, 4]
      }
    },
    label: {
      visible: true,
      text: '转折点',
      position: 'start'
    }
  }
]
```

### 使用数据计算

```javascript
markLine: [
  {
    // 使用聚合函数
    y: 'average',        // 'average' | 'min' | 'max' | 'median'
    
    // 或自定义计算
    y: (data) => {
      const sum = data.reduce((acc, d) => acc + d.value, 0);
      return sum / data.length;
    },
    
    label: {
      visible: true,
      text: (markData) => `平均值: ${markData.y.toFixed(2)}`
    }
  }
]
```

### 斜线标注

```javascript
markLine: [
  {
    coordinates: [
      { x: 'A', y: 50 },   // 起点
      { x: 'D', y: 200 }   // 终点
    ],
    line: {
      style: {
        stroke: '#722ed1',
        lineWidth: 2
      }
    },
    label: {
      visible: true,
      text: '趋势线'
    }
  }
]
```

## MarkArea - 标注区域

### 基础配置

```javascript
markArea: [
  {
    y: 100,              // 起始Y
    y1: 200,             // 结束Y
    
    area: {
      style: {
        fill: 'rgba(24, 144, 255, 0.1)'
      }
    },
    
    label: {
      visible: true,
      text: '正常范围'
    }
  }
]
```

### 水平区域

```javascript
markArea: [
  {
    y: 80,
    y1: 120,
    area: {
      style: {
        fill: 'rgba(82, 196, 26, 0.2)',
        stroke: '#52c41a',
        lineWidth: 1,
        lineDash: [4, 4]
      }
    },
    label: {
      visible: true,
      text: '达标区间',
      position: 'right',
      style: {
        fill: '#52c41a',
        fontSize: 12
      }
    }
  }
]
```

### 垂直区域（类目范围）

```javascript
markArea: [
  {
    x: '1月',
    x1: '3月',
    area: {
      style: {
        fill: 'rgba(250, 173, 20, 0.1)'
      }
    },
    label: {
      visible: true,
      text: 'Q1',
      position: 'top'
    }
  }
]
```

### 多个区域

```javascript
markArea: [
  {
    y: 0,
    y1: 60,
    area: {
      style: { fill: 'rgba(245, 34, 45, 0.1)' }
    },
    label: {
      visible: true,
      text: '低',
      position: 'insideLeft'
    }
  },
  {
    y: 60,
    y1: 140,
    area: {
      style: { fill: 'rgba(250, 173, 20, 0.1)' }
    },
    label: {
      visible: true,
      text: '中',
      position: 'insideLeft'
    }
  },
  {
    y: 140,
    y1: 200,
    area: {
      style: { fill: 'rgba(82, 196, 26, 0.1)' }
    },
    label: {
      visible: true,
      text: '高',
      position: 'insideLeft'
    }
  }
]
```

## MarkPoint - 标注点

### 基础配置

```javascript
markPoint: [
  {
    coordinate: {
      x: '3月',
      y: 180
    },
    itemContent: {
      type: 'text',
      text: '峰值'
    }
  }
]
```

### 带箭头的标注

```javascript
markPoint: [
  {
    coordinate: {
      x: '5月',
      y: 250
    },
    itemLine: {
      visible: true,
      decorativeLine: {
        visible: true
      },
      startSymbol: {
        visible: true,
        style: {
          fill: '#f5222d'
        }
      }
    },
    itemContent: {
      type: 'text',
      text: '历史最高',
      style: {
        fill: '#f5222d',
        fontSize: 12,
        fontWeight: 'bold'
      }
    }
  }
]
```

### 带图片的标注

```javascript
markPoint: [
  {
    coordinate: {
      x: 'A',
      y: 100
    },
    itemContent: {
      type: 'image',
      image: 'path/to/icon.png',
      width: 20,
      height: 20
    }
  }
]
```

### 富文本标注

```javascript
markPoint: [
  {
    coordinate: {
      x: '6月',
      y: 300
    },
    itemContent: {
      type: 'richText',
      richText: {
        text: [
          { text: '⬆ ', fill: '#52c41a', fontSize: 14 },
          { text: '+25%', fill: '#52c41a', fontSize: 12, fontWeight: 'bold' }
        ]
      }
    }
  }
]
```

## 标签位置配置

### MarkLine 标签位置

| 位置 | 说明 |
|-----|------|
| `'start'` | 线起点 |
| `'middle'` | 线中间 |
| `'end'` | 线终点 |
| `'insideStartTop'` | 起点内上方 |
| `'insideEndBottom'` | 终点内下方 |

### MarkArea 标签位置

| 位置 | 说明 |
|-----|------|
| `'left'` | 左侧 |
| `'right'` | 右侧 |
| `'top'` | 顶部 |
| `'bottom'` | 底部 |
| `'insideLeft'` | 内部左侧 |
| `'insideRight'` | 内部右侧 |
| `'insideTop'` | 内部顶部 |
| `'insideBottom'` | 内部底部 |

## 完整示例

```javascript
const spec = {
  type: 'line',
  data: [/* 数据 */],
  xField: 'month',
  yField: 'value',
  
  // 参考线
  markLine: [
    {
      y: 'average',
      line: {
        style: {
          stroke: '#1890ff',
          lineWidth: 2,
          lineDash: [4, 4]
        }
      },
      label: {
        visible: true,
        text: (markData) => `平均值: ${markData.y.toFixed(0)}`,
        position: 'end',
        style: {
          fill: '#1890ff',
          fontSize: 12
        },
        labelBackground: {
          visible: true,
          style: {
            fill: '#fff',
            stroke: '#1890ff',
            cornerRadius: 4
          },
          padding: { top: 4, bottom: 4, left: 8, right: 8 }
        }
      }
    }
  ],
  
  // 区域标注
  markArea: [
    {
      y: 0,
      y1: 100,
      area: {
        style: {
          fill: 'rgba(245, 34, 45, 0.05)'
        }
      },
      label: {
        visible: true,
        text: '警戒区',
        position: 'insideLeft',
        style: {
          fill: '#f5222d',
          fontSize: 10
        }
      }
    }
  ],
  
  // 点标注
  markPoint: [
    {
      coordinate: {
        x: '6月',
        y: 280
      },
      itemLine: {
        visible: true,
        type: 'type-s',
        startSymbol: {
          visible: true,
          style: { fill: '#52c41a' }
        }
      },
      itemContent: {
        type: 'text',
        text: '本月最高 ↑',
        style: {
          fill: '#52c41a',
          fontSize: 12
        }
      }
    }
  ]
};
```

## 空数据与居中提示

适用于任意图表的空数据创建、清空、筛选无结果和恢复数据，不依赖业务字段或固定文案。

### 数据与提示分开

- 保留真实空数据 `values: []`，不补造占位数据，不保留上一版图形。判断是否为空应依据当前有效记录；“记录存在但数值全为 0”不等于“没有记录”，按图表语义另行说明。
- 用户明确要求图中央提示时，标题或副标题不能代替中央提示。使用图表级 `customMark`，不放进依赖业务数据逐条生成的 series mark。
- 独立提示无需 `dataId`、`dataIndex`、`dataKey` 或虚构数据集。只有确实需要逐条绑定已声明数据时才使用这些属性。

### 坐标必须来自布局

`customMark.style.x/y` 是图形像素坐标，不是 CSS：不要写 `'50%'`，也不要把固定画布宽高的一半当成响应式居中。VChart 2.0.21 的样式回调上下文提供 `context.vchart`，可获取当前画布尺寸：

```js
function emptyStateMarks(isEmpty, message) {
  if (!isEmpty) return [];
  return [{
    type: 'text',
    interactive: false,
    style: {
      x: (_datum, context) => context.vchart.getChart().getCanvasRect().width / 2,
      y: (_datum, context) => context.vchart.getChart().getCanvasRect().height / 2,
      text: message,
      textAlign: 'center',
      textBaseline: 'middle',
      fontSize: 18,
      fill: '#64748b'
    }
  }];
}
// 在基于当前数据重新构造 spec 时使用：
// customMark: emptyStateMarks(currentRows.length === 0, requestedMessage)
```

这是整个画布的中央位置。若用户要求绘图区中央，应读取目标 region 的布局起点和尺寸，使用同一坐标系；不能把 customMark 自身文字的包围盒误当作绘图区。长提示需按可用宽度分行或缩短辅助说明，窄屏下不能溢出。

数据恢复时重新计算空状态并更新 `customMark`；只调用 `updateData` 不会重新执行构造 spec 的条件表达式。恢复数据、再次清空都应更新提示状态，不能把首次空状态固化进回调闭包。

静态校验不执行布局回调；提示的位置和可见性需在实际渲染环境中确认。
