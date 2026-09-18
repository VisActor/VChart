---
category: examples
group: extension chart
title: 时钟叙事图
keywords: extension, storyline, clock
order: 11
option: storylineChart
---

# 时钟叙事图

本示例沿用 `packages/vchart-extension/__tests__/runtime/browser/test-page/storyline.ts` 中的 `clock` case，保留六个历史节点、原始图片和配色，精简标题与正文，画布宽高自适应容器。

展示 1930 至 2022 年的六个世界杯历史节点。

## 关键配置

- `autoFit: true`：宽高自适应容器，不设置固定的 `width`、`height`；演示容器按 `16 / 9` 的宽高比随页面缩放。
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
const spec = {
  type: 'storyline',
  autoFit: true,
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

// 演示容器随页面宽度缩放，并保留原 case 的宽高比例。
const container = document.getElementById(CONTAINER_ID);
container.style.width = '100%';
container.style.height = 'auto';
container.style.contain = 'size';
container.style.aspectRatio = '16 / 9';

registerStorylineChart();
const vchart = new VChart(spec, { dom: container });
vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[扩展图表：叙事图](/vchart/guide/tutorial_docs/Chart_Extensions/storyline)
