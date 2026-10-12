# 箱线图 `boxPlot`

从原始分类观测计算箱线统计，比较组间四分位数、中位数与异常值。

## 输入与配置

每行 `{category: string, value: number, series?: string}` 是一条原始观测。允许无序和重复值，重复异常值也保留；按 category + series 独立统计。series 全部省略或每行提供非空名称，类别和系列按首次出现排列，不为没有观测的组合补空箱。

只需 type 和 data；`whiskers.iqrMultiplier` 默认 1.5，允许有限非负数（包括 0），无任意上限。它会改变须端点和异常值，不是说明文本。fieldLabels.category / value 改变轴展示名；统计量的 tooltip 使用固定中文名称。

[最小示例](../../examples/specs/minimal/boxPlot.json)、[完整主例](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/boxPlot.json)、[分组示例](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/grouped/boxPlot.json)。字段和未知属性限制见 [JSON Schema](../../schema/plots/boxPlot.schema.json)。

## 统计定义

编译时每组复制数值并排序一次，复用 vutils quantileSorted 求 25%、50%、75% 分位数。采用 `(N-1)p` 的相邻值线性插值，四分位数不一定是实际样本值；与采用其他分位数定义的工具可能不同。

IQR = Q3-Q1，围栏为 `[Q1-k×IQR, Q3+k×IQR]`。下须取不低于下围栏的最小观测，上须取不高于上围栏的最大观测，须不是围栏本身。插值产生的小样本边界若使候选落入箱体，须停在对应 Q1 / Q3；没有候选也取对应四分位数，确保五数依次非递减。

异常值是严格小于下须或严格大于上须的观测；端点相等不属于异常。原始 `[100,0,1,2,3,4,5,6,7]` 得到 Q1=2、median=4、Q3=6，须 `[0,7]`、异常值 `[100]`；默认围栏 `[-4,12]` 不作为须输出。异常不等同于数据错误，不自动删除。

## 小样本与数值边界

- 单样本和全相同值：五数等于该值，无异常值；不伪造箱高或抖动。
- `[0,10]`：默认五数 `[0,2.5,5,7.5,10]`；k=0 时须停在 `[2.5,7.5]`，两个观测都是异常值。
- `[0,100,100,100]`：Q1=75，围栏内最小观测为 100；下须停在 75，0 为异常值。
- `[5,5,5,5,100]`：IQR=0，须为 `[5,5]`，100 仍为异常；不自动改成最小最大值。
- 空表显示已有空态，不调用空数组的分位数计算。
- value 及 k 必须有限；非法值不静默清洗。全表 max-min 不可表示为有限数时返回 INVALID_RANGE /data，提示平移或换单位。
- 很大的有限 k 可使围栏超出有限数范围，该方向不排除观测；围栏只参与比较，渲染五数仍为有限值。

## 渲染与更新

统计只在 compileStatPlot 执行；更新使用 `chart.updateSpec(compileStatPlot(nextSpec))`。resize、主题切换和 hover 不重新扫描或排序原始样本。箱体 tooltip 展示五数与实际 IQR 倍数，异常点 tooltip 展示实际值及所属分组；纵轴包含异常值。

绘图规模为箱数加异常观测数；大量异常点不去重、不抽样。统计复杂度 `O(N + Σ N组 log N组)`，内存 `O(N)`。

## 迁移与选型边界

旧 q1 / median / q3 / whiskerLower / whiskerUpper / outliers 输入和 whiskerRule 字符串均拒绝。有完整原始样本时改用本契约；仅有五数摘要时使用原生 VChart boxPlot，不能反推原始样本。需要完整密度轮廓时选择小提琴图；本图不提供百分位须、min/max 须、权重或 notch。
