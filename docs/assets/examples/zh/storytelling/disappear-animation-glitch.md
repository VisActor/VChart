---
category: examples
group: storytelling
title: 退场动画特效配置
keywords: animation,disappear,particle,distortion,blur,glitch,pixelation,dissolve,stage
order: 42-20
cover:
option: commonChart#animationDisappear
---

# 退场动画特效配置

VRender 提供了丰富的退场动画特效，包括粒子分解、扭曲变形、模糊效果、故障艺术、像素化、颜色效果和溶解效果等。这些动画可以通过 `animationDisappear` 配置来应用（也可以尝试应用在`animationAppear`）。

## 关键配置

- `animationDisappear.stage` 用于配置舞台级别的退场动画特效
  - `type`: 动画类型，可选值为
    - `dissolve`: 溶解,
    - `distortion`: 扭曲变形,
    - `gaussianBlur`: 高斯模糊,
    - `glitch`: 故障,
    - `pixelation`: 像素化,
    - `grayscale`: 褪色,
    - `particle`: 粒子
  - `duration`: 动画时长（毫秒）
  - `easing`: 缓动函数
  - `options`: 特效配置参数

## 故障效果

将图表分解为支持 'rgb-shift'、'digital-distortion'、'scan-lines'、'data-corruption' 四种效果

### 代码演示

```javascript livedemo
const spec = {
  type: 'bar',
  data: {
    values: [
      { type: 'Nail polish', country: 'Africa', value: 4229 },
      { type: 'Nail polish', country: 'EU', value: 4376 },
      { type: 'Nail polish', country: 'China', value: 3054 },
      { type: 'Nail polish', country: 'USA', value: 12814 },
      { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
      { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
      { type: 'Eyebrow pencil', country: 'China', value: 5067 },
      { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
      { type: 'Rouge', country: 'Africa', value: 5221 },
      { type: 'Rouge', country: 'EU', value: 3574 },
      { type: 'Rouge', country: 'China', value: 7004 },
      { type: 'Rouge', country: 'USA', value: 11624 },
      { type: 'Lipstick', country: 'Africa', value: 9256 },
      { type: 'Lipstick', country: 'EU', value: 4376 },
      { type: 'Lipstick', country: 'China', value: 9054 },
      { type: 'Lipstick', country: 'USA', value: 8814 }
    ]
  },
  xField: 'type',
  yField: 'value',
  seriesField: 'country',
  animationAppear: {
    stage: {
      type: 'glitch',
      duration: 3000,
      easing: 'linear',
      options: {
        effectType: 'digital-distortion',
        intensity: 1
      }
    },
    type: 'fadeOut',
    duration: 3000,
    easing: 'linear'
  },
  animationUpdate: {
    duration: 300
  },
  animationEnter: {
    duration: 300
  },
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();
```

## 相关教程

[VChart动画教程](/vchart/guide/tutorial_docs/Animation/Animation_Types)

