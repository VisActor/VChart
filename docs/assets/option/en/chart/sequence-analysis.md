{{ target: chart-sequence-analysis }}

# sequenceAnalysisChart

A sequence analysis extension that places users on the vertical axis and events on a time, step or medium axis. Register it from `@visactor/vchart-extension` before use. Use matching package versions that include this feature.

```js
import VChart from '@visactor/vchart';
import { registerSequenceAnalysis } from '@visactor/vchart-extension';
registerSequenceAnalysis();
```

[Tutorial](/vchart/guide/tutorial_docs/Chart_Extensions/sequence_analysis) · [Step mode](/vchart/demo/extension-chart/sequence-analysis-step) · [Medium curves](/vchart/demo/extension-chart/sequence-analysis-medium) · [Time with target avatars](/vchart/demo/extension-chart/sequence-analysis-target)

The transformer generates a common chart, dot/link series, axes and zoom components from the fields below. You do not need to supply `data`, `series`, `xField` or `yField`. Customize the generated spec with `customTransformSpec`.

## type(string) = 'sequenceAnalysis'

Required. Distinct from the built-in `sequence` chart and the `sequenceScatterLink` extension.

## mode(string)

Required: `'time'` or `'step'`.

- `'time'`: uses `dots.time_stamp` horizontally, displays summed action counts at the top and time at the bottom; connections come from `actionData`.
- `'step'`: uses `dots.step` horizontally and `patternData` for connections. With mediumConnection enabled, the horizontal field becomes `dots.medium_type`.

## mediumConnection(boolean) = false

Step mode only. When false, use step categories, straight lines and top labels from stepMediumMap. When true, use medium categories and cubic Bézier curves. Repeated links sharing endpoints have distinct curvature.

## actionTarget(boolean) = false

Time mode only. False keeps connection lines visible while hiding avatars and arrows. True displays `actionData.user_image` at the midpoint and an arrow at the target. The image is not looked up automatically using user_id.

## eventData(Array)

Required array of user rows: `{ user_id, user_image, dots: [...] }`. Preserve this nested structure.

In the current time mode, count labels and markLine configurations are generated during spec transformation. `updateDataSync('eventData', ...)` and `updateFullDataSync(...)` do not regenerate them. When timestamps or counts change, call `updateSpecSync({ ...spec, eventData: nextEvents })` using your saved complete extension spec, updating links and image maps as needed. Do not substitute the transformed result of getSpec() for the original extension spec.

### user_id(string)

Unique user ID and vertical category.

### user_image(string)

User image in the event row. Default vertical labels actually use `userImageMap[user_id]`; this field does not populate that map automatically.

### dots(Array)

Events for this user. The fields below form the public event structure; supply all of them to support switching modes.

#### node_name(string)

Event identifier, globally unique across all users. Link from/to values reference it.

#### step(string)

Horizontal category in step mode when mediumConnection is false.

#### medium_type(string)

Horizontal category in step mode when mediumConnection is true, for example `'IP'` or `'Device'`.

#### action_type(string)

Event category used to group dot colors.

#### time_stamp(number)

Unix timestamp in milliseconds, used horizontally in time mode.

#### action_count(number)

Event count. The top time axis sums this value across users at each timestamp.

## actionData(Array)

Connections for time mode. Use `[]` when there are none.

### from(string)

Source event node_name.

### to(string)

Target event node_name. Both endpoints must exist in eventData.

### user_id(string)

Optional associated user ID. It does not resolve an avatar URL.

### user_image(string)

Image URL or data URL used when actionTarget is true. This is independent of userImageMap, which controls vertical labels.

## patternData(Array)

Connections for step mode. Use `[]` when there are none.

### from(string)

Source event node_name.

### to(string)

Target event node_name.

### pattern_type(string)

Pattern category used to group link colors.

### isExtend(string)

Use `'left'` or `'right'` to select an end. Omit the field to extend both ends; the interface's `'all'` value does not currently enable both ends. Applies only to straight step-mode links, where allowExtend is enabled: extends the source and/or target end toward the outside of its category band without moving events. Curves do not use this setting.

## userImageMap(Object)

Maps user IDs to image URLs or data URLs for the default vertical labels. Cover every user in eventData. An empty object is acceptable if customTransformSpec replaces the image labels with text.

## stepMediumMap(Object)

Maps step names to `{ medium_type: string; count: number }` objects for top labels in step mode without medium connections. Values are objects, not strings; count may be zero.

```js
stepMediumMap: {
  step_1: { medium_type: 'IP', count: 0 },
  step_2: { medium_type: 'Device', count: 2 }
}
```

Cover every step category. Time mode and medium-connection mode can use `{}`. The count is supplied by your application, not computed from eventData.

## colors(Array)

This field exists in the interface but is not currently mapped to the chart palette. Set the standard color option in customTransformSpec instead:

```js
customTransformSpec(spec) {
  spec.color = ['#5470c6', '#26a69a', '#f6bd16'];
}
```

## customTransformSpec(Function)

Called after conversion to a common chart spec and before common-chart normalization. Mutate the supplied object; no return value is needed.

The generated components are a bottom DataZoom in filter mode, a right ScrollBar and a bottom ScrollBar in axis mode. Scrollbars start with `[0, 0.8]`. The bottom scrollbar also links the second horizontal axis when present. Animation and tooltip are disabled by default.

```js
customTransformSpec(spec) {
  const link = spec.series.find(series => series.type === 'link');
  link.link.style = { stroke: '#5470c6', lineWidth: 2 };
  // Both straight and curved links use the public link configuration.
  link.link.state = { custom_unSelected: { strokeOpacity: 0.25 } };
  spec.scrollBar.forEach(bar => { bar.start = 0; bar.end = 1; });
}
```
