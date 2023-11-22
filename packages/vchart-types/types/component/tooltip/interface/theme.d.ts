import type { RichTextWordBreak } from '@visactor/vrender-core';
import type { StringOrNumber, TextAlign, TextBaseLine } from '../../../typings';
import type { Padding } from '@visactor/vrender-components/es/core/type';
export interface ITooltipTextTheme<ColorType = string> {
    fontFamily?: string;
    fontSize?: number;
    fill?: ColorType;
    fontColor?: ColorType;
    fontWeight?: StringOrNumber;
    textAlign?: TextAlign;
    textBaseline?: TextBaseLine;
    lineHeight?: number | string;
    spacing?: number;
    multiLine?: boolean;
    maxWidth?: number;
    wordBreak?: RichTextWordBreak;
    autoWidth?: boolean;
}
export interface ITooltipTheme<ColorType = string> {
    panel?: {
        padding?: Padding;
        backgroundColor?: ColorType;
        border?: {
            color?: ColorType;
            width?: number;
            radius?: number;
        };
        shadow?: {
            x: number;
            y: number;
            blur: number;
            spread: number;
            color: ColorType;
        };
    };
    shape?: {
        size?: number;
        spacing?: number;
    };
    titleLabel?: ITooltipTextTheme<ColorType>;
    keyLabel?: Omit<ITooltipTextTheme<ColorType>, 'autoWidth'>;
    valueLabel?: ITooltipTextTheme<ColorType>;
    spaceRow?: number;
    offset?: {
        x?: number;
        y?: number;
    };
}
