# 公共配色

全部 28 类图表共用 `colors`，按颜色所表达的含义配置。它独立于 `theme: 'light' | 'dark'`，无需注册主题。

```json
{
  "type": "scatterPlot",
  "theme": "light",
  "colors": {
    "categorical": "colorblind",
    "sequential": "viridis",
    "diverging": "RdBu_r"
  },
  "data": [
    { "x": 1, "y": 2, "series": "A" },
    { "x": 2, "y": 1, "series": "B" }
  ]
}
```

上例列出三个角色的默认值；完全省略 `colors` 效果相同，也可以只覆盖一个角色。共享配置中的未使用角色不会改变当前图表的编码。

| 字段 | 用途 | 命名色板 | 自定义数组 |
| --- | --- | --- | --- |
| categorical | 无序类别、分组、系列 | colorblind（默认）、deep、vchart | 至少 1 个色号，按系列顺序分配 |
| sequential | 从低到高的数值 | viridis（默认）、cividis | 至少 2 个色号，低值→高值 |
| diverging | 相对统计中心的正负值 | RdBu_r（默认） | 至少 3 个色号，负值→中心→正值 |

数组每项为六位不透明 RGB 色号 `#RRGGBB`，支持大小写。名称区分大小写；不接受 CSS 变量、颜色名、透明色或回调，保证相同 JSON 在浏览器与 Node 中语义一致。错误返回 `/colors/...` 路径。

```json
{
  "type": "correlationMatrix",
  "method": "pearson",
  "colors": {
    "categorical": ["#0072B2", "#D55E00"],
    "sequential": ["#F7FBFF", "#6BAED6", "#08306B"],
    "diverging": ["#2166AC", "#F7F7F7", "#B2182B"]
  },
  "data": [
    { "row": "A", "column": "A", "correlation": 1 },
    { "row": "A", "column": "B", "correlation": -0.6 },
    { "row": "B", "column": "A", "correlation": -0.6 },
    { "row": "B", "column": "B", "correlation": 1 }
  ]
}
```

连续与发散数组的停靠点等距，使用 VChart 原生 RGB 插值。发散色板中点对应 0；偶数长度时中心由中间两色插值。建议使用奇数长度并显式给出中心色。自定义颜色不保证感知均匀或色觉友好；矩阵文字使用原生 smartInvert 调整对比度。

## 图表如何选择色板

| 图表 | 使用规则 |
| --- | --- |
| hexbinPlot | sequential，0→最大计数；空数据域 0→1 |
| confusionMatrix | sequential，计数为 0→最大计数（至少 1），归一化比例固定 0→1 |
| shapBeeswarmPlot | sequential，按每个特征自身的最小/最大特征值映射 0→1；颜色不表示 SHAP 值正负，也不用于跨特征绝对数值比较 |
| correlationMatrix | diverging，始终固定 -1→0→1；RdBu_r 为负值蓝、0 浅色、正值红 |
| missingValueMatrix | 已观测取 categorical 首色；vchart 模式取原生 infoColor；缺失取主题 disableFontColor |
| 其他 23 类 | categorical，系列与图例使用同一映射；区间透明度等仍遵循各图编码 |

单系列通常使用分类首色。分类色用尽后按 VChart 行为循环，不自动生成新的色号；大量类别建议分面或筛选。颜色按单图的系列域分配，共用色板不保证不同系列顺序的多张图自动同色。

## 深浅主题与更新

数据颜色在 light/dark 间保持一致，不自动反转。背景、轴、文字、参考线、边框、缺失值、SHAP 常量与拥挤警告仍使用 VChart 原生语义颜色。

`colors: { categorical: 'vchart' }` 恢复原生分类色板，也保留 VChart 根据类别数切换色板的能力；连续和发散色仍按对应角色配置。

更新时使用 `chart.updateSpec(compileStatPlot(nextSpec))`。编译不会修改输入或共享调用方的颜色数组。图库编辑区可切换命名色板，并可直接编辑 JSON 使用自定义数组；切换图表重新加载示例，配色不另行持久化。

## 色板来源

- [Seaborn 0.13.2](https://github.com/mwaskom/seaborn/blob/v0.13.2/seaborn/palettes.py)：colorblind、deep 原始 10 色数组。
- [Matplotlib 3.9.2 Listed colormaps](https://github.com/matplotlib/matplotlib/blob/v3.9.2/lib/matplotlib/_cm_listed.py)：viridis、cividis 保留全部 256 个源采样，RGB 分量乘 255 四舍五入为八位色号。
- [Matplotlib 3.9.2 ColorBrewer colormaps](https://github.com/matplotlib/matplotlib/blob/v3.9.2/lib/matplotlib/_cm.py)：RdBu 的 11 个控制点反转得到 RdBu_r。

色板静态打包，无网络请求或新增运行时依赖。连续插值使用 VChart，结果不承诺与 Matplotlib 的离散查找逐像素相同。上游许可及修改说明随包提供：[THIRD_PARTY_LICENSES.md](../THIRD_PARTY_LICENSES.md)。
