import type { IThemeColorScheme } from '../../theme/color-scheme/interface';
import type { ISeriesSpec } from '../../typings';
export declare function preprocessSpecOrTheme(type: 'spec' | 'theme' | 'mark-spec' | 'mark-theme', obj: any, colorScheme?: IThemeColorScheme, seriesSpec?: ISeriesSpec): any;
