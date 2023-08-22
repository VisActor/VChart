{{ target: component-linear-axis }}

<!-- ILinearAxisSpec -->

#${prefix} min(number)

**仅当轴为线性轴时生效**，最小值，**优先级高于 zero，nice**。

#${prefix} max(number)

**仅当轴为线性轴时生效**，最大值，**优先级高于 zero，nice**。

#${prefix} nice(boolean) = true

**仅当轴为线性轴时生效**，是否根据数据将轴范围调整到相对规整的数值，当配置了 `min` 和 `max`，该配置项失效。

比如当配置了 `max = 999`, `nice` 并不会将轴范围优化到 1000。

#${prefix} niceType(string) = 'tickCountFirst'

**仅当轴为线性轴时生效**，nice 效果的类型，是精度优先还是 tickCount 优先（比如 tickCount 为 2 那 nice 出来的精度就很低）。不配置就默认是 tickCountFirst。

可选值：

- `'tickCountFirst'`
- `'accurateFirst'`

举例：数据范围是 0~6000，如果 tickCount 为 2，那么 `tickCountFirst` 出来的 range 就是[0, 10000], `accurateFirst` 出来的 range 就是[0, 6000]但 10000 显示不了。

#${prefix} zero(boolean) = true

**仅当轴为线性轴时生效**，是否包含 0 值。当配置了 min 和 max，该配置项失效。

#${prefix} expand(Object)

**仅当轴为线性轴时生效**，轴范围按比例扩展，当配置了 min 和 max，该配置项失效。

##${prefix} min(number)

轴范围按比例扩展的最小值。

##${prefix} max(number)

轴范围按比例扩展的最大值。

#${prefix} sync(Object)

使当前轴与其他轴同步

##${prefix} axisId(number)

同步的另一个轴的 id

##${prefix} zeroAlign(number)

保持 2 个轴的 0 值对齐

##${prefix} tickAlign(number)

使这个轴的 tick 与目标轴保持比例对齐
