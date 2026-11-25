{{ target: series-circle-packing }}

{{ use: common-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  isHierarchy = true,
  seriesType = 'circlePacking',
  noMorph = ${noMorph},
  noStack = ${noStack},
  useInChart = ${useInChart},
  preset = 'growIn' + '|' + 'fadeIn',
  seriesMarks = ['leaf', 'nonLeaf'],
  defaultPreset = 'growIn'
) }}

#${prefix} categoryField(string)

Category field.

#${prefix} valueField(string)

Weight field.

#${prefix} layoutPadding(number|Array) = 5
Internal padding of the layer, supports passing an array to individually control the inner padding of a specific layer.

<!-- Drill down -->

{{ use: common-drill(
  prefix = ${prefix}
) }}

<!-- Label Element -->

#${prefix} label(Object)

Text labels for the circular nodes.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

Set `label.style.fill` for the label text color and `label.style.fontSize` for the font size in pixels. For example, add the following to your chart spec.

```ts
label: {
  style: {
    fill: '#D4380D',
    fontSize: 14
  }
}
```

{{ use: mark-style(
  markName = 'label'
) }}

{{ use: mark-text(
  prefix = '##' + ${prefix}
)}}

##${prefix} state(Object)

{{ use: mark-state-style() }}

<!-- circlePacking Element -->

#${prefix} circlePacking(Object)

circlePacking element configuration

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'circlePacking'
) }}

{{ use: mark-arc(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}
