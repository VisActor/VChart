# StatPlots autocorrelationPlot 原始序列重构计划

**Goal:** 从有序原始样本生成 ACF 或 PACF，内部计算滞后统计与置信带。

**Architecture:** autocorrelation/estimation.ts 在编译阶段计算自协方差、ACF、Yule–Walker PACF 和置信带；复用 QQ 阶段建立的 vutils 公共 normalQuantile，输出既有 stem / scatter / rangeArea。

**Tech Stack:** TypeScript、vutils、VChart、Schema、Jest、Playwright、离线 Statsmodels fixtures；Node.js 22。

全局约束采用 [总计划](2026-10-09-statplots-raw-input-roadmap.md)。QQ 子计划的公共 inverse CDF 是本阶段前置条件。

## 1. 公共输入

```ts
interface AutocorrelationPlotRow { value: number; series?: string }
// 省略 BaseSpec / fieldLabels。
interface AutocorrelationPlotSpec {
  type: 'autocorrelationPlot';
  data: AutocorrelationPlotRow[];
  method?: 'acf' | 'pacf'; // 默认 acf，真正选择算法
  maxLag?: number;
  confidence?: false | { level?: number }; // 默认 95%；false 关闭
}
```

- 每系列按原始数组的相对顺序视为等间隔时间序列；不按 value 排序，不按系列之间的交错位置算滞后。重复值有效。
- 本轮不增加日期解析、缺失插值或不规则时间校正。null / 非有限值明确拒绝；说明不能删除中间缺失值后假称仍是原始等间隔序列。
- maxLag 为最高滞后阶，包含所有整数滞后 0..L；允许配置 1–512，再按组样本量校验。
- ACF 要求 N>=2、L<N；默认 L=min(floor(10log10N),N-1,512)。
- PACF 要求 N>=4、L<floor(N/2)；默认 L=min(floor(10log10N),floor(N/2)-1,512)。不同长度系列省略 maxLag 时各自采用默认值，图轴覆盖其并集。
- 常数序列的相关系数不可定义，明确报错，不生成全零或全一曲线。
- confidence.level 默认 0.95，要求 0<level<1，且 (1+level)/2 必须严格小于 1；浮点数无法表示对应分位点时明确报错。
- 删除 lag / correlation / lower / upper 结果输入及旧 interval 元数据；有限样本产生的数值异常不通过夹到 [-1,1] 掩盖。

第一版 ACF 固定非调整分母，PACF 固定 Yule–Walker MLE。暂不支持 adjusted、Burg、OLS、FFT、自定义滞后集合或其他 PACF 估计器，避免没有算法支持的 method 选项。

## 2. 计算规则

每组先计算均值 μ，并用 s=max|x_i-μ| 对中心化值作统一尺度归一化；u_i=(x_i-μ)/s。这是相关系数的尺度不变变换，用于避免平方溢出，不改变统计定义。不可表示的中心化跨度明确提示换单位或平移数据。

```ts
// 0 <= k <= L；全部滞后均以 N 为分母，包含去均值。
gamma[k] = sum(u[t] * u[t + k], t = 0..N-k-1) / N;
acf[k] = gamma[k] / gamma[0];
```

ACF：lag0=1；每阶直接计算交叉积，不把两个截断片段各自重新去均值后算 Pearson。参考 [Statsmodels acf](https://www.statsmodels.org/stable/generated/statsmodels.tsa.stattools.acf.html)，核对参数 adjusted=False、fft=False、missing='raise'。

PACF：对同一组非调整自协方差序列作 Levinson–Durbin 递推，等价于 Yule–Walker MLE。

```text
phi[1,1] = gamma[1]/gamma[0]
v[1] = gamma[0]*(1-phi[1,1]^2)
phi[k,k] = (gamma[k]-sum(phi[k-1,j]*gamma[k-j], j=1..k-1))/v[k-1]
phi[k,j] = phi[k-1,j]-phi[k,k]*phi[k-1,k-j]
v[k] = v[k-1]*(1-phi[k,k]^2)
pacf[k] = phi[k,k]
```

仅保留递推所需前一阶系数和当前阶，O(L) 工作存储；零、负或不可表示的递推方差返回 INVALID_RANGE，不用 epsilon / 伪逆或退回 ACF。参考 [Statsmodels pacf_yw](https://www.statsmodels.org/stable/generated/statsmodels.tsa.stattools.pacf_yw.html) 的 method='mle'，同时核对 pacf(method='ywm')。

## 3. 置信带与绘图

- z=normalQuantile((1+level)/2)。
- ACF 第 k>=1 阶带宽为 z×sqrt((1+2×sum(acf[j]^2,j=1..k-1))/N)，采用 Bartlett 近似。
- PACF 第 k>=1 阶带宽为 z/sqrt(N)，采用白噪声近似。
- 绘制范围为 [-width,+width]，中心在 0；不能把统计函数返回的 [estimate-width,estimate+width] 原样画成零假设检验带。
- lag0 绘制 stem / point，但不生成置信带。confidence=false 时不调用逆 CDF、不生成 rangeArea。
- tooltip 明确“零中心置信带”、水平、方法、样本量和相关系数；不把 confidence.level 与旧通用 interval 的外部边界混为一谈。
- 继续复用现有 stem、点与零参考线；轴不截断有效值或置信带。每组完整绘图，不暗中降采样。
- resize、图例过滤和 hover 不改算法结果，图例过滤同步作用于对应 stem、点和置信带；优先使用原生数据过滤关联。

Python 绘图对照参考 [plot_acf / plot_pacf](https://www.statsmodels.org/stable/_modules/statsmodels/graphics/tsaplots.html)，它们把统计置信区间平移至零并跳过 lag0。默认滞后上限与本计划的 512 计算成本边界在文档中明确，不承诺所有 Python 默认参数一致。

## 4. 文件与接口

路径相对 packages/vchart-statplots：

- 新增 src/plots/autocorrelation/estimation.ts：`computeAutocorrelation(spec: AutocorrelationPlotSpec): AutocorrelationResultRow[]`。
- 私有结果行包含 lag、correlation、series?、sampleCount、method 及可选 lower/upper/confidenceLevel；lower/upper 固定指零中心带。
- 修改 src/plots/autocorrelation/types.ts、validate.ts、compile.ts。validate 仅按组检查有限值、样本量、常数、maxLag 与 confidence；不做交叉积和 PACF 递推。
- 新增 __tests__/unit/autocorrelation.test.ts、__tests__/fixtures/autocorrelation.ts、__tests__/browser/autocorrelation.spec.ts、autocorrelation-performance.spec.ts。
- 迁移总计划中的 Schema、示例、旧第三阶段测试与中文文档；删除“任意外部无偏系数可超范围”的旧输入承诺。

## 5. 执行步骤与反例

- [ ] 先新增失败用例：data=[1,2,3,4]，ACF maxLag=2、confidence=false，期望 [1,0.25,-0.3]。截断片段 Pearson 会得到不同结果，必须使该错误实现失败。
- [ ] 新增同一序列 PACF maxLag=1 期望 [1,0.25]；为 N>=6 的序列从固定 Statsmodels 生成 L>=2 fixture，核对递推而非仅一阶退化。
- [ ] 运行 `npm test --prefix packages/vchart-statplots -- --runInBand autocorrelation.test.ts`，确认旧输入契约下失败。
- [ ] 实现分组、有序中心化、自协方差和 PACF 递推；用冻结数组确认没有排序。修改 types / validate / compile 并生成 Schema。
- [ ] 接入 normalQuantile 和置信带。N=4、95% ACF 的 lag1 带宽≈0.979981992270027、lag2 带宽≈1.0394279；核对中心恰为零、lag0 不绘制带、confidence=false 无带。
- [ ] 覆盖样本整体平移或乘非零常数的相关结果不变；在不等价的顺序重排下结果改变；交错 series 与各自连续输入结果一致。
- [ ] 覆盖常数、过少样本、滞后超界、非法 level、null/NaN/Infinity、递推奇异与数值不可表示、旧字段拒绝、空数据；错误必须指向原始行或具体配置。
- [ ] 浏览器切换 ACF/PACF、maxLag、confidence 后断言真实 stem、点和带的位置/数量变化；核对零中心、图例过滤、hover 值、同实例更新、resize 与 release。
- [ ] 新增 ACF、PACF、分组长度不同及关闭置信带的示例变体并登记；文档完整说明有序输入、等间隔前提、算法限制与 Python 差异。
- [ ] 执行总计划完整验收。每组计算 O(N×L+L²)，绘图 O(L)，记录默认 L 和最大 512 阶下的 10k / 100k compile 成本；同步检验 resize / hover 不调用 estimation。
- [ ] 完成可独立审阅变更，提交仅在用户要求时执行。

完成标准：原始有序序列驱动真正的 ACF/PACF 算法，置信带含义正确，统计与热路径分离，退化输入明确报错，数值结果可独立核对。
