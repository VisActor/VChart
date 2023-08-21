{{ target: component-crosshair-label }}

<!-- ICrosshairLabelSpec -->

#${prefix} visible(boolean)

Display the crosshair text label or not.

#${prefix} formatMethod(Function)

Label text formatting method. The function definition is as follows:

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

Text background related configuration.

##${prefix} visible(boolean) = true

Whether to display the text background or not.

##${prefix} padding(number|number[]|Object)

{{ use: common-padding(
  componentName='crosshair text background'
) }}

##${prefix} minWidth(number) = 30

The minimum width of the text background, in pixels.

##${prefix} maxWidth(number)

The maximum width, in pixels. When the text exceeds the maximum width, it will be truncated automatically.

##${prefix} style(Object)

Background style configuration.

{{ use: graphic-rect(
  prefix = ${prefix} + '##'
) }}