---
category: examples
group: extension chart
title: Portrait Storyline
keywords: extension, storyline, portrait
order: 10
option: storylineChart
---

# Portrait Storyline

This example uses the `portrait` case from `packages/vchart-extension/__tests__/runtime/browser/test-page/storyline.ts`, retaining its images, data and theme while adapting the chart width and height to its container.

Each run generates 3–9 nodes at random and preserves the case's long text to demonstrate how the layout handles different node counts and content lengths.

## Key Configurations

- `autoFit: true`: adapt width and height to the container without fixed `width` or `height` values; the demo container scales with the page at a `9 / 16` aspect ratio.
- `layout: 'portrait'`: alternate images and text around the central axis.
- `data[].marker`: show time labels starting from 2012.
- `data[].subImage`: draw the decorative image behind each main image.

## Code Demo

```javascript livedemo
// Install @visactor/vchart-extension with the same version as @visactor/vchart.
// import VChart from '@visactor/vchart';
// import { registerStorylineChart } from '@visactor/vchart-extension';
// The documentation demo provides the VChartExtension global.
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

// Scale the demo container with the page width and preserve the original case aspect ratio.
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

## Related Guide

[Extension Chart: Storyline](/vchart/guide/tutorial_docs/Chart_Extensions/storyline)
