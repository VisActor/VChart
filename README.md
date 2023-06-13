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
  <a href="">Introduction</a> •
  <a href="">Demo</a> •
  <a href="">Tutorial</a> •
  <a href="">API</a>•
  <a href="">Cross-Platform</a>
</p>

[![npm Version](https://img.shields.io/npm/v/@visactor/vchart.svg)](https://www.npmjs.com/package/@visactor/vchart)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vchart.svg)](https://www.npmjs.com/package/@visactor/vchart)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vchart/blob/main/LICENSE)

</div>

<div align="center">

English| [简体中文](./README.zh-CN.md)

</div>

<div align="center">

（video）

</div>

# Introduction

VChart is a charting component library in VisActor visualization system. It wraps the charting logic based on visual grammar library [VGrammar](https://github.com/VisActor/VGrammar) and the component encapsulation based on visual rendering engine [VRender](https://github.com/VisActor/VRender). The core capabilities are as follows:

1. Cross-platform: Automatically adapt to desktop, H5, and multiple small program environments
2. Storytelling: Comprehensive annotation, animation, flow control, narrative templates, and other enhanced features for visual storytelling
3. Scenes: Deliver visual storytelling capabilities to end-users, unlock developer productivity

# Repo Intro

This repository includes the following packages:

1. vchart: Charting components
2. react-vchart: React-based VChart

# Usage

## Installation

[npm package](https://www.npmjs.com/package/@visactor/vchart)

```bash
// npm
npm install @visactor/vchart

// yarn
yarn add @visactor/vchart
```

## Quick Start

```javascript
const spec = {
  type: 'common',
  data: {
    values: [
      {
        time: '2:00',
        value: 8,
        type: 'TikTok'
      },
      {
        time: '4:00',
        value: 9,
        type: 'TikTok'
      },
      {
        time: '6:00',
        value: 11,
        type: 'TikTok'
      },
      {
        time: '8:00',
        value: 14,
        type: 'TikTok'
      },
      {
        time: '10:00',
        value: 16,
        type: 'TikTok'
      },
      {
        time: '12:00',
        value: 17,
        type: 'TikTok'
      },
      {
        time: '14:00',
        value: 17,
        type: 'TikTok'
      },
      {
        time: '16:00',
        value: 16,
        type: 'TikTok'
      },
      {
        time: '18:00',
        value: 15,
        type: 'TikTok'
      },

      {
        time: '2:00',
        value: 7,
        type: 'Bilibili'
      },
      {
        time: '4:00',
        value: 8,
        type: 'Bilibili'
      },
      {
        time: '6:00',
        value: 9,
        type: 'Bilibili'
      },
      {
        time: '8:00',
        value: 10,
        type: 'Bilibili'
      },
      {
        time: '10:00',
        value: 9,
        type: 'Bilibili'
      },
      {
        time: '12:00',
        value: 12,
        type: 'Bilibili'
      },
      {
        time: '14:00',
        value: 14,
        type: 'Bilibili'
      },
      {
        time: '16:00',
        value: 12,
        type: 'Bilibili'
      },
      {
        time: '18:00',
        value: 14,
        type: 'Bilibili'
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
 * Chart container dom id: CONTAINER_ID
 * VChart 类: VChart
 *
 */
const vChart = new VChart(spec, { dom: CONTAINER_ID });
await vChart.renderAsync();
```

##

[More demos and detailed tutorials](https://visactor.io/vchart)

# Related Links

- [Official website](https://visactor.io/vchart)

- [Theme Configuration](https://visactor.io/vchart)
- [React-VChart](https://visactor.io/react-vchart)
- [Cross-platform](https://visactor.io/vchart)

# Ecosystem

| Project                                                     | Description                                                                            |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [React Component Library](https://visactor.io/react-vchart) | A React chart component library based on [VisActor/VChart](https://visactor.io/vchart) |
| [AI-generated Components](https://visactor.io/ai-vchart)    | AI-generated chart component.                                                          |

# Contribution

If you would like to contribute, please read the [Code of Conduct ](./CODE_OF_CONDUCT.md) and [ Guide](./CONTRIBUTING.zh-CN.md) first。

Small streams converge to make great rivers and seas!

<a href="https://github.com/visactor/vchart/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vchart" /></a>

# License

[MIT License](./LICENSE)
