# StatPlots 公共配色设计

用户已授权提供公共配色配置，并确认同时支持命名色板与自定义颜色数组。

## 公共契约

28 类 Spec 共用可选 `colors` 对象：

```json
{"theme":"light","colors":{"categorical":"colorblind","sequential":"viridis","diverging":"RdBu_r"}}
```

- categorical：默认 colorblind；支持 deep、vchart 或至少 1 个 `#RRGGBB` 色号。
- sequential：默认 viridis；支持 cividis 或至少 2 个 `#RRGGBB` 色号。
- diverging：默认 RdBu_r（蓝→浅色→红）；或至少 3 个 `#RRGGBB` 色号。
- 数组按顺序使用；连续/发散停靠点等距。发散色板的中心对应 0，偶数长度时中心由中间两色插值。分类颜色耗尽后按 VChart 原生行为循环。
- 未涉及的颜色用途允许共用配置，但不改变该图的数据编码。严格拒绝拼错名称、未知字段和非法色号。
- `theme` 仍为 VChart light/dark；数据色不因主题切换反转或改色。`categorical: 'vchart'` 恢复原生分类色，包括原生随类别数切换的色板。

## 编译与语义

分类图经 commonChart 使用 chart.color；missingValueMatrix 已观测取分类首色、缺失取主题缺失色。hexbinPlot、confusionMatrix 使用 sequential，SHAP 按特征内相对值使用 sequential（不按 SHAP 值正负着色）。correlationMatrix 使用 diverging，域固定 [-1,1]。缺失、常量、警告和参考线保留主题语义。

通过 VChart createScale 创建与图例相同的原生插值；不新增逐图元插值逻辑或运行时依赖。矩阵使用原生标签 smartInvert，校验实际底色对比度。

## 色板来源

Seaborn 0.13.2 的 colorblind/deep；Matplotlib 3.9.2 的 viridis/cividis 256 个采样值与 RdBu 的 11 个反向控制点。保存出处与许可，打包时包含。Python 仅在开发阶段生成静态色板数据，运行时无 Python 依赖。

## 图库与验收

图库提供三个角色的命名色板选择，JSON 可直接编辑自定义数组，编辑器与控件保持一致。类型切换仍加载对应示例，不增加新的持久化规则。验证默认/自定义/原生回退、完整 Schema、深浅主题更新、图例与图元一致、矩阵文字对比、冻结输入、28 图回归及大数据编译基准。
