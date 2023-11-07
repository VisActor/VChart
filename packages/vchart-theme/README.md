# @visactor/vchart-theme

## Description

The extension themes for [VChart](https://github.com/VisActor/VChart).

The list of themes included here is as follows, with links to the theme JSON files:

<!-- ThemeListBegin -->
<!-- 以下为自动生成 -->
- [vScreenVolcanoBlue](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/vScreenVolcanoBlue.json) 火山蓝
- [vScreenClean](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/vScreenClean.json) 清新蜡笔
- [vScreenOutskirts](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/vScreenOutskirts.json) 郊外
- [vScreenBlueOrange](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/vScreenBlueOrange.json) 汽车蓝橙
- [vScreenFinanceYellow](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/vScreenFinanceYellow.json) 金融黄
- [vScreenWenLvCyan](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/vScreenWenLvCyan.json) 文旅青
- [vScreenElectricGreen](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/vScreenElectricGreen.json) 电力绿
- [vScreenECommercePurple](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/vScreenECommercePurple.json) 电商紫
- [vScreenRedBlue](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/vScreenRedBlue.json) 红蓝
- [vScreenPartyRed](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/vScreenPartyRed.json) 党建红
- [semiDesignLight](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/semiDesignLight.json) 
- [semiDesignDark](https://raw.githubusercontent.com/VisActor/VChart/develop/packages/vchart-theme/public/semiDesignDark.json) 
<!-- 以上为自动生成 -->
<!-- ThemeListEnd -->

## Usage

Import the full theme map and register them in sequence:

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

If you only use a specific theme, you can also obtain the specific theme JSON from this package and place it under your project for reference:

```typescript
import vScreenVolcanoBlue from 'xxx'; // your json path
import VChart from '@visactor/vchart';

// register the theme
VChart.ThemeManager.registerTheme('vScreenVolcanoBlue', vScreenVolcanoBlue);

// apply the theme
VChart.ThemeManager.setCurrentTheme('vScreenVolcanoBlue');
```

## Debug

Run the following command from any location in the project to start the dev server:

```
rush theme
```
