# 六边形分箱图 `hexbinPlot`

汇总大量二维散点的局部分布，颜色表示每个六边形箱内的观测数。输入原始散点，库计算分箱；所有箱面积相同，不按计数改变大小。

## 输入与配置

```json
{
  "type": "hexbinPlot",
  "binning": { "xBins": 30 },
  "data": [
    { "x": 1.2, "y": 3.4 },
    { "x": 1.4, "y": 3.8 }
  ]
}
```

- x/y 必填且为有限数值。重复坐标代表多条观测，分别计数。拒绝 null、数值字符串、未知字段、NaN、Infinity。
- binning 与 xBins 均可省略，默认 30；xBins 必须为 1–200 的整数。它表示横向归一化范围内的格网间隔数，不是总箱数或非空箱数，边缘可多一列。
- 上限 200 控制显示分辨率：单位方形内约有 `0.866 × xBins²` 个箱，加上边缘箱；只生成非空箱。
- fieldLabels 支持 x/y/count，改变轴与 tooltip 的展示文字。theme 使用 VChart 深浅主题；colors.sequential 支持公共命名色板及自定义颜色数组，默认 viridis。
- 不支持 id、series、weight、外部 count/vertices、其他聚合统计或对数坐标轴。[Schema](../../schema/plots/hexbinPlot.schema.json) 是字段契约。

[最小示例](../../examples/specs/minimal/hexbinPlot.json)；[合成双簇主例](../../examples/specs/hexbinPlot.json)；同一批点的[粗分箱](../../examples/specs/variants/hexbinPlot-coarse.json)/[细分箱](../../examples/specs/variants/hexbinPlot-fine.json)；[恒定轴](../../examples/specs/variants/hexbinPlot-constant.json)；[不同单位](../../examples/specs/variants/hexbinPlot-different-units.json)。全部为确定性合成数据。

## 分箱与解读

每个轴独立归一化。非恒定轴 origin=min、span=max−min；恒定轴 c 采用 span=max(1,abs(c))、origin=c−span/2，使观测位于归一化坐标 0.5。恒定轴扩展仅建立绘制空间，不表示观测存在变异。空数据使用 [0,1] 占位，显示空状态并隐藏计数色标。

采用固定原点 (0,0) 的平顶六边形，归一化半径 `R=2/(3×xBins)`。轴向整数格点 (q,s) 的中心为 `(1.5Rq, √3R(s+q/2))`。对观测的浮点轴向坐标及第三坐标 t=−q−s 做 cube rounding，使用 Math.round；最大舍入误差相等时按 q、s、t 的顺序修正。因此共享边界上的点有确定归属，每条观测恰好计数一次。箱按 q/s 数值排序，输入顺序不影响结果，箱内计数之和等于输入观测总数。

原始单位的多边形可能不是等边形；专用布局让归一化空间等比例映射到屏幕，显示为正六边形。轴域包含完整顶点且关闭自动取整。保形会在宽容器或高容器中留下额外空白，这是预期行为。0.5 px 描边帮助识别箱边界。

Tooltip 显示计数及原始单位的 x/y 包围盒上下界。这是六边形的外接矩形范围，**不是矩形分箱归属规则**。低计数表示稀疏；未绘制区域没有观测，不表示缺失值。颜色表示计数，不是概率密度；改变分辨率会改变每箱计数，不宜直接比较不同分辨率的颜色。

编译阶段做两遍扫描和一次分箱，仅为非空箱生成顶点：O(N + B log B) 时间、O(B) 额外空间。resize 和 hover 不重新分箱。更新通过 `chart.updateSpec(compileStatPlot(nextSpec))`；主题或配色变化不改变箱，数据或 xBins 变化会重新计算。归一化范围取当前输入，不承诺不同数据集或不同分辨率的箱可直接对应，也不保证与 Matplotlib 的箱划分逐项一致。

无法表示有限跨度、安全顶点范围或半径偏移因浮点精度塌缩时，边界校验报 `INVALID_RANGE /data`；应在计算端转换单位或平移坐标。正常的不同单位输入不会因量纲差异被拒绝。

## 选型边界与迁移

需要查看单个观测时使用 scatterPlot。类别坐标轴、加权计数、sum/mean 聚合不属于本图契约。缺失值策略在上游明确处理，库不静默丢弃观测。

旧 id/count/vertices Spec 直接拒绝，不提供兼容模式。迁移须取回原始 x/y 观测并选择 xBins；只有旧箱计数和顶点不能还原原始散点，不能用重复箱中心伪造分析数据。
