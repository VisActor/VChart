{{ target: graphic-attribute }}

<!-- IAttribute 通用的图形属性 -->

{{ if: !${noFill} }}
{{ use: graphic-fill-style(
  prefix = ${prefix}
) }}
{{ /if }}

{{ if: !${noStroke} }}
{{ use: graphic-stroke-style(
  prefix = ${prefix}
) }}
{{ /if }}

#${prefix} opacity(number)

整体透明度设置。

#${prefix} cursor(string)

鼠标悬浮时在图形元素上时鼠标的样式是什么。同 CSS 的 cursor。

{{ if: !${noTexture} }}

#${prefix} texture(string)

纹理类型配置，支持：`'circle' | 'diamond' | 'rect' | 'vertical-line' | 'horizontal-line' | 'bias-lr' | 'bias-rl' | 'grid'`。

示例：

```ts
style: {
  texture: 'circle',
  texturePadding: 1,
  textureSize: 5,
  textureColor: 'red'
}
```

#${prefix} textureColor(string)

纹理颜色。

#${prefix} textureSize(number)

纹理单元的大小。

#${prefix} texturePadding(number)

纹理单元间的空隙大小。

{{ /if }}

#${prefix} pickable(boolean) = true

是否支持事件拾取，默认为 true。

#${prefix} childrenPickable(boolean) = true

对于 group 节点，是否支持其子元素的事件拾取，默认为 true。如果 group `pickable` 关闭，`childrenPickable` 开启，那么 group 的子节点仍参与事件拾取。

#${prefix} zIndex(number)

显示层级配置。

#${prefix} visible(boolean) = true

元素是否可见。

#${prefix} dx(number)

x 方向的偏移。

#${prefix} dy(number)

y 方向的偏移。

#${prefix} support3d(boolean)

当图表开启了 3d 模式，该图元是否支持（启用）3d 能力（当 support3d 为 false 的时候，该图元会忽略 3d 效果，始终保持和 2d 一样的效果）。

{{ if: !${noAngle} }}

#${prefix} angle(number)

旋转角度。

{{ /if }}
