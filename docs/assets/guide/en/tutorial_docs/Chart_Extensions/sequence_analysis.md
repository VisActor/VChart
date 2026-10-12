# Extension Chart: Sequence Analysis

Sequence Analysis places each user's events on a horizontal row, aligns events by time, step or medium, and draws their relationships. It supports behavior paths, relationships across users and repeated patterns.

The chart comes from `@visactor/vchart-extension` with type `sequenceAnalysis`. It is distinct from the built-in sequence chart and the sequenceScatterLink extension for training-process analysis.

![Medium connections](/vchart/preview/sequence-analysis-medium.png)

## Choose a mode

| Configuration                           | Horizontal axis        | Connections   | Appearance                                                          |
| --------------------------------------- | ---------------------- | ------------- | ------------------------------------------------------------------- |
| `mode: 'time', actionTarget: false`     | Millisecond timestamps | `actionData`  | Straight lines; the top axis shows total event counts per timestamp |
| `mode: 'time', actionTarget: true`      | Millisecond timestamps | `actionData`  | Lines, midpoint avatars and target arrows                           |
| `mode: 'step', mediumConnection: false` | `dots.step`            | `patternData` | Straight lines; top labels show medium names and additional counts  |
| `mode: 'step', mediumConnection: true`  | `dots.medium_type`     | `patternData` | Cubic Bézier curves; repeated endpoints receive distinct curvature  |

## Register and create a chart

Install matching VChart and extension versions that include sequenceAnalysis, and register before creating the chart. The page needs a container with id="chart".

This complete minimal step example replaces image labels with user names through the transform callback, so userImageMap can be empty. The demo pages instead use embedded SVG avatars.

```js
import VChart from '@visactor/vchart';
import { registerSequenceAnalysis } from '@visactor/vchart-extension';

registerSequenceAnalysis();
const spec = {
  type: 'sequenceAnalysis',
  mode: 'step',
  mediumConnection: false,
  height: 440,
  eventData: [
    {
      user_id: 'Alice',
      user_image: '',
      dots: [
        {
          node_name: 'a1',
          step: 'step_1',
          medium_type: 'IP',
          action_type: 'visit',
          time_stamp: 1767225600000,
          action_count: 2
        }
      ]
    },
    {
      user_id: 'Bob',
      user_image: '',
      dots: [
        {
          node_name: 'b1',
          step: 'step_2',
          medium_type: 'Device',
          action_type: 'login',
          time_stamp: 1767312000000,
          action_count: 1
        }
      ]
    }
  ],
  patternData: [{ from: 'a1', to: 'b1', pattern_type: 'shared' }],
  actionData: [{ from: 'a1', to: 'b1' }],
  userImageMap: {},
  stepMediumMap: {
    step_1: { medium_type: 'IP', count: 0 },
    step_2: { medium_type: 'Device', count: 1 }
  },
  customTransformSpec(converted) {
    converted.color = ['#5470c6', '#26a69a'];
    converted.axes.find(axis => axis.orient === 'left').label.formatMethod = label => label;
    converted.scrollBar.forEach(bar => {
      bar.start = 0;
      bar.end = 1;
    });
  }
};
const vchart = new VChart(spec, { dom: 'chart' });
vchart.renderSync();
```

For CDN usage, load the matching build/index.min.js files for both packages. Pass the actual chart constructor used by your page to the registration method:

```js
VChartExtension.registerSequenceAnalysis({ VChart: VChart.default });
const vchart = new VChart.default(spec, { dom: 'chart' });
vchart.renderSync();
```

## Prepare events and links

Each eventData row contains user_id, user_image and nested dots. Do not flatten dots before passing data to the chart. Each event supplies node_name, step, medium_type, action_type, time_stamp and action_count. See the [options](/vchart/option/sequenceAnalysisChart) for details.

- node_name must be globally unique across users. Every link's from and to must reference existing events.
- Time mode reads actionData; step mode reads patternData. Use empty arrays for no connections.
- Dot colors are grouped by action_type; pattern links are grouped by pattern_type.
- time_stamp is in milliseconds. The top time axis sums action_count across users at each timestamp, rather than counting rows.
- stepMediumMap values are `{ medium_type, count }` objects. Their count is an application-supplied additional quantity, independent of time-axis totals. Zero is displayed. Cover all steps in ordinary step mode; the other axis modes may use `{}`.

## User and target avatars

Default vertical labels read userImageMap[user_id]. The image stored in an event row does not populate this map automatically.

With actionTarget enabled in time mode, the midpoint avatar reads actionData.user_image. Supplying actionData.user_id alone does not resolve the image. Disabling actionTarget hides avatars and arrows while keeping lines visible.

Use accessible image URLs or data URLs. The demos embed their images to avoid network dependencies. [Target avatar example](/vchart/demo/extension-chart/sequence-analysis-target).

## Customize appearance and zoom

The transformer generates dot/link series, axes, a bottom DataZoom and horizontal/vertical ScrollBars. When two horizontal axes exist, the bottom scrollbar synchronizes their window proportions. Scrollbars initially show `[0, 0.8]`. Animation and tooltip are disabled by default.

Mutate the generated common-chart configuration in customTransformSpec. A returned object does not replace it:

```js
customTransformSpec(converted) {
  const connection = converted.series.find(series => series.type === 'link');
  connection.link.style = { stroke: '#5470c6', lineWidth: 2 };
  connection.link.state = { custom_unSelected: { strokeOpacity: 0.25 } };
  converted.color = ['#5470c6', '#26a69a', '#f6bd16'];
  converted.scrollBar.forEach(bar => { bar.start = 0; bar.end = 1; });
}
```

Straight and curved connections both use link visible/style/state options; no curveLink configuration is needed. The interface's colors field is not currently wired to the palette, so use the standard color option above.

DataZoom and ScrollBar linkedAxisId / linkedAxisIndex synchronize window proportions only in axis filter mode. They do not copy axis domains. [Linked axis option](/vchart/option/commonChart-scrollBar-linkedAxisIndex).

## Updates and current limitation

Keep the original extension spec used to create the chart. The common-chart spec returned by getSpec() is not a substitute.

Time-mode count labels and markLine configurations are currently generated during spec transformation. updateDataSync('eventData', ...) and updateFullDataSync(...) update events without rebuilding those configurations, so labels or reference lines can remain stale.

Use a complete updateSpecSync instead. The following also switches the step example to time mode, regenerating count labels and reference lines:

```js
const nextEvents = spec.eventData.map(user => ({
  ...user,
  dots: user.dots.map(event => ({
    ...event,
    time_stamp: event.time_stamp + 24 * 60 * 60 * 1000,
    action_count: event.action_count + 1
  }))
}));
vchart.updateSpecSync({ ...spec, mode: 'time', eventData: nextEvents });
```

When removing or renaming events, update actionData / patternData in the same complete spec. Also update userImageMap for user changes and stepMediumMap for step changes.

## Examples and options

- [Time mode](/vchart/demo/extension-chart/sequence-analysis-time)
- [Target avatars](/vchart/demo/extension-chart/sequence-analysis-target)
- [Step mode](/vchart/demo/extension-chart/sequence-analysis-step)
- [Medium connections](/vchart/demo/extension-chart/sequence-analysis-medium)
- [All options](/vchart/option/sequenceAnalysisChart)
