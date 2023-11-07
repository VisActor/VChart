import { ITheme } from '@visactor/vchart-types';
import { vScreenThemeList } from './v-screen';
import { semiDesignLight } from './semi-design/light';
import { semiDesignDark } from './semi-design/dark';

export const allThemeMap = new Map([
  // 大屏主题
  ...([...vScreenThemeList].map(theme => [theme.name, theme]) as [string, ITheme][]),
  // semi design 主题
  [semiDesignLight.name, semiDesignLight],
  [semiDesignDark.name, semiDesignDark]
  // new theme here
]) as Map<string, ITheme>;
