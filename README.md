<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VChart</h1>
</div>

<div align="center">

VChart, more than just a cross-platform charting library, but also an expressive data storyteller.

<p align="center">
  <a href="https://www.visactor.io/vchart">Introduction</a> •
  <a href="https://www.visactor.io/vchart/example">Demo</a> •
  <a href="https://www.visactor.io/vchart/guide/tutorial_docs/VChart_Website_Guide">Tutorial</a> •
  <a href="https://www.visactor.io/vchart/option/barChart">API</a>•
  <a href="https://www.visactor.io/vchart/guide/tutorial_docs/cross-terminal_and_developer_ecology/node">Cross-Platform</a>
</p>

![](https://github.com/visactor/vchart/actions/workflows/bug-server.yml/badge.svg)
![](https://github.com/visactor/vchart/actions/workflows/unit-test.yml/badge.svg)
[![npm Version](https://img.shields.io/npm/v/@visactor/vchart.svg)](https://www.npmjs.com/package/@visactor/vchart)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vchart.svg)](https://www.npmjs.com/package/@visactor/vchart)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/VisActor/VChart/blob/main/CONTRIBUTING.md#your-first-pull-request)

![](https://img.shields.io/badge/language-TypeScript-red.svg) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vchart/blob/main/LICENSE)

</div>

<div align="center">

English| [简体中文](./README.zh-CN.md)

</div>

<div align="center">

（video）

</div>

## Introduction

VChart is a charting component library in VisActor visualization system. It wraps the charting logic based on visual grammar library [VGrammar](https://github.com/VisActor/VGrammar) and the component encapsulation based on visual rendering engine [VRender](https://github.com/VisActor/VRender). The core capabilities are as follows:

1. **Cross-platform**: Automatically adapt to desktop, H5, and multiple small program environments
2. **Storytelling**: Comprehensive annotation, animation, flow control, narrative templates, and other enhanced features for visual storytelling
3. **Scenes**: Deliver visual storytelling capabilities to end-users, unlock developer productivity

### Repository Introduction

This repository includes the following packages:

1. [`vchart`](./packages/vchart/): The core code repository of VChart
2. [`react-vchart`](./packages/react-vchart/): The VChart component encapsulated based on [React](https://react.dev/)
3. [`taro-vchart`](./packages/taro-vchart/): The VChart component encapsulated based on [Taro](https://docs.taro.zone/docs/)
4. [`lark-vchart`](./packages/lark-vchart/): The VChart component encapsulated based on [Lark miniAPP](https://open.feishu.cn/document/client-docs/gadget/introduction/host-environment)
5. [`tt-vchart`](./packages/lark-vchart/): The VChart component encapsulated based on [TikTok miniAPP](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/introduction/overview/)
6. [`block-vchart`](./packages/block-vchart/): The VChart component encapsulated based on [Lark Block](https://open.feishu.cn/document/client-docs/block/block-introduction)

## 🔨 Usage

### 📦 Installation

```bash
# npm
$ npm install @visactor/vchart

# yarn
$ yarn add @visactor/vchart
```

### 📊 A Chart Example

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

// 'chart' is the id of your dom container, such as <div id="chart"></chart>
const vchart = new VChart(spec, { dom: 'chart' });
vchart.renderAsync();
```

## ⌨️ Development

First of all, please install [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)

```bash
$ npm i --global @microsoft/rush
```

Then clone locally:

```bash
# clone
$ git clone git@github.com:VisActor/VChart.git
$ cd VChart
# install dependencies
$ rush update
# start vchart development server
$ rush start
# start react-vchart development server
$ rush react
```

## 🔗 Related Links

- [Homepage](https://www.visactor.io/vchart)
- [VCharts Gallery](https://www.visactor.io/vchart/example)
- [VChart Tutorials](https://www.visactor.io/vchart/guide/tutorial_docs/VChart_Website_Guide)
- [VChart Options](https://www.visactor.io/vchart/option/)
- [VChart API](https://www.visactor.io/vchart/api/API/vchart)
- [VGrammar](https://www.visactor.io/vgrammar)
- [VRender](https://www.visactor.io/vrender)
- [FAQ](https://www.visactor.io/vchart/guide/tutorial_docs/FAQ)
- [CodeSandbox Template](https://codesandbox.io/s/the-template-of-visactor-vchart-vl84ww?file=/src/index.ts) for bug reports

## 💫 Ecosystem

| Project                                                                               | Description                          |
| ------------------------------------------------------------------------------------- | ------------------------------------ |
| [React-VChart](https://github.com/VisActor/VChart/tree/develop/packages/react-vchart) | React interface for @VisActor/VChart |

## 🤝 Contribution [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/VisActor/VChart/blob/main/CONTRIBUTING.md#your-first-pull-request)

If you would like to contribute, please read the [Code of Conduct](./CODE_OF_CONDUCT.md) and our [contributing guide](./CONTRIBUTING.md) first。

Small streams converge to make great rivers and seas!

<a href="https://github.com/visactor/vchart/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vchart" /></a>
