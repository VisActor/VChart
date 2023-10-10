import { type SeriesTypeEnum } from '../../series/interface';
import type { IThemeColorScheme } from '../../theme/color-scheme/interface';
export declare function preprocessSpecOrTheme(
  type: 'spec' | 'theme' | 'mark-spec' | 'mark-theme',
  obj: any,
  colorScheme?: IThemeColorScheme,
  seriesType?: SeriesTypeEnum
): any;
