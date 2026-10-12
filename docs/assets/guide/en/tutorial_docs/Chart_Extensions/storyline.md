# Extension Chart: Storyline

A Storyline chart combines images, titles and descriptions into a sequence of nodes. Use it for product evolution, project milestones and narrative sequences. Nodes follow the order of the `data` array; the chart does not sort dates or use a time scale to determine spacing.

Storyline is provided by `@visactor/vchart-extension` and supports five layouts: `landscape`, `portrait`, `clock`, `arc` and `wing`.

See the [Storyline options](/vchart/option/storylineChart) for all fields, defaults and layout-specific behavior.

## Registration and Usage

Install `@visactor/vchart-extension` with the same version as `@visactor/vchart`, then register the chart before creating an instance:

```js
import VChart from '@visactor/vchart';
import { registerStorylineChart } from '@visactor/vchart-extension';

registerStorylineChart();

const spec = {
  type: 'storyline',
  width: 1000,
  height: 560,
  layout: 'landscape',
  themeColor: '#3b82a0',
  title: { style: { fontSize: 20 } },
  content: { style: { fontSize: 14, lineHeight: 21 } },
  data: [
    { id: 'discover', title: 'Discover', content: 'Talk to users and identify the problem.' },
    { id: 'design', title: 'Design', content: ['Outline the key workflows.', 'Collect feedback on a prototype.'] },
    { id: 'launch', title: 'Launch', content: 'Release the first version and improve the experience.' }
  ]
};

const vchart = new VChart(spec, { dom: 'chart' });
vchart.renderSync();
```

Provide a container with `id="chart"` on the page. For TypeScript, import `IStorylineSpec` from the extension package to type the specification.

When loading through a CDN, use the extension's global object and pass the page's VChart constructor to the registration function:

```html
<div id="chart"></div>
<script src="https://cdn.jsdelivr.net/npm/@visactor/vchart/build/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@visactor/vchart-extension/build/index.min.js"></script>
<script>
  VChartExtension.registerStorylineChart({ VChart: VChart.default });
  const vchart = new VChart.default(
    {
      type: 'storyline',
      width: 1000,
      height: 560,
      data: [
        { title: 'Discover', content: 'Set a goal.' },
        { title: 'Launch', content: 'Collect feedback.' }
      ]
    },
    { dom: 'chart' }
  );
  vchart.renderSync();
</script>
```

For production, pin both CDN URLs to the same package version that includes Storyline.

## Data Structure

`data` takes an array of nodes directly. It does not use the standard `{ id, values }` dataset wrapper and does not require `xField`, `yField` or `series`.

| Field      | Type                                              | Description                                                                                  |
| ---------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `id`       | `string \| number`                                | Optional node identifier; defaults to the data index.                                        |
| `title`    | `string`                                          | Node title.                                                                                  |
| `content`  | `string \| string[]`                              | Node description; array entries are joined with line breaks.                                 |
| `image`    | `string \| HTMLImageElement \| HTMLCanvasElement` | Main image: an image URL, data URL, image element or canvas element.                         |
| `subImage` | Same as `image`                                   | Offset decorative image behind the main image in the portrait layout; omitted when absent.   |
| `marker`   | `string`                                          | Portrait-only time marker, such as `'2024'`, with characters stacked vertically on the axis. |
| `datum`    | `unknown`                                         | Optional original business data.                                                             |

Images, titles and descriptions are optional. Sort the array before passing it to the chart when chronological order is needed. To update nodes or change layouts, call `vchart.updateSpec(nextSpec)` with a complete specification containing the new `data` array.

## Layouts

`layout` accepts a layout name or an object containing `type`. The default is `landscape`.

See the [layout options](/vchart/option/storylineChart#layout) for full types, parameter applicability and how direction, angles and padding work together.

| Layout      | Arrangement                                                                                        | Use cases                                |
| ----------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `landscape` | Images arranged horizontally, alternating text above and below, with a curve connecting the nodes. | Horizontal processes, product evolution. |
| `portrait`  | Images and text alternate on either side of a vertical axis, with optional axis markers.           | Milestones, development history.         |
| `clock`     | Nodes arranged clockwise around an orbit, with text extending outward.                             | Stage reviews, recurring processes.      |
| `arc`       | Nodes arranged along an arc around a theme image.                                                  | Growth stories, themed infographics.     |
| `wing`      | Circular images along a wing-shaped path, with text on either side.                                | Vertical narratives, project progress.   |

Use `direction` to switch the arc between a dome and a bowl:

```js
layout: {
  type: 'arc',
  direction: 'up', // 'up': dome with the theme image at the bottom; 'down': bowl with the image at the top
  radiusRatio: 0.9
}
```

For a wing layout, use `layout: { type: 'wing', direction: 'left' }`. Its direction can be `left` (the default) or `right`.

The current specialized layouts support different geometry options:

- `arc` supports `radiusRatio`, `startAngle` and `endAngle`, with angles in degrees. Default start/end angles are `200` / `340` for `up` and `20` / `160` for `down`.
- `wing` also supports those three options. Default start/end angles are `-70` / `70` for `left` and `110` / `250` for `right`; `radiusRatio` defaults to `0.92`.
- `clock` computes its own angles and radius for the full orbit and currently ignores those three options.
- `layout.padding` accepts a number or `[top, right, bottom, left]` for internal spacing in landscape and portrait node layouts. Use top-level `padding` for chart margins.

## Images and Text

`title` configures the title mark for each node; the text comes from `data[].title`. Descriptions come from `data[].content`, with styles configured through `content`. This `title` does not use the `text` and `subtext` fields of the standard chart title component.

```js
title: {
  style: { fontSize: 20, lineHeight: 27, fontWeight: 'bold', fill: '#23364d' }
},
content: {
  style: { fontSize: 14, lineHeight: 21, fill: '#526174' }
},
image: {
  showBackground: true,
  style: { opacity: 0.95 }
}
```

| Option                         | Description                                                                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `themeColor`                   | Default theme color for connecting lines, axes and image decoration; defaults to `#e8543d`.                                                             |
| `title.style`, `content.style` | Node text styles; use each mark's `visible: false` to hide it. Titles have a two-line limit; description space depends on the layout.                   |
| `image.width`, `image.height`  | Image dimensions in portrait, arc and wing layouts. Landscape uses `height` and computes the width; clock computes node image dimensions automatically. |
| `image.showBackground`         | Image background decoration: off by default in landscape and portrait, on in the other layouts. Does not control `subImage` visibility.                 |
| `image.style`                  | Image mark styles, such as `opacity`.                                                                                                                   |
| `titleImage`                   | Theme image with `image`, `width`, `height`, `visible` and `style` options. Its placement depends on the layout.                                        |
| `marker`                       | Portrait only: use `visible` to toggle time markers and `style.fontSize` / `style.lineHeight` to set their size and line height.                        |

For example, add a theme image to an arc layout:

```js
titleImage: {
  image: 'https://example.com/story-title.png', // Replace with your own image URL
  width: 320,
  height: 140
}
```

See the [image options](/vchart/option/storylineChart#image) and [titleImage options](/vchart/option/storylineChart#titleImage) for the roles of image sources, layout dimensions and mark styles, including type definitions, layout-specific defaults and typed examples.

## Node Dimensions and Lines

Use `block.width` and `block.height` to adjust node dimensions in landscape and portrait layouts. Portrait also supports adaptive widths through `block.widthRatio`, `minWidth` and `maxWidth`; an explicit `width` takes priority. By default, landscape calculates widths from the node count and portrait allocates node slots from the available height. In the arc layout, `block.width` limits text width, which can still shrink to fit the available space.

| Layout      | Main line options                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `landscape` | Curve shown by default. Toggle with `line.visible`; style it with `line.style.stroke` and `line.style.lineWidth`.                   |
| `portrait`  | Axis shown by default. Toggle with `line.visible`; use `line.style.fill` for its fill. Hiding the axis also hides its time markers. |
| `arc`       | Main arc hidden by default. Set `line.visible: true` to show it.                                                                    |
| `wing`      | Wing path shown by default. Set `line.visible: false` to hide it.                                                                   |
| `clock`     | Built-in dashed orbit and lead lines use `themeColor`; the current layout ignores `line.visible` and `line.style`.                  |

The interface also retains generic node and line options, including `block.showBackground`, `block.gap`, `image.position`, `image.gap`, `line.type`, `line.showArrow`, `line.arrowSize` and `line.distance`. The five specialized layouts currently do not use these options to control card backgrounds, spacing, image placement or arrows. Use the supported options described above.

## Canvas Size and Content Length

Start with the layout's default dimensions and spacing, then adjust images and text. Setting an explicit `height` helps the portrait layout reserve space for the final node's description. Clock layouts need sufficient horizontal space for text on both sides of the orbit. For more nodes, enlarge the canvas or shorten individual descriptions.

The examples use fixed canvas dimensions to show the full layout and embedded SVG images so that no additional image downloads are needed.

## Examples

- [Landscape Storyline](/vchart/demo/extension-chart/storyline-landscape)
- [Portrait Storyline](/vchart/demo/extension-chart/storyline-portrait)
- [Clock Storyline](/vchart/demo/extension-chart/storyline-clock)
- [Arc Storyline](/vchart/demo/extension-chart/storyline-arc)
- [Wing Storyline](/vchart/demo/extension-chart/storyline-wing)
