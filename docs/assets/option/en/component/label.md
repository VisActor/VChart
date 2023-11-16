{{ target: component-label }}

#${prefix} visible(boolean) = false

Display chart data labels or not, by default labels are not displayed.

#${prefix} interactive(boolean) = false

Whether the data label graphic element supports interaction events, not supported by default.

#${prefix} textType(string)

Supported since version 1.7.0, text type.

Optional:

- 'text'
- 'rich'
- 'html'

#${prefix} formatMethod(Function)

The data label content formatting function, defined as follows:

```ts
  /**
   * 轴标签内容格式化函数
   * @param text 原始标签文本值
   * @param datum 图形数据
   * @returns 格式化后的文本
   */
  formatMethod?: (text: string | string[], datum?: any) => string | string[] | IRichTextCharacter[];
```

{{ if: !${noOffset} }}

{{ var: offsetNumber = ${defaultOffset} !== undefined ? ${defaultOffset} : 0 }}

#${prefix} offset(number)= ${offsetNumber}

{{ /if}}

The distance between the label and its corresponding data graphic element.

{{ if: !${noPosition} }}

#${prefix} position(string)

{{ /if }}

#${prefix} style(Object)

Label graphic element style configuration.

{{ use: graphic-text(
   prefix = '#' + ${prefix}
) }}

#${prefix} state(Object)

##${prefix} hover(Object)
Hover state style configuration.

{{ use: graphic-text(
   prefix = '##' + ${prefix}
) }}

##${prefix} hover_reverse(Object)
Non-hover state style configuration.

{{ use: graphic-text(
   prefix = '##' + ${prefix}
) }}

##${prefix} selected(Object)
Selected state style configuration.

{{ use: graphic-text(
   prefix = '##' + ${prefix}
) }}

##${prefix} selected_reverse(Object)
Non-selected state style configuration.

{{ use: graphic-text(
   prefix = '##' + ${prefix}
) }}

{{ if: ${hasOverlap} }}

#${prefix} overlap(Object|false)

Label anti-overlap configuration.

##${prefix} hideOnHit(boolean) = true

Whether to hide the labels that cannot be placed due to overlapping detection.

##${prefix} clampForce(boolean) = true

Whether to constrain labels to be within the plotting area.

##${prefix} avoidBaseMark(boolean) = false

Whether to avoid the label corresponding to the base graphic element. In line charts / scatter plots / radar charts, the point element labels will be turned on by default, while in other charts, they are turned off by default.

##${prefix} strategy(Array)

Overlap avoidance strategy for labels, providing 4 avoidance strategies, respectively:

- 'position': Optional position strategy. If the default position does not have enough space to place the label, consider the alternative positions within the position.

  ```ts
  export type PositionStrategy = {
    /**
     * 可选位置策略。
     * 若默认位置没有足够的空间放置标签，则考虑 position 内的备选位置。
     */
    type: 'position';
    /** position 根据图表类型支持不同支持不同的位置配置 **/
    position?: Functional<LabelPosition[]>;
  };
  ```

- 'bound': Use when `label.position` is configured inside the graphic element (recommended for rect data element only). If the graphic size is not enough to accommodate the label, consider the alternative positions within the position.

  ```ts
  export type BoundStrategy = {
    /**
     * 标签配置在图形内部时使用。
     * 当图形大小不足以放下标签，则考虑 position 内的备选位置。
     */
    type: 'bound';
    /** position 根据图表类型支持不同支持不同的位置配置 **/
    position?: Functional<LabelPosition[]>;
  };
  ```

- `moveY`: Y-direction scatter strategy. If the default position does not have enough space to place the label, find the position in the Y-direction based on the offset.

  ```ts
  export type MoveYStrategy = {
    /**
     * y 方向散开策略。
     * 若默认位置没有足够的空间放置标签，则根据 offset 在 y 方向上寻找位置。
     */
    type: 'moveY';
    /**
     * y 方向上的尝试的位置偏移量，可配置为函数。
     */
    offset: Functional<number[]>; // number | (data: any) => number[];
  };
  ```

  - `moveX`: X-direction scatter strategy. If the default position does not have enough space to place the label, find the position in the X-direction based on the offset.

  ```ts
  export type MoveYStrategy = {
    /**
     * x 方向散开策略。
     * 若默认位置没有足够的空间放置标签，则根据 offset 在 x 方向上寻找位置。
     */
    type: 'moveX';
    /**
     * x 方向上的尝试的位置偏移量，可配置为函数。
     */
    offset: Functional<number[]>; // number | (data: any) => number[];
  };
  ```

{{ /if }}

{{ if: ${hasSmartInvert} }}

#${prefix} smartInvert(Object|false)

Smart Invert configuration.

##${prefix} textType(string)

Text type. Corresponds to different color contrast standards to ensure the readability of the text.

The default is `'normalText'`.

Optional values:

- `'largeText'` Large text. WCAG 2.0 AA level requires large text contrast to be at least 3:1. Large text is defined as bold font 14pt (usually 18.66 pixels) or larger, or normal font 18pt (usually 24 pixels) or larger.

- `'normalText'` Regular text. WCAG 2.0 AA level requires normal text contrast to be at least 4.5:1. Text smaller than large text is considered normal text.

For more details, please refer to https://webaim.org/articles/contrast/.

##${prefix} contrastRatiosThreshold(number)

Custom contrast ratio threshold. When the color contrast between the label text color and the background graphic element color is less than this threshold, select a color from the color pool to replace the label text color to ensure text readability.

##${prefix} alternativeColors(string | string[])

Customize alternative label colors. These colors will be added to the alternative color pool. Colors that satisfy text readability will be selected from the alternative color pool to replace the label color when the contrast does not meet the threshold. The default alternative color pool includes white `‘#ffffff’` and black `‘#000000’`.

##${prefix} fillStrategy(string)

Four strategies for label fill color in intelligent inversion:

- `'base'` uses the color of the element where the label is located
- `'invertBase'` uses the color calculated by smart inversion
- `'similarBase'` uses the complementary color of the color after intelligent inversion calculation
- `'null'` does not perform smart inversion and keeps the color set by `style.fill`

The default setting is `'invertBase'`

##${prefix} strokeStrategy(string)

Four strategies for label stroke color in intelligent inversion:

- `'base'` uses the color of the element where the label is located
- `'invertBase'` uses the color calculated by smart inversion
- `'similarBase'` uses the complementary color of the color after intelligent inversion calculation
- `'null'` does not perform smart inversion and keeps the color set by `style.stroke`

The default setting is `'base'`

##${prefix} brightColor(string)

similarSeries uses this color when the foreground color has contrast with the bright color.
The default setting is '#ffffff'.

##${prefix} brightColor(string)

similarSeries uses this color when the foreground color has contrast with the dark color.
The default setting is '#000000'.

##${prefix} outsideEnable(boolean)

If the label exceeds the mark range, mark will also be used as the background color for inversion.
The default setting is `false`.

{{ /if }}

{{ if: !${ignoreCustom} }}

#${prefix} dataFilter(function)
Custom label data filtering and sorting. Supported since version `1.3.0`.

Returns an array set of label data with the layout order consistent with the array order. Therefore, the later data in the array will have a higher chance of colliding and being hidden. The function callback parameter is:` (data: LabelItem[]) => LabelItem[]`

```ts
export type LabelItem = {
  id?: string;
  data?: any;
} & ITextGraphicAttribute;
```

#${prefix} customLayoutFunc(function)
Custom label layout function. Supported since version `1.3.0`.

When `customLayoutFunc` is configured, the default layout and overlap prevention logic will no longer take effect (`position`/`offset` will not be effective).

The function callback parameter is: `(data: LabelItem[], getRelatedGraphic: (data: LabelItem) => IGraphic) => Text[]`.
Example usage:

```js
import { createText } from '@visactor/vrender';

const layout = (data, getRelatedGraphic) => {
  return data.map(d => {
    const baseMark = getRelatedGraphic(d);
    const x = (baseMark.AABBBounds.x1 + baseMark.AABBBounds.x2) / 2;
    const y = (baseMark.AABBBounds.y1 + baseMark.AABBBounds.y2) / 2;
    return createText({ ...d, x, y });
  });
};
```

#${prefix} customOverlapFunc(function)
Custom label avoidance function. Supported since version `1.3.0`.

When `customOverlapFunc` is configured, and if `customLayoutFunc` is not also configured, it will initially perform a layout based on position and offset before entering the custom avoidance logic. The configured overlap prevention logic (`overlap`) will not take effect.

The function callback parameter is: `(label: Text[], getRelatedGraphic: (data: LabelItem) => IGraphic) => Text[]`

{{ /if }}

#${prefix} animation(boolean|object)
Label animation. Setting false can turn off label animation.

##${prefix} duration(number)=300
Label animation execution duration.

##${prefix} delay(number)=0
Label animation execution delay, default to 0.

##${prefix} easing(string)="linear"

Label animation easing, default to `'linear'`.

##${prefix} mode('same-time' | 'after' | 'after-all')="same-time"
Label animation playback timing. Defaults to "same-time".

- `'same-time'`: Starts simultaneously with the animation of the associated data element.
- `'after'`: Starts after the animation of the associated data element finishes.
- `'after-all'`: Starts after the animations of all data elements finish.

  ##${prefix} increaseEffect(boolean)=true
  Enable number increase animation while label data updated.
