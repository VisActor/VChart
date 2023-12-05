{{ target: component-label }}

#${prefix} visible(boolean) = false

图表数据标签是否显示，默认不展示标签。

#${prefix} interactive(boolean) = false

数据标签图元是否支持交互事件，默认不支持。

#${prefix} textType(string)

自 1.7.0 版本支持，文本类型。

可选：

- 'text'
- 'rich'
- 'html'

#${prefix} formatMethod(Function)

数据标签内容格式化函数，函数定义如下：

```ts
  /**
   * 轴标签内容格式化函数
   * @param text 原始标签文本值
   * @param datum 图形数据
   * @returns 格式化后的文本
   */
  formatMethod?: (text: string | string[], datum?: any) => string | string[] | IRichTextCharacter[];
```

#${prefix} formatter(string)

字符串模版，自`1.7.0`版本开始支持。

用`{}`包裹变量名的字符串模版，变量名取自数据属性值。

在饼图、百分比堆叠面积图、百分比堆叠折线图、百分比堆叠柱状图中，支持配置百分比, `{_percent_}`

例如，`formatter: 'type={type},value={value},percent={_percent_}'`

{{ if: !${noOffset} }}

{{ var: offsetNumber = ${defaultOffset} !== undefined ? ${defaultOffset} : 0 }}

#${prefix} offset(number)= ${offsetNumber}

{{ /if}}

标签与其对应数据图元的间距。

{{ if: !${noPosition} }}

#${prefix} position(string)

{{ /if }}

#${prefix} style(Object)

标签图元样式配置。

{{ use: graphic-text(
   prefix = '#' + ${prefix}
) }}

#${prefix} state(Object)

##${prefix} hover(Object)
hover 状态样式配置。

{{ use: graphic-text(
   prefix = '##' + ${prefix}
) }}

##${prefix} hover_reverse(Object)
未 hover 状态样式配置。

{{ use: graphic-text(
   prefix = '##' + ${prefix}
) }}

##${prefix} selected(Object)
选中状态样式配置。

{{ use: graphic-text(
   prefix = '##' + ${prefix}
) }}

##${prefix} selected_reverse(Object)
未选中状态样式配置。

{{ use: graphic-text(
   prefix = '##' + ${prefix}
) }}

{{ if: ${hasOverlap} }}

#${prefix} overlap(Object|false)

标签防重叠配置，默认开启。

##${prefix} hideOnHit(boolean) = true

检测到标签发生重叠后，是否隐藏放不下的标签。

##${prefix} clampForce(boolean) = true

是否约束标签必须在绘图区域内。

##${prefix} avoidBaseMark(boolean) = false

是否躲避标签对应的基础图元，在折线图/散点图/雷达图的点图元标签会默认开启，其他图表中默认关闭。

##${prefix} strategy(Array)

发生重叠后，标签的躲避策略，提供了 4 种躲避策略，分别为:

- 'position'：可选位置策略。若默认位置没有足够的空间放置标签，则考虑 position 内的备选位置。

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

- 'bound': `label.position`配置在图形内部时使用（建议仅在 rect 图元数据使用）。当图形大小不足以放下标签，则考虑 position 内的备选位置。

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

- `moveY`: y 方向散开策略。若默认位置没有足够的空间放置标签，则根据 offset 在 y 方向上寻找位置。

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

  - `moveX`: x 方向散开策略。若默认位置没有足够的空间放置标签，则根据 offset 在 x 方向上寻找位置。

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

智能反色配置，大部分图表中默认关闭了智能反色，除以下场景：

- 在柱状图中，当标签位置为内部（ `'inside'` | `'inside-top'` | `'inside-bottom'` | `'inside-right'` | `'inside-left'`） 时，默认开启。

##${prefix} mode(string)

对比度度量。

可选：

- 'WCAG': 使用 Web 内容可访问性指南度量对比度。默认使用该标准。更多详情可参考 https://webaim.org/resources/contrastchecker/。
- 'lightness': 使用色彩亮度度量对比度。更多详情可参考 https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl#l。

##${prefix} textType(string)

文本类型。对应不同的色彩对比度标准以保证文本的可读性。

默认为`'normalText'`。

可选值：

- `'largeText'` 大文本。WCAG 2.0 AA 级要求大文本的对比度至少为 3:1。大文本定义为粗体字体的 14 磅（通常为 18.66 像素）和或更大，或者正常字体 18 磅（通常为 24 像素）或更大。

- `'normalText'` 普通文本。WCAG 2.0 AA 级要求普通文本的对比度至少为 4.5:1。小于大文本的即为普通文本。

更多详情可参考 https://webaim.org/articles/contrast/ 。

##${prefix} contrastRatiosThreshold(number)

自定义对比度阈值。当 label 文本颜色与背景图元颜色的色彩对比度小于此阈值时，从色彩池中选择颜色更换 label 文本颜色以保证文字的可读性。

##${prefix} alternativeColors(string | string[])

自定义备选 label 颜色。这些颜色将补充在备选颜色池中，当对比度不满足阈值时从备选颜色池中选择满足文本可读性的颜色对 label 颜色更换。备选颜色池中默认包含白色 `‘#ffffff’` 和 黑色 `‘#000000’`。

##${prefix} fillStrategy(string)

label 填充色在智能反色时的四种策略：

- `'base'` 使用标签所在图元的颜色
- `'invertBase'` 使用经过智能反色计算后的颜色
- `'similarBase'` 使用经过智能反色计算后的颜色的互补色
- `'null'` 不执行智能反色，保持`style.fill`设置的颜色

默认设置为`'invertBase'`

##${prefix} strokeStrategy(string)

label 描边色在智能反色时的四种策略：

- `'base'` 使用标签所在图元的颜色
- `'invertBase'` 使用经过智能反色计算后的颜色
- `'similarBase'` 使用经过智能反色计算后的颜色的互补色
- `'null'` 不执行智能反色，保持`style.stroke`设置的颜色

默认设置为`'base'`

##${prefix} brightColor(string)

前景色与亮色具有对比度时，similarSeries 使用该色。
默认设置为'#ffffff'。

##${prefix} brightColor(string)

前景色与暗色具有对比度时，similarSeries 使用该色。
默认设置为'#000000'。

##${prefix} outsideEnable(boolean)

label 超出 mark 范围，也以 mark 作为背景色进行反色。
默认设置为`false`。

{{ /if }}

{{ if: !${ignoreCustom} }}

#${prefix} dataFilter(function)
自定义标签数据筛选和排序。自`1.3.0`版本开始支持。

返回一组标签数据，布局顺序与数组顺序一致。所以在数组中越靠后的数据将越有可能发生碰撞并被隐藏。  
函数回调参数为：`(data: LabelItem[]) => LabelItem[]`

```ts
export type LabelItem = {
  id?: string;
  data?: any;
} & ITextGraphicAttribute;
```

#${prefix} customLayoutFunc(function)
自定义标签布局函数。自`1.3.0`版本开始支持。

当配置了 customLayoutFunc 后，默认布局和防重叠逻辑将不再生效（position/offset 不生效）。

函数回调参数为：`(data: LabelItem[], getRelatedGraphic: (data: LabelItem) => IGraphic) => Text[];`
使用方式例如：

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
自定义标签躲避函数。自`1.3.0`版本开始支持。

当配置了 customOverlapFunc 后，若未配置`customLayoutFunc`，会根据 position 和 offset 进行初始布局后，进入自定义躲避逻辑。同时配置的防重叠逻辑(overlap)不生效。

函数回调参数为：`(label: Text[], getRelatedGraphic: (data: LabelItem) => IGraphic) => Text[];`

{{ /if }}

#${prefix} animation(boolean|object)
标签动画。配置 `false` 可以关闭标签动画。

##${prefix} duration(number)=300
标签动画时长，默认为 300 ms。

##${prefix} delay(number)=0
标签动画延迟执行时间。

##${prefix} easing(string)="linear"
标签动画缓动，默认为 `'linear'`

##${prefix} mode('same-time' | 'after' | 'after-all')="same-time"
标签动画播放时机。默认为 `"same-time"`。

- `'same-time'`：与关联数据元动画同时开始
- `'after'`：在关联数据元动画完成之后开始
- `'after-all'`：在所有数据图元动画完成之后开始

##${prefix} increaseEffect(boolean)=true
标签数值增长动画，当标签数据更新且为数值数据时触发。设置为 `false` 可以关闭此动画效果。
