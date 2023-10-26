{{ target: chart-component }}

<!-- 图表上通用的组件配置 -->

<!-- region -->

{{ use: common-region(
  axisType = ${axisType},
  regionType = ${regionType}
) }}

<!-- title -->

{{ use: component-title() }}

<!-- indicator -->

{{ use: component-indicator() }}

<!-- axes -->

{{ if: ${axisType} === 'cartesian' }}

{{ use: component-cartesian-axis(
  noBandAxis = ${noBandAxis}
) }}

<!-- markLine -->

{{ use: component-mark-line() }}

<!-- markArea -->

{{ use: component-mark-area() }}

<!-- markPoint -->

{{ use: component-mark-point() }}

{{ /if }}

{{ if: ${axisType} === 'polar' }}

{{ use: component-polar-axis() }}

{{ /if }}

<!-- legends -->

{{ use: component-legend() }}

<!-- crosshair -->

{{ if: !${noCrosshair} }}

{{ use: component-crosshair() }}

{{ /if }}

<!-- tooltip -->

{{ use: component-tooltip(
  prefix = '#'
) }}

<!-- layout -->

{{ use: common-layout() }}

<!-- player -->

{{ use: component-player() }}

<!-- scrollbar -->

{{ use: component-scrollbar() }}

<!-- dataZoom -->

{{ if: !${noDataZoom} }}

{{ use: component-data-zoom() }}

{{ /if }}

<!-- brush -->

{{ use: component-brush() }}

<!-- scales -->

{{ use: common-scale() }}

<!-- customMark -->

{{ use: common-custom-mark() }}

<!-- theme -->

{{ use: common-theme() }}
