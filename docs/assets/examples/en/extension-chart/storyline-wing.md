---
category: examples
group: extension chart
title: Wing Storyline
keywords: extension, storyline, wing
order: 13
cover: /vchart/preview/storyline-wing.png
option: storylineChart
---

# Wing Storyline

**Version requirement:** `storyline` is available from `@visactor/vchart-extension` since **VChart 2.1.7**. Use **2.1.7 or later** and keep `@visactor/vchart` and `@visactor/vchart-extension` versions identical. If you select an unsupported version in the live demo, upgrade it; this extension chart is not built into the core package.

This example uses the `wing` case from `packages/vchart-extension/__tests__/runtime/browser/test-page/storyline.ts`, retaining its images, data and theme using a fixed-size canvas with scrolling inside this demo.

Each run generates 3–9 nodes at random and preserves the case's long text to demonstrate how the layout handles different node counts and content lengths.

## Key Configurations

- `autoFit: false`, `width: 675`, `height: 1200`: keep a fixed canvas size.
- `scrollContainer`: fill the preview area and use `overflow: auto` to view the larger canvas without changing the site's outer container styles.
- `window.customRelease`: remove this demo's DOM when rerunning or switching examples so scrollbars do not persist.
- `layout: { type: 'wing', direction: 'left' }`: anchor the wing layout on the left.
- `titleImage.image`: use the test case's World Cup theme image.
- `titleImage.style.fill: 'transparent'`: make the theme image background transparent while keeping the image visible.
- `themeColor`: use the test case's orange theme.

## Code Demo

```javascript livedemo
// Install @visactor/vchart-extension with the same version as @visactor/vchart.
// import VChart from '@visactor/vchart';
// import { registerStorylineChart } from '@visactor/vchart-extension';
// The documentation demo provides the VChartExtension global.
// storyline requires VChart 2.1.7+ and the matching @visactor/vchart-extension.
// Register when available in the live demo; this chart still requires a supported version.
if (typeof VChartExtension !== 'undefined' && typeof VChartExtension.registerStorylineChart === 'function') {
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
  image: TITLE_IMAGE_URL,
  style: { fill: 'transparent' }
};
const layout = 'wing';
const chartWidth = 675;
const chartHeight = 1200;
const spec = {
  type: 'storyline',
  autoFit: false,
  width: chartWidth,
  height: chartHeight,
  // padding: [40, 40, 40, 40],
  data: buildData(layout),
  layout: { type: 'wing', direction: 'left' },
  titleImage,
  themeColor
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
