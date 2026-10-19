---
category: examples
group: extension chart
title: 时钟叙事图
keywords: extension, storyline, clock
order: 11
cover: /vchart/preview/storyline-clock.png
option: storylineChart
---

# 时钟叙事图

本示例沿用 `packages/vchart-extension/__tests__/runtime/browser/test-page/storyline.ts` 中的 `clock` case，保留六个历史节点、原始图片和配色，精简标题与正文，使用固定尺寸画布，并在当前示例内部滚动查看。

展示 1930 至 2022 年的六个世界杯历史节点。

## 关键配置

- `autoFit: false`、`width: 1200`、`height: 675`：保持固定画布尺寸。
- `scrollContainer`：填满站点预览区域，使用 `overflow: auto` 查看超出区域的画布，不修改站点外层容器样式。
- `window.customRelease`：重新运行或切换示例时删除本示例创建的 DOM，避免滚动条残留。
- `layout: 'clock'`：按数据顺序沿圆形轨道排列六个世界杯节点。
- `titleImage`：顶部世界杯主题图缩小至 `180 × 60`，为圆环和节点文字留出空间。
- `title.style`、`content.style`：标题字号 `14`、行高 `18`；正文字号 `11`、行高 `14`，每个节点只保留一句短说明。
- `padding`、`block.padding`：缩小外边距和内部留白，扩大圆环的可用区域。
- `themeColor`：沿用测试 case 的橙色主题。

## 代码演示

```javascript livedemo
// 在业务中使用时，请安装与 @visactor/vchart 版本一致的 @visactor/vchart-extension。
// import VChart from '@visactor/vchart';
// import { registerStorylineChart } from '@visactor/vchart-extension';
// 文档演示环境提供 VChartExtension 全局变量。
const { registerStorylineChart } = VChartExtension;

const TITLE_IMAGE_URL = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/title-world-cap.png';
const themeColor = 'rgb(228,154,56)';
const titleImage = {
  image: TITLE_IMAGE_URL,
  width: 180,
  height: 60
};
const chartWidth = 1200;
const chartHeight = 675;
const spec = {
  type: 'storyline',
  autoFit: false,
  width: chartWidth,
  height: chartHeight,
  padding: [16, 8, 16, 8],
  block: { padding: 0 },
  layout: 'clock',
  titleImage,
  themeColor,
  title: {
    style: { fontSize: 14, lineHeight: 18 }
  },
  content: {
    style: { fontSize: 11, lineHeight: 14 }
  },
  data: [
    {
      id: 'uruguay-1930',
      title: '首届世界杯',
      content: '1930年，乌拉圭主场夺冠。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'brazil-1958',
      title: '贝利登场',
      content: '1958年，巴西首次捧杯。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'mexico-1986',
      title: '马拉多纳',
      content: '1986年，阿根廷再夺冠军。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'france-1998',
      title: '法国首冠',
      content: '1998年，法国主场夺冠。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'germany-2014',
      title: '德国夺冠',
      content: '2014年，德国加时赛制胜。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'qatar-2022',
      title: '梅西圆梦',
      content: '2022年，阿根廷点球夺冠。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    }
  ]
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

registerStorylineChart();
const vchart = new VChart(spec, { dom: chartContainer });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[扩展图表：叙事图](/vchart/guide/tutorial_docs/Chart_Extensions/storyline)
