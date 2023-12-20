# VChart 扩展主题包

在默认主题的基础上，VChart 也封装了一系列开箱即用的扩展主题，以单独主题包的形式提供。这些主题默认没有内置在 VChart 里，而是支持用户按需使用，使用户可以通过更少的工作获得更美观宜人、更贴合使用场景的 VChart 图表。

此外，VChart 针对现有组件库也做了单独的主题包。这些包将在下文分别介绍。

## 扩展主题包 @visactor/vchart-theme

vchart-theme 包含了一些扩展主题，以 `ITheme` 对象或静态 json 资源的形式提供。

### DEMO

请访问 [codesandbox](https://vv67jn.csb.app/) 进行预览。

### 安装

[@visactor/vchart-theme](https://www.npmjs.com/package/@visactor/vchart-theme)

```bash
# npm
npm install @visactor/vchart-theme

# yarn
yarn add @visactor/vchart-theme
```

### 使用

注册 vchart-theme 中包含的主题并使用：

```typescript
import { allThemeMap } from '@visactor/vchart-theme';
import VChart from '@visactor/vchart';

// register themes
allThemeMap.forEach((theme, name) => {
  VChart.ThemeManager.registerTheme(name, theme);
});

// apply a theme
VChart.ThemeManager.setCurrentTheme('vScreenVolcanoBlue');
```

如果你只需要使用某个特定主题，还可以从该包中引用该主题的 JSON 文件：

```typescript
import vScreenVolcanoBlue from '@visactor/vchart-theme/public/vScreenVolcanoBlue.json';
import VChart from '@visactor/vchart';

// register the theme
VChart.ThemeManager.registerTheme('vScreenVolcanoBlue', vScreenVolcanoBlue);

// apply the theme
VChart.ThemeManager.setCurrentTheme('vScreenVolcanoBlue');
```

该包主要包含以下主题 json 资源：

- [vScreenVolcanoBlue](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-theme/public/vScreenVolcanoBlue.json) 大屏-火山蓝
- [vScreenClean](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-theme/public/vScreenClean.json) 大屏-清新蜡笔
- [vScreenOutskirts](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-theme/public/vScreenOutskirts.json) 大屏-郊外
- [vScreenBlueOrange](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-theme/public/vScreenBlueOrange.json) 大屏-汽车蓝橙
- [vScreenFinanceYellow](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-theme/public/vScreenFinanceYellow.json) 大屏-金融黄
- [vScreenWenLvCyan](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-theme/public/vScreenWenLvCyan.json) 大屏-文旅青
- [vScreenElectricGreen](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-theme/public/vScreenElectricGreen.json) 大屏-电力绿
- [vScreenECommercePurple](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-theme/public/vScreenECommercePurple.json) 大屏-电商紫
- [vScreenRedBlue](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-theme/public/vScreenRedBlue.json) 大屏-红蓝
- [vScreenPartyRed](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-theme/public/vScreenPartyRed.json) 大屏-党建红
