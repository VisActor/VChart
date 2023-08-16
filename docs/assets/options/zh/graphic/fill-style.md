{{ target: graphic-fill-style }}

<!-- IFillStyle -->

#${prefix} fill(string|Object)

填充颜色。支持使用 `rgb(255,255,255)`，`rgba(255,255,255,1)`，`#fff` 等方式设置为纯色，也支持设置为渐变色填充。

- 渐变色使用

{{ use: graphic-gradient }}

#${prefix} fillOpacity(number)

填充透明度。

#${prefix} shadowBlur(number)

图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。

示例：

```ts
{
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  shadowBlur: 10
}
```

#${prefix} shadowColor(string)

阴影颜色。

#${prefix} shadowOffsetX(number)

阴影水平方向上的偏移距离。

#${prefix} shadowOffsetY(number)

阴影垂直方向上的偏移距离。
