---
category: examples
group: extension chart
title: Clock Storyline
keywords: extension, storyline, clock
order: 11
cover: /vchart/preview/storyline-clock.png
option: storylineChart
---

# Clock Storyline

**Version requirement:** `storyline` is available from `@visactor/vchart-extension` since **VChart 2.1.7**. Use **2.1.7 or later** and keep `@visactor/vchart` and `@visactor/vchart-extension` versions identical. If you select an unsupported version in the live demo, upgrade it; this extension chart is not built into the core package.

This example uses the `clock` case from `packages/vchart-extension/__tests__/runtime/browser/test-page/storyline.ts`, retaining its six milestones, images and theme with shorter titles and descriptions using a fixed-size canvas with scrolling inside this demo.

The data covers six World Cup milestones from 1930 to 2022. Each milestone uses a short Chinese title and a one-sentence description.

## Key Configurations

- `autoFit: false`, `width: 1200`, `height: 675`: keep a fixed canvas size.
- `scrollContainer`: fill the preview area and use `overflow: auto` to view the larger canvas without changing the site's outer container styles.
- `window.customRelease`: remove this demo's DOM when rerunning or switching examples so scrollbars do not persist.
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
// storyline requires VChart 2.1.7+ and the matching @visactor/vchart-extension.
// Register when available in the live demo; this chart still requires a supported version.
if (VChartExtension.registerStorylineChart) {
  VChartExtension.registerStorylineChart();
}

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

// Keep the canvas size fixed and scrolling local to this demo.
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

// The site releases the chart instance; only remove this demo's DOM here.
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

## Related Guide

[Extension Chart: Storyline](/vchart/guide/tutorial_docs/Chart_Extensions/storyline)
