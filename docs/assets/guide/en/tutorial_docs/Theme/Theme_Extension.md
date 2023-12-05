# VChart 扩展主题包

The English version is working in progress.

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

## Semi Design 主题包 @visactor/vchart-semi-theme

VChart 是适合与 [Semi Design](https://github.com/DouyinFE/semi-design) 搭配使用的图表库。为了使 VChart 在 Semi 页面环境中获得更好的体验，我们推出了 vchart-semi-theme 包。这个包有以下特性：

- 开箱即用：经过简单的配置，就可以使 VChart 样式自动融入 Semi 设计语言，也会自动适配用户通过 Semi DSM 自定义的主题包。
- 响应式：vchart-semi-theme 支持监听页面上的亮暗模式变化以及主题切换，自动对页面上的 VChart 图表的主题进行热更新。

### DEMO

请访问 [codesandbox](https://vp4y9p.csb.app/) 进行预览。

### 安装

[@visactor/vchart-semi-theme](https://www.npmjs.com/package/@visactor/vchart-semi-theme)

```bash
# npm
npm install @visactor/vchart-semi-theme

# yarn
yarn add @visactor/vchart-semi-theme
```

### 使用

实现默认的功能，只需要在全局执行一次 `initVChartSemiTheme` 方法进行初始化。这个语句通常可以放在 react 项目的入口文件中。如以下示例：

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.jsx';
import { initVChartSemiTheme } from '@visactor/vchart-semi-theme';

// initialization
initVChartSemiTheme();

const dom = document.querySelector('#root');
const root = createRoot(dom);
root.render(<App />);
```

`initVChartSemiTheme` 方法支持传入一个对象作为 option，其类型声明为：

```typescript
interface IInitVChartSemiThemeOption {
  /** 初始亮暗色模式 */
  defaultMode?: 'light' | 'dark';
  /** 是否监听亮暗色模式自动更改图表主题，默认为 true */
  isWatchingMode?: boolean;
  /** 是否监听主题变化自动更改图表主题，默认为 false（适用于 semi 官方主题切换接口：https://semi.design/dsm/install_switcher）*/
  isWatchingThemeSwitch?: boolean;
}
```

例如，如果要开启监听用户侧的主题切换，初始化语句可以改为这样：

```javascript
// initialization
initVChartSemiTheme({
  isWatchingThemeSwitch: true
});
```

该包同时包含两个静态的主题 json 资源（静态资源只适用于默认的 Semi 主题），可以按需使用。

- [semiDesignLight](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-semi-theme/public/semiDesignLight.json) Semi Design - light
- [semiDesignDark](https://raw.githubusercontent.com/VisActor/vchart-theme/main/packages/vchart-semi-theme/public/semiDesignDark.json) Semi Design - dark
