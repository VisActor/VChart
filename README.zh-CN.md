<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VChart</h1>
</div>

<div align="center">

VChart，不只是开箱即用的多端图表库，更是生动灵活的数据故事讲述者。

<p align="center">
  <a href="">简介</a> •
  <a href="">demo</a> •
  <a href="">教程</a> •
  <a href="">API</a>•
  <a href="">跨端</a>
</p>

[![npm Version](https://img.shields.io/npm/v/@visactor/vchart.svg)](https://www.npmjs.com/package/@visactor/vchart)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vchart.svg)](https://www.npmjs.com/package/@visactor/vchart)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vchart/blob/main/LICENSE)

</div>

<div align="center">

[English](./README.md) | 简体中文

</div>

<div align="center">

（演示视频）

</div>

# 简介

VChart 是 VisActor 可视化体系中的图表组件库，基于可视化语法库[VGrammar](https://github.com/VisActor/VGrammar) 进行图表逻辑封装，基于可视化渲染引擎 [VRender](https://github.com/VisActor/VRender) 进行组件封装。核心能力如下：

1. 一码多端：自动适配桌面、H5、多个小程序环境
2. 面向叙事：综合应用标注、动画、流程控制、叙事模板等一系列增强功能进行叙事可视化创作。
3. 场景沉淀：面向最终用户沉淀可视化能力，解放开发者生产力

# 仓库简介

本仓库包含如下 package

1. vchart 图表组件
2. react-vchart React 版 VChart

# 使用

## 安装

[npm package](https://www.npmjs.com/package/@visactor/vchart)

```bash
// npm
npm install @visactor/vchart

// yarn
yarn add @visactor/vchart
```

## 快速上手

```javascript
const spec = {
  type: 'common',
  data: {
    values: [
      {
        time: '2:00',
        value: 8,
        type: '某音'
      },
      {
        time: '4:00',
        value: 9,
        type: '某音'
      },
      {
        time: '6:00',
        value: 11,
        type: '某音'
      },
      {
        time: '8:00',
        value: 14,
        type: '某音'
      },
      {
        time: '10:00',
        value: 16,
        type: '某音'
      },
      {
        time: '12:00',
        value: 17,
        type: '某音'
      },
      {
        time: '14:00',
        value: 17,
        type: '某音'
      },
      {
        time: '16:00',
        value: 16,
        type: '某音'
      },
      {
        time: '18:00',
        value: 15,
        type: '某音'
      },

      {
        time: '2:00',
        value: 7,
        type: 'B站'
      },
      {
        time: '4:00',
        value: 8,
        type: 'B站'
      },
      {
        time: '6:00',
        value: 9,
        type: 'B站'
      },
      {
        time: '8:00',
        value: 10,
        type: 'B站'
      },
      {
        time: '10:00',
        value: 9,
        type: 'B站'
      },
      {
        time: '12:00',
        value: 12,
        type: 'B站'
      },
      {
        time: '14:00',
        value: 14,
        type: 'B站'
      },
      {
        time: '16:00',
        value: 12,
        type: 'B站'
      },
      {
        time: '18:00',
        value: 14,
        type: 'B站'
      }
    ]
  },
  color: ['#6690F2', '#70D6A3'],
  series: [
    {
      type: 'bar',
      xField: 'time',
      yField: 'value',
      stack: true,
      seriesField: 'type'
    }
  ],
  legends: {
    visible: true,
    orient: 'right'
  },
  axes: [
    {
      orient: 'bottom',
      type: 'band'
    },
    {
      orient: 'left',
      type: 'linear'
    }
  ]
};

/**
 * 图表容器 dom id: CONTAINER_ID
 * VChart 类: VChart
 *
 */
const vChart = new VChart(spec, { dom: CONTAINER_ID });
await vChart.renderAsync();
```

##

[更多 demo 和详细教程](https://visactor.io/vchart)

# 相关链接

- [官网](https://visactor.io/vchart)

- [主题配置](https://visactor.io/vchart)
- [React-VChart](https://visactor.io/react-vchart)
- [跨端](https://visactor.io/vchart)

# 生态

| 项目                                             | 介绍                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| [React 组件库](https://visactor.io/react-vchart) | 基于 [VisActor/VChart](https://visactor.io/vchart) 的 React 图表 组件库。 |
| [智能生成组件](https://visactor.io/ai-vchart)    | 基于 AI 的智能图表生成组件                                                |

# 参与贡献

如想参与贡献，请先阅读 [行为准则](./CODE_OF_CONDUCT.md) 和 [贡献指南](./CONTRIBUTING.zh-CN.md)。

细流成河，终成大海！

<a href="https://github.com/visactor/vchart/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vchart" /></a>

# 许可证

[MIT 协议](./LICENSE)
