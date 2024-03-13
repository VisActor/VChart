import type { TooltipPanelAttrs } from '@visactor/vrender-components';
import type { ITooltipActual } from '../../../../typings';
import type { ITooltipAttributes, ITooltipTextStyle } from '../interface';
import type { ITheme } from '../../../../theme';
import type { ITooltipSpec, ITooltipTextTheme, ITooltipTheme } from '../../../../component/tooltip';
export declare function getTextAttributes(style?: ITooltipTextTheme, globalTheme?: ITheme, defaultAttributes?: Partial<ITooltipTextStyle>): ITooltipTextStyle;
export declare const getPanelAttributes: (style: ITooltipTheme['panel']) => TooltipPanelAttrs;
export declare const getTooltipAttributes: (actualTooltip: ITooltipActual, spec: ITooltipSpec, globalTheme: ITheme) => ITooltipAttributes;
