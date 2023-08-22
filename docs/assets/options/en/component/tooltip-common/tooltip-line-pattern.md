{{ target: component-tooltip-line-pattern }}

<!-- ITooltipLinePattern -->

#${prefix} visible(boolean) = true

Whether the current line is displayed.

{{ if: ${content} }}
#${prefix} key(string|Function)

The content of the key column for the current line of the tooltip. If configured as a string, it will be displayed as the corresponding constant text. It can also be configured as a function callback, with the type:

```ts
(datum: Datum) => string;
```

Where `datum` is the default data item corresponding to the current line of the tooltip.

{{ /if }}

#${prefix} value(string|Function)

The content of the value column for the current line of the tooltip. If configured as a string, it will be displayed as the corresponding constant text. It can also be configured as a function callback, with the type:

```ts
(datum: Datum) => string;
```

Where `datum` is the default data item corresponding to the current line of the tooltip.

{{ if: ${content} }}

#${prefix} hasShape(boolean) = true

Whether to show the shape symbol for the current line of the tooltip, default is `true`.

#${prefix} shapeType(string|Function)

The shape type displayed for the current line of the tooltip. If configured as a string, it will be displayed as the corresponding constant shape. It can also be configured as a function callback, with the type:

```ts
(datum: Datum) => string;
```

Where `datum` is the default data item corresponding to the current line of the tooltip.

<!-- TODO: Unify symbol types -->

Note: Built-in shapes include:

- `'triangleForward'`: Right arrow
- `'triangle'`: Triangle
- `'diamond'`: Diamond
- `'square'`: Square
- `'star'`: Star
- `'cardioid'`: Heart shape
- `'circle'`: Circle
- `'pentagon'`: Pentagon

#${prefix} shapeHollow(boolean) = false

Whether the shape displayed for the current line of the tooltip is hollow, default is `false`.

{{ /if }}