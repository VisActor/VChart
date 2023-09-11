{{ target: component-band-axis }}

<!-- IBandAxisSpec -->
<!-- TODO：描述不精准 -->

#${prefix} bandPadding(number|number[]) = 0.2

**仅当轴为离散轴时生效**，轴分组之间间隔，数值在(0,1)之间。

#${prefix} paddingInner(number|number[])

**仅当轴为离散轴时生效**，轴分组内的间隔，数值在(0,1)之间。

#${prefix} paddingOuter(number|number[])

**仅当轴为离散轴时生效**，轴分组外的间隔，数值在(0,1)之间。

#${prefix} domain(array)

**仅当轴为离散轴时生效**，配置离散轴的数值范围。

#${prefix} bandSize(number)

**仅当轴为离散轴时生效**，配置离散轴的固定组宽。

在视觉表现上是这样的效果：不管图表容器大小如何变化，轴上 tick 和 tick 之间的距离保持不变（如果是柱状图，则柱宽也保持不变）。

#${prefix} maxBandSize(number)

**仅当轴为离散轴时生效**，配置离散轴的最大组宽。

由于图表会在容器中默认等比例展示全部的 tick，那么当图表容器变大时，自动计算的组宽也会等比例变大。当自动计算的组宽大于 `maxBandSize` 时，组宽将维持 `maxBandSize` 的值。

当已经配置 `bandSize` 时，`maxBandSize` 将不再生效。

#${prefix} minBandSize(number)

**仅当轴为离散轴时生效**，配置离散轴的最小组宽。

由于图表会在容器中默认等比例展示全部的 tick，那么当图表容器变小时，自动计算的组宽也会等比例变小。当自动计算的组宽小于 `minBandSize` 时，组宽将维持 `minBandSize` 的值。

当已经配置 `bandSize` 时，`minBandSize` 将不再生效。
