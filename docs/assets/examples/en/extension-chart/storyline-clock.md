---
category: examples
group: extension chart
title: Clock Storyline
keywords: extension, storyline, clock
order: 11
option: storylineChart
---

# Clock Storyline

This example uses the `clock` case from `packages/vchart-extension/__tests__/runtime/browser/test-page/storyline.ts`, retaining its six milestones, images and theme with shorter titles and descriptions while adapting the chart width and height to its container.

The data covers six World Cup milestones from 1930 to 2022. Each milestone uses a short Chinese title and a one-sentence description.

## Key Configurations

- `autoFit: true`: adapt width and height to the container without fixed `width` or `height` values; the demo container scales with the page at a `16 / 9` aspect ratio.
- `layout: 'clock'`: arrange six World Cup nodes along a circular orbit in data order.
- `titleImage`: use a compact `180 × 60` theme image at the top to leave room for the orbit and node text.
- `title.style` and `content.style`: use a title font size of `14` with a line height of `18`, and a content font size of `11` with a line height of `14`. Keep one short sentence per node.
- `padding` and `block.padding`: reduce outer and inner spacing to give the orbit more room.
- `themeColor`: use the test case's orange theme.

## Code Demo

```javascript livedemo
// Install @visactor/vchart-extension with the same version as @visactor/vchart.
// import VChart from '@visactor/vchart';
// import { registerStorylineChart } from '@visactor/vchart-extension';
// The documentation demo provides the VChartExtension global.
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

// Scale the demo container with the page width and preserve the original case aspect ratio.
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

## Related Guide

[Extension Chart: Storyline](/vchart/guide/tutorial_docs/Chart_Extensions/storyline)
