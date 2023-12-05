{{ target: component-tooltip-line-pattern }}

<!-- ITooltipLinePattern -->

#${prefix} visible(boolean) = true

当前行是否显示。

{{ if: ${content} }}
#${prefix} key(string|Function)

tooltip 当前行 key 列的内容。如果配置为字符串，则显示为对应的常量文本。也可配置为函数回调，类型为：

```ts
(datum: Datum) => string;
```

其中 `datum` 为 tooltip 当前行所默认对应的数据项。

{{ /if }}

#${prefix} value(string|Function|Object)

tooltip 当前行 value 列的内容。
如果配置为字符串，则显示为对应的常量文本。
也可配置为富文本配置，类型为：

```ts
{
    /**
     * 主标题文本类型（默认类型为text）
     * text, rich, html
     */
    type?: string;
    /**
     * 标题文本内容
     * - 支持富文本配置
     */
    text?: IRichTextCharacter[] | string;
}
```

也可配置为函数回调，类型为：

```ts
(datum: Datum) => string;
```

其中 `datum` 为 tooltip 当前行所默认对应的数据项。

{{ if: ${content} }}

#${prefix} hasShape(boolean) = true

是否在 tooltip 当前行显示 shape symbol，默认为`true`。

#${prefix} shapeType(string|Function)

tooltip 当前行显示的 shape 类型。如果配置为字符串，则显示为对应的常量形状。也可配置为函数回调，类型为：

```ts
(datum: Datum) => string;
```

其中 `datum` 为 tooltip 当前行所默认对应的数据项。

<!-- TODO：统一 symbol 类型 -->

注：内置形状包含：

- `'triangleForward'`: 右箭头
- `'triangle'`: 三角形
- `'diamond'`: 菱形
- `'square'`: 方形
- `'star'`: 星形
- `'cardioid'`: 心形
- `'circle'`: 圆形
- `'pentagon'`: 五角形

#${prefix} shapeHollow(boolean) = false

tooltip 当前行显示的 shape 是否空心，默认为`false`。

{{ /if }}
