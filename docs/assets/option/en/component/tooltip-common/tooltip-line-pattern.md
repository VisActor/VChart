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

#${prefix} keyTimeFormat(string) = '%Y%m%d'

Time conversion format of key label.

| **Date Granularity** | **Format Configuration** | **Date Content**            | **Example** | **Numerical Range** |
| -------------------- | ------------------------ | --------------------------- | ----------- | ------------------- |
| Year                 | %Y                       | Full year name              | 2022        |                     |
| month                | %b                       | abbreviated month           | Jul         |                     |
|                      | %B                       | full name of the month      | July        |                     |
|                      | %m                       | month                       | 7           | [01, 12]            |
| week                 | %a                       | abbreviated week            | Wed         |                     |
|                      | %A                       | full name of the week       | Wednesday   |                     |
| day                  | %d                       | day with 0-padded digits    | 1           | [01, 31]            |
|                      | %e                       | blank-padded days of digits | 1           | [ 1, 31]            |
| hour                 | %H                       | 24-hour format hour         | 1           | [00, 23]            |
|                      | %I                       | 12-hour format hour         | 1           | [01, 12]            |
|                      | %p                       | AM or PM                    | AM          |                     |
| minutes              | %M                       | minutes                     | 0           | [00, 59]            |
| seconds              | %S                       | seconds                     | 0           | [00, 61]            |
| milliseconds         | %L                       | milliseconds                | 1           | [000, 999]          |

#${prefix} keyTimeFormatMode(string) = 'local'

Time conversion mode of key label. Support `'utc' | 'local'` mode.

{{ /if }}

#${prefix} value(string|Function|Object)

tooltip The contents of the value column of the current row.
If configured as a string, it will be displayed as the corresponding constant text.
It can also be configured as rich text configuration, the type is:

```ts
{
    /**
     * Main title text type (default type is text)
     * text, rich, html
     */
    type?: string;
    /**
     * Title text content
     * - Support rich text configuration
     */
    text?: IRichTextCharacter[] | string;
}
```

It can also be configured as a function callback, the type is:

```ts
(datum: Datum) => string;
```

Where `datum` is the default data item corresponding to the current line of the tooltip.

#${prefix} valueTimeFormat(string) = '%Y%m%d'

Time conversion format of value label.

| **Date Granularity** | **Format Configuration** | **Date Content**            | **Example** | **Numerical Range** |
| -------------------- | ------------------------ | --------------------------- | ----------- | ------------------- |
| Year                 | %Y                       | Full year name              | 2022        |                     |
| month                | %b                       | abbreviated month           | Jul         |                     |
|                      | %B                       | full name of the month      | July        |                     |
|                      | %m                       | month                       | 7           | [01, 12]            |
| week                 | %a                       | abbreviated week            | Wed         |                     |
|                      | %A                       | full name of the week       | Wednesday   |                     |
| day                  | %d                       | day with 0-padded digits    | 1           | [01, 31]            |
|                      | %e                       | blank-padded days of digits | 1           | [ 1, 31]            |
| hour                 | %H                       | 24-hour format hour         | 1           | [00, 23]            |
|                      | %I                       | 12-hour format hour         | 1           | [01, 12]            |
|                      | %p                       | AM or PM                    | AM          |                     |
| minutes              | %M                       | minutes                     | 0           | [00, 59]            |
| seconds              | %S                       | seconds                     | 0           | [00, 61]            |
| milliseconds         | %L                       | milliseconds                | 1           | [000, 999]          |

#${prefix} valueTimeFormatMode(string) = 'local'

Time conversion mode of value label. Support `'utc' | 'local'` mode.

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
