{{ target: graphic-partial-stroke-style }}

{{ if: ${markType} === 'arc' }}
#${prefix} stroke(string|Object|Array|false|null${callbackType})

Since `1.4.0`, arc strokes accept an array whose entries correspond to the outer arc, end edge, inner arc, and start edge, in that order.

{{ else }}
#${prefix} stroke(string|Object|false|null${callbackType})

{{ /if }}

Stroke color. Supports solid colors such as `'#fff'` and `'rgb(255,255,255)'`, as well as gradients.

Set `stroke` to `false` to disable the stroke. When you set `stroke` directly to `null`, the result depends on the mark's fallback behavior.

- Gradient color usage

{{ use: graphic-gradient }}

#${prefix} strokeOpacity(number${callbackType})

Stroke opacity.

#${prefix} lineDash(Array${callbackType})

Used to configure the dashed line mode when filling lines. It uses an array of values to specify the alternating lengths of lines and gaps that describe the pattern.

> Note: To switch back to the solid line mode, set the dash list to an empty array.

Example:

```ts
lineDash: [2, 3];
// 切换回至实线模式
lineDash: [0];
```

#${prefix} lineDashOffset(number${callbackType})

An attribute to set the dashed line offset. For more details, you can refer to MDN [lineDashOffset](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineDashOffset).

#${prefix} lineWidth(number${callbackType})

Line width.

#${prefix} lineCap(string${callbackType})

An attribute that specifies how to draw the end of each line segment. There are 3 possible values: `'butt'`, `'round'`, and `'square'`. The default value is butt.

#${prefix} lineJoin(string${callbackType})

An attribute used to set how the two connected parts (segments, arcs, curves) of non-zero length are connected together (the deformed part whose specified end and control points are in the same position with a length of 0 will be ignored). This attribute has 3 values: `'round'`, `'bevel'`, and `'miter'`. The default value is `'miter'`.

#${prefix} miterLimit(number${callbackType})

An attribute that sets the limit ratio of the beveled surface. When the attribute value is obtained, the current value (the default value is 10.0) will be returned. When the attribute is set, 0, negative numbers, Infinity, and NaN will be ignored; all others will be assigned a new value.

<!-- TODO strokeTop: boolean confirm -->
