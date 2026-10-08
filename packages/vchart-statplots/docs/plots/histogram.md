# 直方图 `histogram`

从一个连续变量的原始观测查看分箱分布和尾部。库在编译阶段分箱、计数并换算显示量。

statistic 默认为 count；proportion 的柱高之和为 1；density 的柱面积之和为 1。归一化分母是这一个分布的全部观测数，不接受多系列。

## 输入与配置

```json
{
  "type": "histogram",
  "binning": { "binCount": 20 },
  "data": [{ "value": 0.1 }, { "value": 0.4 }, { "value": 1.2 }]
}
```

- 每行仅提供有限数值 value；拒绝 null、字符串、NaN、Infinity、series、id、weight 及旧 binStart/binEnd/count。重复值是多条观测，分别计数。
- binning/binCount 可省略；非恒定数据默认 `min(200,ceil(log2(N)+1))`（Sturges 候选数）。显式 binCount 必须是 1–200 的整数，不四舍五入或钳制。
- 默认算法只依赖样本量，长尾、多峰和大样本可能需要显式调整箱数；不等价于 NumPy bins='auto'，也不承诺最佳分箱。
- statistic 支持 count（计数）、proportion（count/N）、density（count/N/箱宽）。公共 theme、colors.categorical、title、description 沿用现有规则，单系列无图例。
- fieldLabels.value 改变 x 轴与 tooltip 上下界的名称；count/proportion/density 改变统计量展示名。count 模式不重复展示计数和柱高。

完整字段及错误结构见 [JSON Schema](../../schema/plots/histogram.schema.json) 与 [Spec 协议](../spec.md)。

[最小示例](../../examples/specs/minimal/histogram.json)；[完整主例](../../examples/specs/histogram.json)；同批观测的[粗分箱](../../examples/specs/variants/histogram-coarse.json)/[细分箱](../../examples/specs/variants/histogram-fine.json)；[恒定值](../../examples/specs/variants/histogram-constant.json)；[零频次区间](../../examples/specs/variants/histogram-zero-bin.json)。

## 分箱与数值边界

非恒定观测按 [min,max] 生成等宽边界。所有箱共享同一边界数组；每箱左闭右开 [start,end)，最后一箱包含 max，内部边界上的观测归右箱。箱计数之和等于 N，零频次箱保留，输入顺序不改变结果。

空 data 使用 [0,1] 占位域、无箱，显示“暂无可绘制数据”。单点或恒定值 c 使用一箱，域为 `c ± max(1,abs(c))/2`，即使指定更多箱也只生成一箱；扩展只建立绘制空间，不表示观测有变异。原始全零值仍产生有效计数柱。

有限输入可能构成溢出跨度或无法区分的浮点边界。无法建立有限递增轴域报 INVALID_RANGE /data；默认边界舍入重复时合并（有效箱数可能少于候选数），显式箱数不能兑现时报 INVALID_RANGE /binning/binCount。density 要求每箱 1/箱宽 有限，无法满足时在 /data 报错，需先转换单位。count/proportion 不受这个额外密度限制。

渲染使用原生 bar 与连续轴，柱宽覆盖真实箱区间，通过原生 barMinWidth='0%' 关闭默认最小像素宽度，密集分箱也不扩大区间。分箱只发生在 compileStatPlot；resize 和 hover 不扫描原始样本，主题/配色重编译不改变边界或计数。更新 data/binCount/statistic 后使用 `chart.updateSpec(compileStatPlot(nextSpec))`。

## 迁移

旧 binStart/binEnd/count/series 数据直接拒绝。只持有聚合结果时使用 VChart 原生 histogram；聚合数据不能恢复完整原始样本，不应按 count 展开伪造观测。

## 选型边界

- 类别频数比较
- 多组叠加分布比较
