{{ target: chart-storyline }}

# storylineChart

A Storyline chart presents an ordered sequence of nodes with images, titles and descriptions. It supports landscape, portrait, clock, arc and wing layouts.

Install the extension package with the same version as `@visactor/vchart` and register the chart before use:

```ts
import VChart from '@visactor/vchart';
import { registerStorylineChart } from '@visactor/vchart-extension';

registerStorylineChart();
const vchart = new VChart(
  {
    type: 'storyline',
    width: 1000,
    height: 560,
    layout: 'landscape',
    data: [
      { id: 'discover', title: 'Discover', content: 'Talk to users and define the goal.' },
      { id: 'launch', title: 'Launch', content: 'Release the product and collect feedback.' }
    ]
  },
  { dom: 'chart' }
);
vchart.renderSync();
```

Pass the node array directly to `data`. The top-level `title` configures node title marks. No `series`, `xField`, `yField` or axes are required.

See the [Storyline guide](/vchart/guide/tutorial_docs/Chart_Extensions/storyline) for usage. Examples: [landscape](/vchart/demo/extension-chart/storyline-landscape), [portrait](/vchart/demo/extension-chart/storyline-portrait), [clock](/vchart/demo/extension-chart/storyline-clock), [arc](/vchart/demo/extension-chart/storyline-arc) and [wing](/vchart/demo/extension-chart/storyline-wing).

## type(string) = 'storyline'

Required chart type. Must be `'storyline'`. Call `registerStorylineChart()` before use. The supported layouts are `landscape`, `portrait`, `clock`, `arc` and `wing`. See the [Storyline guide](/vchart/guide/tutorial_docs/Chart_Extensions/storyline) for configuration examples.

## width(number)

Chart width in pixels. The clock layout needs enough width for text on both sides of the orbit.

## height(number)

Chart height in pixels. The portrait layout divides the available height into node slots. An explicit height helps reserve enough space for the last node's description.

## autoFit(boolean) = true

Whether to fit the container size. Explicit `width` and `height` take precedence over container dimensions.

## background(string|Object)

Chart background.

{{ use: background }}

## padding(number|Array|Object)

Outer chart padding in pixels. Accepts a single number, `[top, right, bottom, left]` or `{ top, right, bottom, left }`.

When unset, the base defaults are:

| Layout           | Default padding (top, right, bottom, left)                |
| ---------------- | --------------------------------------------------------- |
| `landscape`      | `[20, 20, 100, 20]`                                       |
| `portrait`       | `[20, 20, automatic, 20]`, with a bottom minimum of `100` |
| `clock`          | `[40, 40, 60, 40]`                                        |
| `arc` / `up`     | `[280, h, 100, h]`                                        |
| `arc` / `down`   | `[0, h, 280, h]`                                          |
| `wing` / `left`  | `[40, 20, 100, 20]`                                       |
| `wing` / `right` | `[100, 20, 40, 20]`                                       |

Here `h = Math.round(width / (Math.max(data.length, 1) + 1))`, or `20` when chart width is unset. Portrait calculates bottom padding from canvas height, node count, image height and title line height.

With a visible `titleImage`, landscape, portrait, clock and wing use the larger of the configured top padding and the image's required space. Arc handles its theme image through its own geometry.

### top(number)

Top padding. With a visible theme image, landscape, portrait, clock and wing ensure that top padding is at least the space reserved for the image.

### right(number)

Right padding.

### bottom(number)

Bottom padding.

### left(number)

Left padding.

## data(Array)

Required node array. Nodes follow array order; dates are not sorted automatically, and spacing does not use a time scale. Do not wrap the array in the `{ id, values }` dataset format used by standard charts.

```ts
data: [
  {
    id: 'launch',
    title: 'Launch',
    content: ['Release the first version.', 'Collect user feedback.'],
    marker: '2024',
    image: 'https://example.com/launch.png' // Replace with your own image URL
  }
];
```

### id(string|number)

Optional unique node identifier. Defaults to the data index when omitted.

### title(string)

Node title. Configure its text style through the top-level `title.style`. An omitted or empty string creates no title mark.

### content(string|Array)

Node description as a string or an array of strings. Array entries are joined with line breaks. An omitted value or an empty array creates no description mark.

### image(string|HTMLImageElement|HTMLCanvasElement)

Main node image. Accepts an image URL, data URL, image element or canvas element. When omitted, landscape and portrait create no main image; clock, arc and wing draw a placeholder shape. Placeholder shapes are independent of `image.visible` and `image.showBackground`.

### subImage(string|HTMLImageElement|HTMLCanvasElement)

Offset decorative image behind the main image in the portrait layout. It is omitted when unset and is independent of `image.showBackground`. The other four layouts do not use this field.

### marker(string)

Time label used only in the portrait layout, such as `'2024'`. Characters are arranged vertically on the central axis. Configure size and visibility through the top-level `marker`.

### datum(any)

Original business data retained on the node. It does not affect layout or generate text.

## layout(string|Object) = 'landscape'

Corresponds to `IStorylineSpec.layout`, typed as `StorylineLayoutType | IStorylineLayoutOptions`. Defaults to `'landscape'`. A string selects the layout; an object additionally configures direction, angles, radius or internal padding. The object's `type` is required and its other fields are optional.

Type definitions from the extension's `src/charts/storyline/interface.ts`:

```ts
export type StorylineLayoutType = 'clock' | 'arc' | 'wing' | 'landscape' | 'portrait';
export type StorylineWingDirection = 'left' | 'right';
export type StorylineArcDirection = 'up' | 'down';
export interface IStorylineLayoutOptions {
  type: StorylineLayoutType;
  padding?: number | [number, number, number, number];
  radiusRatio?: number;
  startAngle?: number;
  endAngle?: number;
  direction?: StorylineWingDirection | StorylineArcDirection;
}
```

Parameters used by the five layouts:

| type        | Node arrangement                                               | Effective layout parameters                          |
| ----------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| `landscape` | Horizontal images with text alternating above and below        | `padding`                                            |
| `portrait`  | Alternating sides of a central axis, with optional time labels | `padding`                                            |
| `clock`     | Equal angular spacing clockwise in array order                 | Automatic geometry; other layout fields are unused   |
| `arc`       | Dome or bowl arc                                               | `direction`, `radiusRatio`, `startAngle`, `endAngle` |
| `wing`      | Wing arc anchored on the left or right                         | `direction`, `radiusRatio`, `startAngle`, `endAngle` |

```ts
import type { IStorylineSpec } from '@visactor/vchart-extension';

const simpleLayout: IStorylineSpec['layout'] = 'portrait';
const arcLayout: IStorylineSpec['layout'] = {
  type: 'arc',
  direction: 'down',
  radiusRatio: 0.88,
  startAngle: 20,
  endAngle: 160
};
```

The `direction` type combines four directions, but valid values depend on the layout: `up/down` for arc and `left/right` for wing. The table describes the fields actually used at runtime.

### type(string)

Required when using an object. Options are `'landscape'`, `'portrait'`, `'clock'`, `'arc'` and `'wing'`.

### padding(number|Array)

Typed as `number | [number, number, number, number]`, in pixels. A number applies to all four sides; a tuple must use `[top, right, bottom, left]`. Landscape and portrait use it to calculate the node area.

Precedence is `layout.padding` → `block.padding` → `24`; an explicit `0` is preserved. It applies inside the region established by the top-level `padding`. Both padding layers participate independently rather than replacing each other. The specialized clock, arc and wing geometry ignores this field.

### radiusRatio(number)

Radius ratio for arc and wing. Arc defaults to `0.88` and applies it to the horizontal radius; its vertical radius is derived from theme image height and the start angle. Wing defaults to `0.92` and applies it to both radii. Clock calculates its orbit radius automatically and ignores this parameter.

This is a unitless multiplier: `0.88` multiplies the layout's base radius by `0.88`; it does not specify image width. The type only requires a `number`, and the implementation does not apply a uniform `[0, 1]` clamp. Larger ratios can move content beyond the available area.

### startAngle(number)

Start angle for arc or wing, in degrees.

- `arc`: defaults to `200` for `up` and `20` for `down`.
- `wing`: defaults to `-70` for `left` and `110` for `right`.

The clock layout currently does not use this parameter.

Angles use screen coordinates: `0°` points right, `90°` down, `180°` left and `270°` up. Arc and wing arrange nodes using the difference between the start and end angles.

### endAngle(number)

End angle for arc or wing, in degrees.

- `arc`: defaults to `340` for `up` and `160` for `down`.
- `wing`: defaults to `70` for `left` and `250` for `right`.

The clock layout currently does not use this parameter.

Together with `startAngle`, this determines the arc covered by the nodes. Two or more nodes interpolate across the angle interval in array order; one node uses the midpoint angle.

### direction(string)

Direction for arc or wing. Other layouts do not use this parameter.

- `arc`: `'up'` (default) creates a dome with the title image at the bottom; `'down'` creates a bowl with the title image at the top.
- `wing`: `'left'` (default) or `'right'`, controlling the side where the wing's circle center is anchored.

## themeColor(string) = '#e8543d'

Default theme color for axes, connecting lines, image backgrounds and accents. Explicit mark styles take precedence.

## block(Object)

Node dimensions and internal padding. Landscape and portrait use node boxes; arc uses width options for horizontal geometry and text width. Clock and wing use their own geometry.

The interface fields `block.gap` and `block.showBackground` belong to the generic fallback layout and are unused by the five public layouts. Use `image.showBackground` for image decorations.

### width(number)

Fixed node width for landscape and portrait, taking precedence over adaptive width options. Arc also uses it as a text width limit and may shrink text areas when space is limited. Clock and wing calculate node geometry automatically.

### widthRatio(number) = 0.24

Adaptive node width as a fraction of the available view width, constrained by `minWidth` and `maxWidth`. Used by portrait and by arc's horizontal geometry calculation. Landscape calculates width from the node count when `width` is unset.

### minWidth(number) = 180

Minimum adaptive node width. Ignored when `width` is set. Applies to the same layouts as `widthRatio`.

### maxWidth(number)

Maximum adaptive node width, defaulting to `Math.max(minWidth, 320)`. Ignored when `width` is set. Applies to the same layouts as `widthRatio`.

### height(number)

Base node height for landscape and portrait. Landscape defaults to `320`. When unset, portrait uses `Math.max(120, Math.floor(innerAvailableHeight / (data.length + 1)))`; image height defaults to `0.6` times that value, and the description area is at least `1.25` times it or three description lines.

Clock, arc and wing do not use this parameter to size their nodes.

### padding(number|Array)

Internal padding as a single number or `[top, right, bottom, left]`. For landscape and portrait node positions it is the fallback for `layout.padding`, defaulting to `24`. Clock also uses it to calculate its orbit and text areas, defaulting to `24`.

Landscape additionally uses it to calculate image width and minimum image height; the local fallback used in the minimum-height calculation is `12`. Arc and wing do not use it in their specialized node geometry.

### style(Object)

Rectangle background style. Landscape and portrait merge this into the image background when `image.showBackground` is enabled. For example, `{ fill: '#fff', stroke: '#3b82a0', lineWidth: 2 }`.

{{ use: graphic-rect(prefix = '###') }}

## title(Object)

Title mark configuration for each node, using `data[].title` and displaying at most two lines by default. This is not the standard chart title component; it does not use the top-level `title.text` or `title.subtext`.

### visible(boolean) = true

Whether to display node titles.

### style(Object)

Title text style, for example `{ fontSize: 20, lineHeight: 27, fontWeight: 'bold', fill: '#23364d' }`. Use numbers for `fontSize` and `lineHeight`.

Without an explicit font size, adaptive ranges are `8–34` for landscape and portrait, `8–30` for clock and `10–40` for arc. Wing uses text measurements to fit within `14–30`. An explicit `fontSize` takes precedence. Default line height is the rounded font size multiplied by `1.35` for landscape, portrait and arc, `1.28` for clock, or `1.3` for wing.

Titles default to bold with a white stroke. Landscape, portrait and arc use a dark fill; clock and wing use the theme color. The layout sets position, alignment and a default two-line limit; explicit styles override mark attributes.

{{ use: storyline-text-style(prefix = '###') }}

## content(Object)

Description mark configuration, using `data[].content`. The current five layouts join paragraphs into text with line breaks; available width and height depend on the layout.

### visible(boolean) = true

Whether to display descriptions.

### style(Object)

Description text style, for example `{ fontSize: 14, lineHeight: 21, fill: '#526174' }`. Use numbers for font size and line height.

Default font size / line height: `16 / 23` for landscape and portrait, `14 / 20` for clock and `12 / 17` for wing. Arc scales from a baseline of `18 / 24` according to node count and available space. Clock's description height defaults to a fixed `80`; changing line height does not enlarge that area.

Landscape, portrait and arc use `heightLimit` and an ellipsis for overflowing descriptions by default. Wing allows long descriptions to extend and potentially exceed the canvas. Set `heightLimit` and `ellipsis` to adjust text display; this does not automatically increase node spacing.

{{ use: storyline-text-style(prefix = '###') }}

## image(Object)

Corresponds to `IStorylineSpec.image`, typed as `IStorylineImageSpec`, and configures all main node images. Individual sources belong in `data[i].image`; the main-image configuration has no top-level `image` source field.

```ts
import type { IMarkSpec, IImageMarkSpec } from '@visactor/vchart';

export type StorylineImagePosition = 'top' | 'left' | 'right' | 'bottom';
export interface IStorylineImageSpec extends IMarkSpec<IImageMarkSpec> {
  width?: number;
  height?: number;
  position?: StorylineImagePosition;
  gap?: number;
  showBackground?: boolean;
}
```

This interface extends `IMarkSpec<IImageMarkSpec>`, inheriting `visible`, `interactive`, `zIndex`, `style`, `state` and other common mark options. The exact `style` type is `ConvertToMarkStyleSpec<IImageMarkSpec>`. Style attributes accept static values and mark style expressions; the top-level `width` and `height` used by Storyline layout are numeric pixel values.

Responsibilities of each configuration layer:

| Configuration          | Purpose                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `data[i].image`        | Image URL, data URL, image element or canvas element for node i                          |
| `image.width/height`   | Inputs to the corresponding layout's image-size calculation                              |
| `image.visible`        | Visibility of main image marks that have been created                                    |
| `image.showBackground` | Decorations created separately by the layout                                             |
| `image.style`          | Main-image drawing attributes, merged after layout defaults                              |
| `data[i].subImage`     | Independent offset decoration in portrait; does not inherit `image` styles or visibility |

The type still declares `position` (`top/left/right/bottom`) and `gap` (spacing in pixels) for generic fallback nodes. The five public layouts arrange images and text themselves and ignore these two fields.

This portrait example sets both layout dimensions and the image fitting mode:

```ts
import type { IStorylineSpec } from '@visactor/vchart-extension';

const spec: IStorylineSpec = {
  type: 'storyline',
  width: 1080,
  height: 1920,
  layout: 'portrait',
  image: {
    width: 220,
    height: 140,
    visible: true,
    showBackground: true,
    style: { imageMode: 'cover', imagePosition: 'center', cornerRadius: 12 }
  },
  data: [
    {
      title: '1930',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
      subImage: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-2022.png'
    }
  ]
};
```

Omitting the entire `image` configuration still draws main images with defaults when nodes provide `data[i].image`. See `data.image` for placeholders used when a source is missing.

### visible(boolean) = true

Whether to display image marks created from `data[].image`. Does not control decorations, placeholders for missing images or `data[].subImage`, and does not remove the space allocated to the image.

### interactive(boolean) = false

Inherited from `IMarkSpec`. Whether main image marks participate in interaction. Set to `true` for mouse events. Does not enable interaction on separate decorations or `subImage`.

### zIndex(number)

Inherited from `IMarkSpec`. Overrides the image mark's drawing order; defaults depend on the layout. Marks inside a node remain subject to their parent group's drawing order.

### state(Object)

State styles inherited from `IMarkSpec<IImageMarkSpec>`. Supports `normal`, `hover`, `hover_reverse`, `selected`, `selected_reverse` and custom state names. Each value can be an image style directly or a full state configuration containing `style`.

Also enable `image.interactive` for mouse-triggered states. State styles do not change Storyline node layout.

### width(number)

Portrait defaults to `Math.max(blockWidth, 80)`. Wing uses a default base width of `160` and further scales it along the main line.

Arc uses `Math.max(image.width ?? 240, image.height ?? 240)` as its base diameter, then scales to the available space as a square image area. Setting only one dimension below `240` therefore does not reduce the base diameter.

Landscape and clock calculate image width automatically and ignore this field.

### height(number)

Landscape starts from `0.42` times node height and adjusts for title line height, internal padding and canvas space. Portrait defaults to `Math.round(blockHeight * 0.6)`. Wing uses a default base height of `160` and further scales it along the main line.

Arc combines this with `image.width` to determine its base diameter; see `image.width`. Clock calculates image height automatically and ignores this field.

### showBackground(boolean)

Whether to display image background decorations. Defaults to `false` for landscape and portrait, and `true` for clock, arc and wing.

Does not control main images, `subImage` or placeholders for missing main images. Use `image.visible` to hide main images.

### style(Object)

The type comes from `IMarkSpec<IImageMarkSpec>['style']`. The layout first calculates default position, dimensions and source, then merges this object so explicit styles take precedence.

| style field                   | Default / purpose                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `imageMode`                   | `contain`: fit the whole image; also `cover` (fill and crop), `fill` (stretch), `auto` (intrinsic size) |
| `imagePosition`               | `center`; also keywords, combined positions and `[x, y]` tuples such as `['25%', '75%']`                |
| `repeatX / repeatY`           | `no-repeat`; also `repeat` and `stretch`                                                                |
| `imageScale`                  | Extra content scaling without changing layout dimensions                                                |
| `imageOffsetX / imageOffsetY` | Pixel offsets for image content without moving the node                                                 |
| `opacity`                     | Overall mark opacity in `0–1`                                                                           |

`imageMode`, `imagePosition`, `imageScale` and image-content offsets are for non-repeating rendering; keep both `repeatX` and `repeatY` at `no-repeat` when using them.

Changing `image.width/height` participates in supported layout calculations. Changing `image.style.width/height` only overrides the main-image drawing box; decorations, leader lines and text keep their original layout. Likewise, `image.style.image` only overrides an existing main image and cannot replace `data[i].image` to trigger its creation.

{{ use: graphic-image(prefix = '###') }}

#### cornerRadius(number|Array)

Landscape and portrait main images have no additional corner-radius override. Clock, arc and wing default to a radius-based circular clip. Accepts one number or four values in `[top-left, top-right, bottom-right, bottom-left]` order, in pixels. Affects the image mark only; decorations use separate geometry.

## titleImage(Object)

Corresponds to `IStorylineSpec.titleImage`, typed as `IStorylineTitleImageSpec`. This is one theme image shared by the chart, with its source in `titleImage.image`. Configure it separately from main node images in `data[i].image` and node decorations in `data[i].subImage`.

```ts
import type { IMarkSpec, IImageMarkSpec } from '@visactor/vchart';

export interface IStorylineTitleImageSpec extends IMarkSpec<IImageMarkSpec> {
  width?: number;
  height?: number;
  visible?: boolean;
  image?: string | HTMLImageElement | HTMLCanvasElement;
}
```

All four declared fields, `image`, `visible`, `width` and `height`, are optional, but a valid `image` is necessary to create the theme image. This interface extends `IMarkSpec<IImageMarkSpec>`, inheriting `visible`, `interactive`, `zIndex`, `style`, `state` and other common mark options. The exact `style` type is `ConvertToMarkStyleSpec<IImageMarkSpec>`. Style attributes accept static values and mark style expressions; the top-level `width` and `height` used by Storyline layout are numeric pixel values.

| Layout                         | Default theme-image placement                       | Area used for default dimensions |
| ------------------------------ | --------------------------------------------------- | -------------------------------- |
| `landscape / portrait / clock` | Centered at the canvas top, with a `12` pixel inset | Entire canvas                    |
| `arc / up`                     | Bottom center of the plotting region                | Region after chart padding       |
| `arc / down`                   | Top center of the plotting region                   | Region after chart padding       |
| `wing / left`                  | Canvas top right, with a `12` pixel top inset       | Entire canvas                    |
| `wing / right`                 | Canvas top left, with a `12` pixel top inset        | Entire canvas                    |

Clock uses the top theme image. The top-level `width` and `height` specify the layout box in pixels; their defaults are documented below. `style.imageMode` fits the image content inside that box; the source's intrinsic dimensions do not determine the box.

```ts
import type { IStorylineSpec } from '@visactor/vchart-extension';

const titleImage: IStorylineSpec['titleImage'] = {
  image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/title-world-cap.png',
  visible: true,
  width: 520,
  height: 180,
  style: { imageMode: 'contain', imagePosition: 'center', opacity: 0.9 }
};
```

### image(string|HTMLImageElement|HTMLCanvasElement)

The source type is `string | HTMLImageElement | HTMLCanvasElement`: an image URL, data URL, loaded image element or canvas element.

When unset, no theme image is created. Creation checks this field, so setting only `titleImage.style.image` cannot create the image. Once the mark exists, `style.image` can override its drawing source; normally keep the source in this field.

### visible(boolean) = true

Whether to create the theme image, defaulting to `true`. A source in `titleImage.image` is still required. Setting this to `false` removes the additional top reserve in landscape, portrait, clock and wing, while retaining each layout's base padding.

Arc always uses the theme-image box dimensions, including defaults, to calculate its radius and position. Hiding the image does not collapse that geometry.

`titleImage.style.visible: false` only hides a mark after creation and keeps the top reserve. Prefer this top-level field to disable the theme image.

### interactive(boolean) = false

Inherited from `IMarkSpec`. Whether theme image marks participate in interaction. Set to `true` for mouse events. Does not enable interaction on separate decorations or `subImage`.

### zIndex(number)

Inherited from `IMarkSpec`. Overrides the image mark's drawing order; defaults depend on the layout. Marks inside a node remain subject to their parent group's drawing order.

### state(Object)

State styles inherited from `IMarkSpec<IImageMarkSpec>`. Supports `normal`, `hover`, `hover_reverse`, `selected`, `selected_reverse` and custom state names. Each value can be an image style directly or a full state configuration containing `style`.

Also enable `titleImage.interactive` for mouse-triggered states. State styles do not change Storyline node layout.

### width(number)

Theme image width. Landscape, portrait and clock default to `0.52` times canvas width, capped at `720`. Wing defaults to `0.6` times canvas width, capped at `820`. Arc defaults to `0.68` times region width, capped at `900`.

An explicit width overrides these defaults. Arc enforces a minimum width of `80`; other layouts enforce a minimum of `1`.

### height(number)

Theme image height. Landscape, portrait, clock and wing default to `0.36` times theme image width, capped by canvas height. Arc defaults to `0.34` times image width.

An explicit height overrides these defaults. Arc enforces a minimum height of `40`; other layouts enforce a minimum of `1`.

### style(Object)

The type comes from `IMarkSpec<IImageMarkSpec>['style']`. The layout first calculates default position, dimensions and source, then merges this object so explicit styles take precedence.

| style field                   | Default / purpose                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `imageMode`                   | `contain`: fit the whole image; also `cover` (fill and crop), `fill` (stretch), `auto` (intrinsic size) |
| `imagePosition`               | `center`; also keywords, combined positions and `[x, y]` tuples such as `['25%', '75%']`                |
| `repeatX / repeatY`           | `no-repeat`; also `repeat` and `stretch`                                                                |
| `imageScale`                  | Extra content scaling without changing layout dimensions                                                |
| `imageOffsetX / imageOffsetY` | Pixel offsets for image content without moving the node                                                 |
| `opacity`                     | Overall mark opacity in `0–1`                                                                           |

`imageMode`, `imagePosition`, `imageScale` and image-content offsets are for non-repeating rendering; keep both `repeatX` and `repeatY` at `no-repeat` when using them.

Changing `titleImage.width/height` participates in theme-image layout and space reservation. Changing `titleImage.style.width/height`, `x/y` or `dx/dy` only overrides drawing attributes; it does not recalculate top padding or arc geometry.

{{ use: graphic-image(prefix = '###') }}

#### cornerRadius(number|Array)

Theme images have no additional corner-radius override by default. Accepts one number or four values in `[top-left, top-right, bottom-right, bottom-left]` order, in pixels. Affects the image mark only; decorations use separate geometry.

## line(Object)

Main line or central axis configuration. Landscape, portrait, arc and wing generate their own curve, axis, arc and wing shape; clock uses a fixed orbit and leader lines.

The interface fields `line.type`, `line.showArrow`, `line.arrowSize` and `line.distance` belong to generic fallback connections and do not affect the main lines of the five public layouts.

### visible(boolean)

- `landscape`: visible by default; draws the main curve and node dots when there are at least two nodes. Set to `false` to hide both while retaining each node's text leader line.
- `portrait`: visible by default; draws the central axis when there are at least two nodes. Set to `false` to hide the axis and its time labels.
- `arc`: hidden by default; explicitly set to `true` to draw the main arc. Text leader lines remain independent.
- `wing`: visible by default; set to `false` to hide the main wing shape. Text leader lines remain independent.
- `clock`: ignores this parameter and draws its orbit and leader lines according to its built-in layout.

### style(Object)

The landscape curve supports `stroke`, `lineWidth` and `lineDash`. The portrait axis uses `fill`, `stroke`, `lineWidth` and `cornerRadius`. Wing uses `fill` or `stroke` as the main shape's fill color. Arc and clock ignore this configuration and use `themeColor` for their line colors.

Line geometry is generated by the layout, not configured through `style.path` or `style.points`.

#### stroke(string|Object|boolean)

Stroke of the landscape curve or portrait axis. Wing also uses `stroke` as its fill color when `fill` is unset.

#### fill(string|Object)

Fill color of the portrait axis or wing shape. Portrait defaults to a theme color gradient; wing defaults to the theme color.

#### lineWidth(number)

Width of the landscape curve (default `4`) or portrait axis stroke (default `0`), in pixels. Wing also uses this as a fallback for the width at the end of its main shape.

#### lineDash(Array)

Dash pattern of the landscape curve, defaulting to `[6, 5]`. Also applies to the leader lines connecting landscape nodes to their text.

#### cornerRadius(number|Array)

Corner radius of the portrait axis, defaulting to `0`.

## marker(Object)

Time label configuration for portrait, using `data[].marker`. Characters are arranged vertically on the central axis. Other layouts do not use this configuration.

### visible(boolean) = true

Whether to display time labels. Labels are also omitted when the axis is hidden or the node has no `marker` value.

### style(Object)

Time label style. Common options are numeric `fontSize` and `lineHeight`; when omitted, they adapt to the canvas, label length and slot space. The default character color is white, with per-character rich text styles generated by the layout.

#### fontSize(number)

Time label font size in pixels. When unset, it adapts to the canvas, text length and axis slot, within a default range of `16–38`.

#### lineHeight(number)

Line height for each vertically arranged character, defaulting to `Math.round(resolvedFontSize * 0.9)`.

#### fontWeight(string|number) = 'bold'

Time label font weight.

#### shadowColor(string) = 'rgba(0, 0, 0, 0.3)'

Text shadow color.

#### shadowBlur(number) = 8

Text shadow blur radius.

#### shadowOffsetX(number) = 0

Horizontal text shadow offset.

#### shadowOffsetY(number) = 5

Vertical text shadow offset.

{{ target: storyline-text-style }}

#${prefix} fontSize(number)

Font size in pixels.

#${prefix} lineHeight(number)

Line height in pixels.

#${prefix} fontFamily(string)

Font family.

#${prefix} fontWeight(string|number)

Font weight, such as `'normal'`, `'bold'` or `500`.

#${prefix} fill(string|Object)

Text fill color.

#${prefix} stroke(string|Object|boolean)

Text stroke color. Set to `false` to disable the stroke.

#${prefix} lineWidth(number)

Text stroke width in pixels.

#${prefix} textAlign(string)

Horizontal alignment, such as `'left'`, `'center'` or `'right'`. Defaults depend on the layout.

#${prefix} textBaseline(string)

Vertical alignment baseline, such as `'top'`, `'middle'` or `'bottom'`. Defaults depend on the layout.

#${prefix} maxLineWidth(number)

Maximum line width. Leave enough room for adjacent nodes when overriding the width calculated by the layout.

#${prefix} opacity(number)

Text opacity from `0` to `1`.

#${prefix} dx(number)

Horizontal offset from the layout position, in pixels.

#${prefix} dy(number)

Vertical offset from the layout position, in pixels.

#${prefix} heightLimit(number)

Maximum text rendering height in pixels. Affects text display, not node spacing.

#${prefix} lineClamp(number)

Maximum text lines. Titles default to `2`; adjust the text height when changing this limit.

#${prefix} ellipsis(string|boolean)

Overflow marker, such as `'...'`.

#${prefix} whiteSpace(string)

Text wrapping mode, defaulting to `'normal'` in these layouts.

#${prefix} wordBreak(string)

Word breaking mode, defaulting to `'break-word'` in these layouts.
