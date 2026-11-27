{{ target: graphic-stroke-style }}

{{ use: graphic-partial-stroke-style(
prefix = ${prefix},
callbackType = ${callbackType},
markType = ${markType}
) }}

#${prefix} outerBorder(Object${callbackType})

Outer border configuration.

Example:

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

Inner border configuration.

Example:

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
