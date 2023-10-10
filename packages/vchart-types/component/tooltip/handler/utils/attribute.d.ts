import type { TooltipAttributes } from '@visactor/vrender-components';
import type { IToolTipActual, MaybeArray } from '../../../../typings';
import type { ITooltipStyle, ITooltipTextStyle } from '../interface';
export declare const getTooltipAttributes: (
  actualTooltip: IToolTipActual,
  style: Partial<ITooltipStyle>
) => TooltipAttributes;
interface ITooltipTextInfo {
  width: number;
  height: number;
  text: MaybeArray<number> | MaybeArray<string>;
}
export declare const measureTooltipText: (text: string, style: ITooltipTextStyle) => ITooltipTextInfo;
export {};
