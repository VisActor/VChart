import { vScreenColorScheme } from './color-scheme-map';
import { getVScreenCommonTheme } from './common';

export const vScreenThemeList = Object.keys(vScreenColorScheme).map(name =>
  getVScreenCommonTheme(
    `vScreen${name[0].toUpperCase()}${name.slice(1)}`,
    vScreenColorScheme[name].name,
    vScreenColorScheme[name].colors
  )
);
