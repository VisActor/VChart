---
category: examples
group: extension chart
title: 横向叙事图
keywords: extension, storyline, landscape
order: 9
cover: /vchart/preview/storyline-landscape.png
option: storylineChart
---

# 横向叙事图

**版本要求：** `storyline` 自 **VChart 2.1.7** 起由 `@visactor/vchart-extension` 提供。请使用 **2.1.7 或更高版本**，并保持 `@visactor/vchart` 与 `@visactor/vchart-extension` 版本一致。在线演示切换到不支持此图表的版本时，需要升级；主包不内置该扩展图表。

本示例沿用 `packages/vchart-extension/__tests__/runtime/browser/test-page/storyline.ts` 中的 `landscape` case，保留原始图片、数据和配色，使用固定尺寸画布，并在当前示例内部滚动查看。

每次运行随机生成 3–9 个节点，保留测试 case 的长文本，用于观察布局对不同节点数量和内容长度的处理。

## 关键配置

- `autoFit: false`、`width: 1200`、`height: 675`：保持固定画布尺寸。
- `scrollContainer`：填满站点预览区域，使用 `overflow: auto` 查看超出区域的画布，不修改站点外层容器样式。
- `window.customRelease`：重新运行或切换示例时删除本示例创建的 DOM，避免滚动条残留。
- `layout: 'landscape'`：沿横向曲线排列节点。
- `line`：保留测试 case 的连线配置。
- `image.showBackground: false`：隐藏主图背景装饰。

## 代码演示

```javascript livedemo
// 在业务中使用时，请安装与 @visactor/vchart 版本一致的 @visactor/vchart-extension。
// import VChart from '@visactor/vchart';
// import { registerStorylineChart } from '@visactor/vchart-extension';
// 文档演示环境提供 VChartExtension 全局变量。
// storyline 自 VChart 2.1.7 起支持；请加载同版本的 @visactor/vchart-extension。
// 在线 demo 按方法是否存在注册；使用此图表仍需选择上述支持的版本。
if (VChartExtension.registerStorylineChart) {
  VChartExtension.registerStorylineChart();
}

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
    return Object.assign(
      {},
      seed,
      {
        id: `${layout}-${index}-${seed.id}`,
        title: `${seed.title} ${index + 1}`,
        content: [`${seed.content}`, `Layout ${layout} / Block ${index + 1} of ${count}.`]
      },
      marker ? { marker } : {}
    );
  });
};
const themeColor = 'rgb(228,154,56)';
const titleImage = {
  image: TITLE_IMAGE_URL
};
const commonLine = {
  type: 'line',
  showArrow: true,
  style: {
    lineWidth: 1.5,
    lineCap: 'round',
    lineJoin: 'round',
    lineDash: [6, 5]
  }
};
const layout = 'landscape';
const chartWidth = 1200;
const chartHeight = 675;
const spec = {
  type: 'storyline',
  autoFit: false,
  width: chartWidth,
  height: chartHeight,
  padding: 20,
  data: buildData(layout),
  layout,
  titleImage,
  themeColor,
  line: commonLine,
  image: {
    showBackground: false
  }
};

// 画布保持固定尺寸；滚动区域只属于当前 demo。
const container = document.getElementById(CONTAINER_ID);
const scrollContainer = document.createElement('div');
Object.assign(scrollContainer.style, {
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  overflow: 'auto'
});

const chartContainer = document.createElement('div');
Object.assign(chartContainer.style, {
  position: 'relative',
  width: `${chartWidth}px`,
  height: `${chartHeight}px`
});
scrollContainer.appendChild(chartContainer);
container.appendChild(scrollContainer);

// 站点自动释放图表实例；这里只清理本 demo 创建的 DOM。
const cleanup = () => {
  scrollContainer.remove();
  if (window.customRelease === cleanup) {
    delete window.customRelease;
  }
};
window.customRelease = cleanup;

const vchart = new VChart(spec, { dom: chartContainer });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[扩展图表：叙事图](/vchart/guide/tutorial_docs/Chart_Extensions/storyline)
