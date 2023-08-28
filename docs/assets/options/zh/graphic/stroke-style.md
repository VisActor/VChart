{{ target: graphic-stroke-style }}

{{ use: graphic-partial-stroke-style(
  prefix = ${prefix}
) }}

#${prefix} outerBorder(Object)

外描边配置。

示例：

```ts
outerBorder: {
  distance: 2,
  lineWidth: 1,
  stroke: 'green'
},
```

##${prefix} distance(number)

外描边距离，单位 px。

{{ use: graphic-partial-stroke-style(
  prefix = '#' + ${prefix}
) }}

#${prefix} innerBorder(Object)

内描边配置。

示例：

```ts
innerBorder: {
  distance: 2,
  lineWidth: 1,
  stroke: 'green'
},
```

##${prefix} distance(number)

内描边距离，单位 px。

{{ use: graphic-partial-stroke-style(
  prefix = '#' + ${prefix}
) }}
