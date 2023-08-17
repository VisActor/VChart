{{ target: graphic-fill-style }}

<!-- IFillStyle -->

#${prefix} fill(string|Object)

Fill color. Supports setting to pure color in ways like `rgb(255,255,255)`, `rgba(255,255,255,1)`, `#fff`, and also supports setting to gradient color fill.

- Gradient color usage

{{ use: graphic-gradient }}

#${prefix} fillOpacity(number)

Fill opacity.

#${prefix} shadowBlur(number)

The blur size of the graphic shadow. This property is used together with shadowColor, shadowOffsetX, and shadowOffsetY to set the shadow effect of the graphic.

Example:

```ts
{
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  shadowBlur: 10
}
```

#${prefix} shadowColor(string)

Shadow color.

#${prefix} shadowOffsetX(number)

The offset distance of the shadow in the horizontal direction.

#${prefix} shadowOffsetY(number)

The offset distance of the shadow in the vertical direction.