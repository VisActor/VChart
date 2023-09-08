{{ target: component-band-axis }}

<!-- IBandAxisSpec -->

#${prefix} bandPadding(number|number[]) = 0.2

**仅当轴为离散轴时生效**，用于同时设置轴的 `paddingInner` 和 `paddingOuter`，数值在(0,1)之间，优先级低于 `paddingInner` 和 `paddingOuter`。

**因为有可能存在多层 scale( xField 设置成了数组，即分组场景），所以支持了数组类型，用于多层 scale 的 bandPadding 配置**

#${prefix} paddingInner(number|number[]) = 0.1

**仅当轴为离散轴时生效**，轴分组内的间隔，数值在(0,1)之间，优先级高于 `bandPadding`。

** 因为有可能存在多层 scale( xField 设置成了数组，即分组场景），所以支持了数组类型，用于多层 scale 的 paddingInner 配置。**

更多可以参考 https://github.com/d3/d3-scale#band-scales。

#${prefix} paddingOuter(number|number[]) = 0.3

**仅当轴为离散轴时生效**，轴分组外的间隔，数值在(0,1)之间，优先级高于 `bandPadding`。

** 因为有可能存在多层 scale( xField 设置成了数组，即分组场景），所以支持了数组类型，用于多层 scale 的 paddingOuter 配置。**

更多可以参考 https://github.com/d3/d3-scale#band-scales。

#${prefix} domain(array)

**仅当轴为离散轴时生效**，配置离散轴的数值范围。
