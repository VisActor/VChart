# 散点矩阵图 `pairPlot`

同时查看多个变量两两关系及对角分布。

只提供原始观测，由库计算对角直方图；不要求用户提供箱边界或计数。变量按 variables 顺序排列；框选按观测 id 跨非对角面板联动。

## 输入与配置

```json
{
  "type": "pairPlot",
  "variables": ["年龄", "收入"],
  "data": {
    "observations": [
      { "id": "1", "values": { "年龄": 25, "收入": 8000 } },
      { "id": "2", "values": { "年龄": 30, "收入": 12000 } },
      { "id": "3", "values": { "年龄": null, "收入": 10000 } }
    ]
  }
}
```

values 包含且仅包含 variables 中的键，数值有限，缺失显式为 null；id 唯一。分组时每条观测提供非空 series，否则全部省略。字段以 [JSON Schema](../../schema/plots/pairPlot.schema.json) 为准，未知属性直接拒绝。

顶层 `diagonal` 可省略，默认直方图；`{}`、`{"type":"histogram"}` 和 `{"binning":{}}` 均使用默认算法。指定箱数或关闭分布：

```json
{ "diagonal": { "type": "histogram", "binning": { "binCount": 20 } } }
```

```json
{ "diagonal": { "type": "none" } }
```

binCount 为 1–200 整数，表示每个非恒定变量的等宽箱数；每变量分别确定数值边界。none 不接受 binning，保留对角槽位与变量标题但不绘制分布或自身对自身的散点。分组不改变默认图形；本期不支持对角 KDE。

最小示例中的配置：`variables`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。此图不提供 fieldLabels，变量名称由 variables 明确指定，顺序即面板顺序。

[最小示例](../../examples/specs/minimal/pairPlot.json)；[完整主例](../../examples/specs/pairPlot.json)。

## 统计规则与解读

- 对角线按每变量独立排除 null；N 是该变量所有系列的有效数。非对角面板仅排除该 x/y 任一为 null 的观测，并在轴与 Tooltip 中说明面板有效 n，不先丢弃整行。
- 未指定 binCount 时，非恒定变量使用 `min(200,ceil(log2(N)+1))` 个候选等宽箱。该 Sturges 规则计算轻量，但大样本、长尾、多峰分布可能偏粗，可显式调整箱数；不声称复刻 NumPy/Seaborn 的 auto 算法。
- 同变量所有系列共用一份边界，各组独立计数，使用半透明重叠柱。图例只说明颜色、不筛选样本；高度是 count，不是概率密度，样本量不同会影响高度。
- 箱为 `[start,end)`，内部边界归右箱，最后一箱含最大值。重复坐标仍代表不同观测，分别计数。有效组保留零计数箱，全部缺失的组在该变量无柱。
- N=0 时域为 [0,1]，无柱并显示 n=0。单个有效值或恒定值 c 只用一个箱，域为 `c ± max(1,abs(c))/2`，即使显式箱数较大也不制造多份相同数值的分布。
- 非恒定变量的首尾边界取 min/max，中间边界统一计算。自动算法合并浮点舍入后的重复边界；显式箱数不可表示时拒绝，错误指向 `/diagonal/binning/binCount`。域溢出时指向 `/data/observations` 并指出变量；先转换单位或平移坐标，不静默丢数据。
- 同变量在所有面板共用域。计数轴独立从零开始，不能与其他变量的数值轴直接比较。

## 更新与规模

分箱在 compileStatPlot 中完成；resize、hover 和 brush 不计算分箱。修改数据、变量或箱数时重新 compile 并 updateSpec；切换 theme/colors 保持计数与边界。输入不修改，不内置抽样。

面板数随变量数平方增长；8 变量/1 万观测可形成 56 万散点。先选有意义的变量，必要抽样由计算端记录方法。相关测量见[性能基准](../../benchmarks/README.md)。

## 迁移与变体

旧 `data.diagonal` 直接移除，旧 Spec 不兼容；公开 PairPlotBin 已删除。原 observations 可直接保留，单独 bins 无法替代原始观测。

[指定两箱](../../examples/specs/variants/pairPlot-histogram.json)；[关闭对角分布](../../examples/specs/variants/pairPlot-none.json)；[全缺失/恒定变量](../../examples/specs/variants/pairPlot-missing-constant.json)。

## 选型边界

- 同一对象前后两次配对比较
