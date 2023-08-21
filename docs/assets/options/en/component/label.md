{{ target: component-label }}

#${prefix} visible(boolean) = false

Display chart data labels or not, by default labels are not displayed.

#${prefix} interactive(boolean) = false

Whether the data label graphic element supports interaction events, not supported by default.

#${prefix} formatMethod(Function)

The data label content formatting function, defined as follows:

```ts
  /**
   * 轴标签内容格式化函数
   * @param text 原始标签文本值
   * @param datum 图形数据
   * @returns 格式化后的文本
   */
  formatMethod?: (text: string | string[], datum?: any) => string | string[];
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

Whether to avoid the label corresponding to the base graphic element, not enabled by default.

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

{{ /if }}