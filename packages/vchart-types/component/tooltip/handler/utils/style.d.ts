import type { ITheme } from '../../../../theme';
import type { ITooltipTextTheme } from '../../interface';
import type { ITooltipTextStyle } from '../interface';
export declare function getTextAttributes(
  style?: ITooltipTextTheme,
  globalTheme?: ITheme,
  defaultAttributes?: Partial<ITooltipTextStyle>
): ITooltipTextStyle;
