---
category: examples
group: storytelling
title: 溶解退场动画特效配置
keywords: animation,disappear,particle,distortion,blur,glitch,pixelation,dissolve,stage
order: 42-20
cover:
option: commonChart#animationDisappear
---

# 溶解退场动画特效配置

VRender 提供了丰富的阶段动画特效，包括粒子分解、扭曲变形、模糊效果、故障艺术、像素化、颜色效果和溶解效果等。这些动画可以通过 `animationDisappear.stage` 配置来应用（也可以尝试应用在`animationAppear.stage`等动画阶段）。

其中，溶解效果，根据方向不同，还可以细分为向内溶解、向外溶解、径向溶解、水平溶解、垂直溶解等。

## 关键配置

- `animationDisappear.stage` 用于配置舞台级别的退场动画特效
  - `type`: 动画类型，可选值为
    - `dissolve`: 溶解,
  - `duration`: 动画时长（毫秒）
  - `easing`: 缓动函数
  - `options`: 特效配置参数
    - `dissolveType`: 溶解效果类型，默认值为 `outward`
      - 'outward': 向内溶解 - 从边缘开始向内溶解
      - 'inward': 向外溶解 - 从中心开始向外溶解
      - 'radial': 径向溶解 - 按角度顺序溶解
      - 'leftToRight': 从左侧开始向右溶解
      - 'rightToLeft': 从右侧开始向左溶解
      - 'topToBottom': 从顶部开始向下溶解
      - 'bottomToTop': 从底部开始向上溶解
    - `useWebGL`: 是否使用WebGL实现 (true: GPU加速, false: CPU计算)，默认值为 `true`
    - `noiseScale`: 溶解颗粒大小（0: 平滑溶解无颗粒, 1-20: 颗粒大小像素值，值越大颗粒越大），默认值为 `8`
    - `fadeEdge`: 是否启用边缘渐变，让溶解效果更自然，默认值为 `true`

### 代码演示

```javascript livedemo
const spec = {
  type: 'funnel',
  data: {
    values: [
      { name: '展示', value: 100 },
      { name: '点击', value: 80 },
      { name: '访问', value: 60 },
      { name: '咨询', value: 40 },
      { name: '订单', value: 20 }
    ]
  },
  categoryField: 'name',
  valueField: 'value',
  animationAppear: {
    stage: {
      type: 'dissolve',
      duration: 5000,
      easing: 'linear',
      options: {
        dissolveType: 'topToBottom',
        useWebGL: true,
        noiseScale: 5,
        fadeEdge: false
      }
    }
  },
  animationUpdate: {
    duration: 300
  },
  animationEnter: {
    duration: 300
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();
```

## 相关教程

[VChart动画教程](/vchart/guide/tutorial_docs/Animation/Animation_Types)
