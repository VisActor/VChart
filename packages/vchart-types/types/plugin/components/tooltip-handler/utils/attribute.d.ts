import type { TooltipAttributes, TooltipPanelAttrs } from '@visactor/vrender-components';
import type { IToolTipActual } from '../../../../typings';
import type { ITooltipTextStyle } from '../interface';
import type { ITheme } from '../../../../theme';
import type { ITooltipSpec, ITooltipTextTheme, ITooltipTheme } from '../../../../component/tooltip';
export declare function getTextAttributes(style?: ITooltipTextTheme, globalTheme?: ITheme, defaultAttributes?: Partial<ITooltipTextStyle>): ITooltipTextStyle;
export declare const getPanelAttributes: (style: ITooltipTheme['panel']) => TooltipPanelAttrs;
export declare const getTooltipAttributes: (actualTooltip: IToolTipActual, spec: ITooltipSpec, globalTheme: ITheme) => TooltipAttributes;
