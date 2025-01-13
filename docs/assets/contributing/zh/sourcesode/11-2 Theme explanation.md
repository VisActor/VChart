# 主题的配置解析逻辑

VChart 提供了两种方式配置图表主题：

- 通过图表 spec 配置
- 通过 ThemeManager 注册主题

## 主题配置的获取与优先级比较 (core/vchart.ts)

这两种配置都可以通过配置一套 `ITheme` 类型的主题对象，但是这两种配置的优先级是什么呢？

> **注意**：严谨地说是三种，还有可以在 option 中配置，但是教程文档没有提到。源码中都告诉我们是：
> `currentTheme` < `optionTheme` < `specTheme`

在 `src/core/vchart.ts` 中有如下属性，获取到了用户配置的主题内容：

- `_spec.theme`：用户在图表 spec 对象配置中指定的主题
- `_currentThemeName`：通过 `VChart.ThemeManager.registerTheme` 注册的当前全局主题名称

### 简析主题合并的逻辑 (util/theme/merge-theme.ts)

#### mergeTheme 函数

```typescript
export function mergeTheme(target: Maybe<ITheme>, ...sources: Maybe<ITheme>[]): Maybe<ITheme> {
  return mergeSpec(transformThemeToMerge(target), ...sources.map(transformThemeToMerge));
}
```

#### mergeTheme 函数特点

- 是合并主题的基础，一层简单的封装
- 表现结果是后出现的 `sources` 会覆盖前出现的 `theme`
- 核心思路：简单地说是对象的属性覆盖

#### processThemeByChartType 函数

- 实现了特定类型表格的配置处理
- 提供更细粒度的主题定制能力
- 允许不同图表类型有独特的样式配置

经过层层关于优先级比较，表格类型的合并（`processThemeByChartType`），主题的合并处理逻辑，最终得到挂载在 VChart 对象里的 `currentTheme` 属性。
