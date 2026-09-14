---
category: examples
group: extension chart
title: 纵向叙事图
keywords: extension, storyline, portrait
order: 10
option: storylineChart
---

# 纵向叙事图

本示例沿用 `packages/vchart-extension/__tests__/runtime/browser/test-page/storyline.ts` 中的 `portrait` case，保留原始图片、数据和配色，画布宽高自适应容器。

每次运行随机生成 3–9 个节点，保留测试 case 的长文本，用于观察布局对不同节点数量和内容长度的处理。

## 关键配置

- `autoFit: true`：宽高自适应容器，不设置固定的 `width`、`height`；演示容器按 `9 / 16` 的宽高比随页面缩放。
- `layout: 'portrait'`：图片和文字沿中轴左右交替排列。
- `data[].marker`：显示从 2012 开始的时间标记。
- `data[].subImage`：绘制主图后方的装饰图片。

## 代码演示

```javascript livedemo
// 在业务中使用时，请安装与 @visactor/vchart 版本一致的 @visactor/vchart-extension。
// import VChart from '@visactor/vchart';
// import { registerStorylineChart } from '@visactor/vchart-extension';
// 文档演示环境提供 VChartExtension 全局变量。
const { registerStorylineChart } = VChartExtension;

const TITLE_IMAGE_URL = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/title-world-cap.png';
const SUB_IMAGE_URL = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-2022.png';
const baseData = [
  {
    id: 'discover',
    title: 'Discover',
    content:
      'Collect the first signal and frame the story. Capture every relevant detail from the source material ' +
      'so the audience can reconstruct the same context the author had when starting the analysis.' +
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
    subImage: SUB_IMAGE_URL
  },
  {
    id: 'group',
    title: 'Group',
    content:
      'Arrange related facts into a compact block, removing duplicates and aligning each fragment ' +
      'to the central theme so readers can scan supporting evidence at a glance without losing context.' +
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
    subImage: SUB_IMAGE_URL
  },
  {
    id: 'connect',
    title: 'Connect',
    content:
      'Draw the reading path between blocks. Use repeating motifs, parallel sentence structures ' +
      'and visual cues to establish a continuous flow that walks the reader from premise to conclusion.' +
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
    subImage: SUB_IMAGE_URL
  },
  {
    id: 'emphasize',
    title: 'Emphasize',
    content:
      'Use image, title, and copy as one visual unit. Highlight the most important facts with typography ' +
      'weight, color contrast or motion so the eye instinctively returns to them while scanning.' +
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
    subImage: SUB_IMAGE_URL
  },
  {
    id: 'resolve',
    title: 'Resolve',
    content:
      'End with a clear takeaway. Summarize the lesson, point out the next decision the audience ' +
      'should make and remove any ambiguity so the story closes with a satisfying, actionable conclusion.' +
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
    subImage: SUB_IMAGE_URL
  }
];
const buildData = layout => {
  const count = 3 + Math.floor(Math.random() * 7);
  return Array.from({ length: count }, (_, index) => {
    const seed = baseData[index % baseData.length];
    // portrait 布局：附加 marker 时间节点（2012、2013…）以便沿中轴纵向展示
    const marker = layout === 'portrait' ? String(2012 + index) : undefined;
    return {
      ...seed,
      id: `${layout}-${index}-${seed.id}`,
      title: `${seed.title} ${index + 1}`,
      content: [`${seed.content}`, `Layout ${layout} / Block ${index + 1} of ${count}.`],
      ...(marker ? { marker } : {})
    };
  });
};
const themeColor = 'rgb(228,154,56)';
const titleImage = {
  image: TITLE_IMAGE_URL
};
const layout = 'portrait';
const spec = {
  type: 'storyline',
  autoFit: true,
  data: buildData(layout),
  layout,
  titleImage,
  themeColor
};

// 演示容器随页面宽度缩放，并保留原 case 的宽高比例。
const container = document.getElementById(CONTAINER_ID);
container.style.width = '100%';
container.style.height = 'auto';
container.style.contain = 'size';
container.style.aspectRatio = '9 / 16';

registerStorylineChart();
const vchart = new VChart(spec, { dom: container });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[扩展图表：叙事图](/vchart/guide/tutorial_docs/Chart_Extensions/storyline)
