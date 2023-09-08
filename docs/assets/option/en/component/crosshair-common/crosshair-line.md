{{ target: component-crosshair-line }}

#${prefix} visible(boolean)

Display crosshair auxiliary line or not.

#${prefix} type(string) = '${defaultType}'

The type of crosshair auxiliary line, optional values are `'line'` and `'rect'`.

#${prefix} width(number|string)

Size configuration for the crosshair auxiliary line. Different configuration methods for different types:

- When `type: 'line'`, `width` represents the width of the auxiliary line, only supports numeric types, in px
- When `type: 'rect'`, `width` represents the width of the auxiliary box, supports numeric types and percentage strings, the percentage string (e.g., `'120%'`) represents the percentage relative to the content interval

{{ if: ${isPolar} }}
#${prefix} smooth(boolean)

Only effective for `type: 'line'`, whether to draw smoothly under the polar coordinate system or not.

{{ /if }}

#${prefix} style(Object)

Style configuration for the crosshair auxiliary line. Different configuration methods for different types:

- If `type: 'line'`, `style` represents the style of the auxiliary line, and the configurable items are as follows:

```ts
{
  /**
   * 辅助线的颜色。
   */
  stroke?: string;
  /**
   * 辅助线的透明度。
   */
  strokeOpacity?: number;
  /**
   * 辅助线的整体透明度。
   */
  opacity?: number;
  /**
   * 辅助线的线宽。
   */
  lineWidth?: number;
  /**
   * 辅助线的虚线配置。
   */
  lineDash?: number[];
}
```

- If `type: 'rect'`, `style` represents the style of the auxiliary line, and the configurable items are as follows:

```ts
{
  /**
   * 辅助框的填充颜色。
   */
  fill?: string;
  /**
   *  辅助框的填充透明度。
   */
  fillOpacity?: number;
  /**
   * 辅助框的描边颜色。
   */
  stroke?: string;
  /**
   * 辅助框的描边透明度。
   */
  strokeOpacity?: number;
  /**
   * 辅助框的整体透明度。
   */
  opacity?: number;
  /**
   * 辅助框的线宽。
   */
  lineWidth?: number;
  /**
   * 辅助框的虚线配置。
   */
  lineDash?: number[];
}
```

{{ use: graphic-attribute(
  prefix = ${prefix} + '#',
  noAngle = true,
  noTexture = true
) }}