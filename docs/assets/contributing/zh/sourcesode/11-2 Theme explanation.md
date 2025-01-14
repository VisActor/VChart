# 主题的配置解析逻辑

VChart 提供了两种方式配置图表主题：

- 通过图表 spec 配置
- 通过 ThemeManager 注册主题

## 主题配置的获取与优先级比较 (core/vchart.ts)

这两种配置都可以通过配置一套 `ITheme` 类型的主题对象，但是这两种配置的优先级是什么呢？

> **注意**：严谨地说是三种主题来源：
>
> - `currentTheme`：通过 `ThemeManager` 注册的全局默认主题
> - `optionTheme`：在 VChart 构造函数的 options 中传入的主题
> - `specTheme`：在图表规格（spec）中指定的主题
>
> 它们的优先级从低到高依次是：
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

- 是合并主题的基础，一层简单的封装，简单地说是对象的属性覆盖
- 表现结果是后出现的 `sources` 会覆盖前出现的 `theme`

**合并示例**

```typescript
const baseTheme = { color: 'blue', fontSize: 12 };
const optionTheme = { color: 'red' };
const specTheme = { fontSize: 14 };

const finalTheme = mergeTheme({}, baseTheme, optionTheme, specTheme);
// 结果：{ color: 'red', fontSize: 14 }
```

#### processThemeByChartType 函数

```typescript
const processThemeByChartType = (type: string, theme: ITheme) => {
  if (theme.chart?.[type]) {
    theme = mergeTheme({}, theme, theme.chart[type]);
  }
  return theme;
};
```

processThemeByChartType 是 VChart 主题系统中实现图表类型个性化的关键函数。它通过条件合并和 mergeTheme，实现了在保持全局主题一致性的同时，为不同图表类型提供定制化样式的能力。

### 字符串主题与对象主题的解析处理

用户配置主题时可以简单便捷的传入字符串主题，例如：

```typescript
const chart = new VChart({
  theme: 'light'
});
```

也可以传入详细配置的对象主题，例如:

```typescript
const chart = new VChart({
  theme: {
    color: { primary: 'red' },
    fontSize: 14,
    chart: {
      bar: {
        color: 'blue'
      }
    }
  }
});
```

在源码里针对两者的处理的核心，在\_updateCurrentTheme 里判断类型，并通过 getThemeObject()做转化，统一处理成对象主题来解析的，这是个简单的逻辑，却为 VChart 的配置提供了灵活性和便捷性。

最终，经过层层关于优先级比较，表格类型的合并（`processThemeByChartType`），主题的合并处理逻辑，最终得到挂载在 VChart 对象里的 `currentTheme` 属性。

## 主题配置的预处理

当主题配置，合并后，会进入预处理阶段。主题预处理是 VChart 主题系统的关键步骤，主要完成以下工作：

1. 语义化颜色转换
   - 将 `{ color: 'brand.primary' }` 转换为具体颜色值
2. Token 替换
   - 将 `{ fontSize: 'size.m' }` 转换为具体字号
3. 递归处理嵌套对象

将抽象的主题描述转换为具体的样式配置,为开发者提供直观的配置能力

**预处理流程**：

```typescript
this._currentTheme = preprocessTheme(processThemeByChartType(chartType, finalTheme));
```

## 主题的预处理与解析

```typescript
export function preprocessTheme(
  obj: any, //主题对象
  colorScheme?: IThemeColorScheme, // 颜色方案
  tokenMap?: TokenMap, // 标记映射
  seriesSpec?: ISeriesSpec // 系列规格
);
```

这里涉及了 VChart 主题配置的三个重要概念：

- `colorScheme`: 颜色方案
- `tokenMap`: 标记映射

```typescript
VChart.ThemeManager.registerTheme('dataVizTheme', {
  colorScheme: {
    brand: { primary: '#3A8DFF' },
    data: {
      positive: '#48BB78',
      negative: '#F56565'
    }
  },
  tokenMap: {
    typography: {
      fontSize: {
        small: 12,
        medium: 14,
        large: 16
      }
    }
  }
});
```

开发者可以在注册时利用`registerTheme`方法仿照如上案例注册一套基于这 2 个概念的复杂主题配置，在实际使用中，开发者可以通过 { color: 'data.positive' } 或 { fontSize: { token: 'typography.fontSize.medium' } } 的方式引用这些定义。这里谈谈 VChart 是如何解析这个复杂对象的。

先逐层分析，这个处理函数 processTheme 的关键算法是递归遍历对象:

```typescript
Object.keys(obj).forEach(key => {
  const value = obj[key];
  if (IGNORE_KEYS.includes(key)) {
    newObj[key] = value;
  }
  // 处理颜色语义化转换、Token 语义化转换
  else if (isPlainObject(value)) {
    if (isColorKey(value)) {
      newObj[key] = getActualColor(value, colorScheme, seriesSpec);
    } else if (isTokenKey(value)) {
      newObj[key] = queryToken(tokenMap, value);
    }
    // 这里使用了递归处理嵌套对象，使得能够处理任意深度的嵌套对象
    else {
      newObj[key] = preprocessTheme(value, colorScheme, tokenMap, seriesSpec);
    }
  }
  // 非对象类型直接赋值
  else {
    newObj[key] = value;
  }
});
```

接下来分析具体的对于颜色语义和 token 语义的处理与解析

#### getActualColor 颜色语义化

```typescript
/** 查询语义化颜色 */
export const getActualColor = (value: any, colorScheme?: IThemeColorScheme, seriesSpec?: ISeriesSpec) => {
  if (colorScheme && isColorKey(value)) {
    const color = queryColorFromColorScheme(colorScheme, value, seriesSpec);
    if (color) {
      return color;
    }
  }
  return value;
};

export function queryColorFromColorScheme(
  colorScheme: IThemeColorScheme,
  colorKey: IColorKey,
  seriesSpec?: ISeriesSpec
): ColorSchemeItem | undefined {
  const scheme = getColorSchemeBySeries(colorScheme, seriesSpec);
  if (!scheme) {
    return undefined;
  }
  let color;
  const { palette } = scheme as IColorSchemeStruct;
  if (isObject(palette)) {
    color = getUpgradedTokenValue(palette, colorKey.key) ?? colorKey.default;
  }
  if (!color) {
    return undefined;
  }
  if ((isNil(colorKey.a) && isNil(colorKey.l)) || !isString(color)) {
    return color;
  }
  let c = new Color(color);
  if (isValid(colorKey.l)) {
    const { r, g, b } = c.color;
    const { h, s } = rgbToHsl(r, g, b);
    const rgb = hslToRgb(h, s, colorKey.l);
    const newColor = new Color(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    newColor.setOpacity(c.color.opacity);
    c = newColor;
  }
  if (isValid(colorKey.a)) {
    c.setOpacity(colorKey.a);
  }
  return c.toRGBA();
}
```

queryColorFromColorScheme 是 VChart 主题系统中颜色处理的核心函数，它接收颜色方案（colorScheme）、颜色键（colorKey）和可选的系列规格（seriesSpec），通过一系列复杂的颜色查找和转换算法，实现了语义化颜色的精确定位和动态增强。

函数的核心逻辑是：首先根据系列规格获取特定的颜色方案，然后从调色板中查找对应的颜色。

```typescript
export function getColorSchemeBySeries(
  colorScheme?: IThemeColorScheme,
  seriesSpec?: ISeriesSpec
): ColorScheme | undefined {
  const { type: seriesType } = seriesSpec ?? {};
  let scheme: ColorScheme | undefined;
  if (!seriesSpec || isNil(seriesType)) {
    scheme = colorScheme?.default;
  } else {
    const direction = getDirectionFromSeriesSpec(seriesSpec);
    scheme = colorScheme?.[`${seriesType}_${direction}`] ?? colorScheme?.[seriesType] ?? colorScheme?.default;
  }
  return scheme;
}
```

这个算法优先匹配具体 `seriesType_direction` 的颜色方案，然后再匹配通用 `seriesType` 的颜色方案，最后再匹配默认颜色方案。

值得一提的是，此外函数还提供了两种高级颜色处理能力，根据 `colorKey` 中 `l` 或 `a` 的属性来动态处理颜色特性：

1. **通过 HSL 色彩空间转换实现颜色亮度的动态调整**

   - **算法原理**

     > - 色彩空间转换：RGB → HSL → RGB

     - **HSL 亮度调整核心代码**

       ```javascript
       if (isValid(colorKey.l)) {
         const { r, g, b } = c.color;
         const { h, s } = rgbToHsl(r, g, b);

         // 关键步骤：保持色相和饱和度，仅调整亮度
         const rgb = hslToRgb(h, s, colorKey.l);

         const newColor = new Color(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
         newColor.setOpacity(c.color.opacity);
         c = newColor;
       }
       ```

2. **直接设置颜色的透明度**
   - **透明度调整核心代码**
     ```javascript
     if (isValid(colorKey.a)) {
       c.setOpacity(colorKey.a);
     }
     ```

#### queryToken Token 语义化

```typescript
export function queryToken<T>(tokenMap: TokenMap, tokenKey: ITokenKey<T>): T | undefined {
  if (tokenMap && tokenKey.key in tokenMap) {
    return tokenMap[tokenKey.key];
  }
  return tokenKey.default;
}
```

这个函数用于根据 tokenMap 和 tokenKey 查询对应的 token 值，如果 tokenMap 中存在对应的 token，就返回对应的值，否则返回默认值。
