# Taro VChart

- 仓库地址：[https://github.com/VisActor/VChart/tree/main/packages/taro-vchart](https://github.com/VisActor/VChart/tree/main/packages/taro-vchart)

[Taro](https://docs.taro.zone/docs/) 是目前使用得较多的跨端跨框架解决方案，VChart 也提供了对应的图表组件：`@visactor/taro-vchart`。

## 环境要求

**Taro 版本: >= 3.3.17**

> taro 因为小版本有一些不兼容的 break change，所以尽量使用 3.3 版本

## 支持环境

目前组件支持的环境有：**微信小程序**('weapp')，**字节小程序**('tt')，**飞书小程序**('lark')，**浏览器**('h5', 'web')。

以上环境通过 `type` 属性进行声明，`type` 属性值及对应环境如下：

- `weapp` 微信小程序。
- `tt` 字节小程序。
- `lark` 飞书小程序。
- `h5` 浏览器环境, 与`web`等价。
- `web` 浏览器环境, 与`h5`等价。

### 跨端支持

用户如果需要跨多端支持, 需要根据 `Taro.getEnv()` 动态传入 `type` 属性.

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

### 版本要求

> taro 因为小版本有一些不兼容的 break change，所以尽量使用 3.3 版本

**微信小程序端**

需要确保 **Taro 版本 >= 3.3.17**

**字节小程序端**

需要确保 **Taro 版本 >= 3.3.17**

**飞书小程序端**

需要确保 **Taro 版本 >= 3.2.0**, **飞书版本 >= 3.45.0**

## 安装

```
npm install @visactor/taro-vchart
```

## API

图表组件使用示例如下：

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

| API           | 类型     | 说明                                                                                                    |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| type          | string   | 配置的环境，目前组件支持的环境有：**字节小程序**('tt')，**飞书小程序**('lark')，**浏览器**('h5', 'web') |
| canvasId      | String   | 图表 id, 必确唯一                                                                                       |
| spec          | Object   | 图表配置项, 请参考[VChart 配置项](../../../option)                                                      |
| style         | Object   | 图表容器样式                                                                                            |
| events        | Object[] | 事件绑定配置                                                                                            |
| options       | Object   | 初始化 VChart 实例传入的额外配置项，同 [VChart 实例化配置项](../../../api/API/vchart#options)           |
| onChartInit   | Function | 图表初始化完后触发的回调                                                                                |
| onChartReady  | Function | 图表渲染完毕后触发的回调                                                                                |
| onChartUpdate | Function | 图表更新完毕后触发的回调                                                                                |

## 快速上手

```tsx
import React, { useState } from 'react';
import { View } from '@tarojs/components';
import VChart from '@visactor/taro-vchart';

export function Pie() {
  // 1. 准备图表配置项与数据
  const [spec, setSpec] = useState({
    data: [
      {
        id: 'data1',
        values: [
          {
            value: 335,
            name: 'direct access'
          },
          {
            value: 310,
            name: 'Email Marketing'
          },
          {
            value: 274,
            name: 'Affiliate Advertising'
          },
          {
            value: 235,
            name: 'Video Ad'
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

  // 向Chart组件, 传递参数.
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

## 常用示例

### 图表状态更新

图表内部, 监听了 `spec` 的变化. 当 spec 变化时, 则会基于新的 `spec` 更新图表。

此外用户也可以使用 VChart 实例提供的渲染接口，进行图表的渲染、更新、销毁操作。

> 可以通过 `onChartInit` 接口, 获取到 VChart 实例.

#### API

- `chartInstance.renderAsync()` 更新图表

- `chartInstance.release()` 销毁图表

- `chartInstance.updateSpec()` 基于 Spec 更新图表

- `chartInstance.updateData()` 基于数据更新图表

详细使用方法请参考:[VChart API](../../../api/API)

#### 示例

兼容 React 的状态管理方式. 通过 setState 更新配置项, 图表即可重绘.

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
            name: '直接访问'
          },
          {
            value: 310,
            name: '邮件营销'
          },
          {
            value: 274,
            name: '联盟广告'
          },
          {
            value: 235,
            name: '视频广告'
          },
          {
            value: 400,
            name: '搜索引擎'
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
                name: '直接访问'
              },
              {
                value: 310,
                name: '邮件营销'
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
