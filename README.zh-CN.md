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
  <a href="https://www.visactor.io/vchart">简介</a> •
  <a href="https://www.visactor.io/vchart/example">Demo</a> •
  <a href="https://www.visactor.io/vchart/guide/tutorial_docs/VChart_Website_Guide">教程</a> •
  <a href="https://www.visactor.io/vchart/option/barChart">API</a>•
  <a href="https://www.visactor.io/vchart/guide/tutorial_docs/cross-terminal_and_developer_ecology/node">跨端</a>
</p>

![](https://github.com/visactor/vchart/actions/workflows/bug-server.yml/badge.svg)
![](https://github.com/visactor/vchart/actions/workflows/unit-test.yml/badge.svg)
[![npm Version](https://img.shields.io/npm/v/@visactor/vchart.svg)](https://www.npmjs.com/package/@visactor/vchart)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vchart.svg)](https://www.npmjs.com/package/@visactor/vchart)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/VisActor/VChart/blob/main/CONTRIBUTING.md#your-first-pull-request)

![](https://img.shields.io/badge/language-TypeScript-red.svg) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vchart/blob/main/LICENSE)

</div>

<div align="center">

[English](./README.md) | 简体中文

</div>

<div align="center">

（演示视频）

</div>

## 简介

VChart 是 VisActor 可视化体系中的图表组件库，基于可视化语法库[VGrammar](https://github.com/VisActor/VGrammar) 进行图表逻辑封装，基于可视化渲染引擎 [VRender](https://github.com/VisActor/VRender) 进行组件封装。核心能力如下：

1. **一码多端**：自动适配桌面、H5、多个小程序环境
2. **面向叙事**：综合应用标注、动画、流程控制、叙事模板等一系列增强功能进行叙事可视化创作。
3. **场景沉淀**：面向最终用户沉淀可视化能力，解放开发者生产力

## 仓库简介

本仓库包含如下包：

1. [`vchart`](./packages/vchart/)：核心包，VChart 图表
2. [`react-vchart`](./packages/react-vchart/)：基于 [React](https://react.dev/) 封装的 VChart 图表组件
3. [`taro-vchart`](./packages/taro-vchart/)：基于 [Taro](https://docs.taro.zone/docs/) 封装的 VChart 图表组件
4. [`lark-vchart`](./packages/lark-vchart/)：基于 [飞书小程序](https://open.feishu.cn/document/client-docs/gadget/introduction/host-environment) 封装的 VChart 图表组件
5. [`tt-vchart`](./packages/lark-vchart/): 基于 [抖音小程序](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/introduction/overview/) 封装的 VChart 图表组件
6. [`block-vchart`](./packages/block-vchart/)：基于 [飞书小组件](https://open.feishu.cn/document/client-docs/block/block-introduction) 封装的 VChart 图表组件

## 🔨 使用

### 📦 安装

```bash
# npm
$ npm install @visactor/vchart

# yarn
$ yarn add @visactor/vchart
```

### 📊 一个简单的图表

<img src="https://user-images.githubusercontent.com/135952300/246996854-95cf0db3-42a2-41f9-8f15-8b7bbec1794c.png" style="width: 500px">

```typescript
import VChart from '@visactor/vchart';

const spec = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        { month: 'Monday', sales: 22 },
        { month: 'Tuesday', sales: 13 },
        { month: 'Wednesday', sales: 25 },
        { month: 'Thursday', sales: 29 },
        { month: 'Friday', sales: 38 }
      ]
    }
  ],
  xField: 'month',
  yField: 'sales',
  crosshair: {
    xField: { visible: true }
  }
};

// 'chart' 是图表 dom 容器的 id，比如 <div id="chart"></chart>
const vchart = new VChart(spec, { dom: 'chart' });
vchart.renderAsync();
```

## ⌨️ 开发

首先，全局安装 [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)

```bash
$ npm i --global @microsoft/rush
```

接着将代码 clone 至本地：

```bash
# clone
$ git clone git@github.com:VisActor/VChart.git
$ cd VChart
# 安装依赖
$ rush update
# 开始 vchart 的本地开发
$ rush start
# 开始 react-vchart 的本地开发
$ rush react
```

## 🔗 相关链接

- [主页](https://www.visactor.io/vchart)
- [VCharts 图表示例](https://www.visactor.io/vchart/example)
- [VChart 图表教程](https://www.visactor.io/vchart/guide/tutorial_docs/VChart_Website_Guide)
- [VChart 图表配置项](https://www.visactor.io/vchart/option/)
- [VChart API](https://www.visactor.io/vchart/api/API/vchart)
- [VGrammar](https://www.visactor.io/vgrammar)
- [VRender](https://www.visactor.io/vrender)
- [FAQ](https://www.visactor.io/vchart/guide/tutorial_docs/FAQ)
- [CodeSandbox 模板](https://codesandbox.io/s/the-template-of-visactor-vchart-vl84ww?file=/src/index.ts) 用于 bug 的提交

## 💫 生态

| 项目                                                                                  | 介绍                       |
| ------------------------------------------------------------------------------------- | -------------------------- |
| [React-VChart](https://github.com/VisActor/VChart/tree/develop/packages/react-vchart) | React for @VisActor/VChart |

## 🤝 参与贡献 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/VisActor/VChart/blob/main/CONTRIBUTING.md#your-first-pull-request)

如想参与贡献，请先阅读[行为准则](./CODE_OF_CONDUCT.md) 和[贡献指南](./CONTRIBUTING.zh-CN.md)。

细流成河，终成大海！

<a href="https://github.com/visactor/vchart/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vchart" /></a>
