{{ target: graphic-stroke-style }}

{{ use: graphic-partial-stroke-style(
prefix = ${prefix},
callbackType = ${callbackType},
markType = ${markType}
) }}

#${prefix} outerBorder(Object${callbackType})

外描边配置。

示例：

```ts
outerBorder: {
  distance: 2,
  lineWidth: 1,
  stroke: 'green'
},
```

{{ use: border-style(
prefix = '#' + ${prefix}
) }}

#${prefix} innerBorder(Object${callbackType})

内描边配置。

示例：

```ts
innerBorder: {
  distance: 2,
  lineWidth: 1,
  stroke: 'green'
},
```

{{ use: border-style(
prefix = '#' + ${prefix}
) }}
