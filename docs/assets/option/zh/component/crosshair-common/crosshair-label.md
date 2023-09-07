{{ target: component-crosshair-label }}

<!-- ICrosshairLabelSpec -->

#${prefix} visible(boolean)

是否显示 crosshair 文本标签。

#${prefix} formatMethod(Function)

label 文本格式化方法。函数的定义如下：

```ts
  /**
   * label 文本格式化方法
   * @param text
   * @returns
   */
  formatMethod?: (text: string | number | (string | number)[]) => string | string[];
```

#${prefix} style(Object)

{{ use: graphic-text(
  prefix = ${prefix} + '#'
) }}

#${prefix} labelBackground(Object)

文本背景相关配置。

##${prefix} visible(boolean) = true

是否显示文本背景。

##${prefix} padding(number|number[]|Object)

{{ use: common-padding(
  componentName='crosshair 的文本背景'
) }}

##${prefix} minWidth(number) = 30

文本背景最小宽度，单位 px。

##${prefix} maxWidth(number)

最大宽度，像素值。当文字超过最大宽度时，会自动省略。

##${prefix} style(Object)

背景样式配置。

{{ use: graphic-rect(
  prefix = ${prefix} + '##'
) }}
