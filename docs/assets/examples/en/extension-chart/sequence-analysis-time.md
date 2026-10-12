---
category: examples
group: extension chart
title: 'Sequence Analysis: Time Mode'
keywords: extension, sequenceAnalysis, time
order: 14
cover: /vchart/preview/sequence-analysis-time.png
option: sequenceAnalysisChart
---

# Sequence Analysis: Time Mode

Plot two users on a time axis and connect related events. Connection lines remain visible when target avatars are disabled.

## Key Configurations

- `mode: 'time'`.
- `actionTarget: false`.
- `from` / `to` in `actionData` reference globally unique `dots.node_name` values.
- Data and avatars are embedded; no external requests are required.

## Code Demo

```javascript livedemo
// Use matching VChart and extension versions that include sequenceAnalysis.
// import VChart from '@visactor/vchart';
// import { registerSequenceAnalysis } from '@visactor/vchart-extension';
const { registerSequenceAnalysis } = VChartExtension;
registerSequenceAnalysis({ VChart });

const avatar = (text, fill) =>
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="20" fill="${fill}"/><text x="20" y="26" text-anchor="middle" font-family="Arial" font-size="18" fill="white">${text}</text></svg>`
  );
const userImageMap = { Alice: avatar('A', '#5470c6'), Bob: avatar('B', '#26a69a') };
const day = 24 * 60 * 60 * 1000;
const start = Date.UTC(2026, 0, 1);
const eventData = [
  {
    user_id: 'Alice',
    user_image: userImageMap.Alice,
    dots: [
      { node_name: 'a1', step: 'step_1', medium_type: 'IP', action_type: 'visit', time_stamp: start, action_count: 10 },
      {
        node_name: 'a2',
        step: 'step_2',
        medium_type: 'Device',
        action_type: 'login',
        time_stamp: start + 2 * day,
        action_count: 4
      },
      {
        node_name: 'a3',
        step: 'step_3',
        medium_type: 'Account',
        action_type: 'order',
        time_stamp: start + 4 * day,
        action_count: 2
      }
    ]
  },
  {
    user_id: 'Bob',
    user_image: userImageMap.Bob,
    dots: [
      {
        node_name: 'b1',
        step: 'step_1',
        medium_type: 'IP',
        action_type: 'visit',
        time_stamp: start + day,
        action_count: 8
      },
      {
        node_name: 'b2',
        step: 'step_2',
        medium_type: 'Device',
        action_type: 'login',
        time_stamp: start + 3 * day,
        action_count: 3
      },
      {
        node_name: 'b3',
        step: 'step_3',
        medium_type: 'Account',
        action_type: 'order',
        time_stamp: start + 5 * day,
        action_count: 1
      }
    ]
  }
];
const stepMediumMap = {
  step_1: { medium_type: 'IP', count: 0 },
  step_2: { medium_type: 'Device', count: 1 },
  step_3: { medium_type: 'Account', count: 2 }
};

const spec = {
  type: 'sequenceAnalysis',
  mode: 'time',
  mediumConnection: false,
  actionTarget: false,
  height: 440,
  eventData,
  actionData: [
    { from: 'a1', to: 'b2', user_id: 'Bob', user_image: userImageMap.Bob },
    { from: 'b2', to: 'a3', user_id: 'Alice', user_image: userImageMap.Alice }
  ],
  patternData: [
    { from: 'a1', to: 'b3', pattern_type: 'shared' },
    { from: 'a1', to: 'b3', pattern_type: 'shared' }
  ],
  userImageMap,
  stepMediumMap,
  customTransformSpec(converted) {
    // Configure the generated VChart spec and show the complete initial range.
    converted.color = ['#5470c6', '#26a69a', '#f6bd16'];
    converted.scrollBar.forEach(bar => {
      bar.start = 0;
      bar.end = 1;
    });
  }
};
const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();
window.vchart = vchart;
```

## Related Documentation

[Sequence analysis tutorial](/vchart/guide/tutorial_docs/Chart_Extensions/sequence_analysis) · [Options](/vchart/option/sequenceAnalysisChart)
