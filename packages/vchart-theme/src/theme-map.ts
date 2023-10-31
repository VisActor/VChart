import { ITheme } from '@visactor/vchart-types';
import { vScreenThemeList } from './v-screen';

export const allThemeMap = new Map([
  // 大屏主题
  ...([...vScreenThemeList].map(theme => [theme.name, theme]) as [string, ITheme][])
  // new theme here
]) as Map<string, ITheme>;
