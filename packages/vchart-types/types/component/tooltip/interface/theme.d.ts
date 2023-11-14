import type { RichTextWordBreak } from '@visactor/vrender-core';
import type { StringOrNumber, TextAlign, TextBaseLine } from '../../../typings';
import type { IColorKey } from '../../../theme/color-scheme/interface';
import type { Padding } from '@visactor/vrender-components/es/core/type';
export interface ITooltipTextTheme {
    fontFamily?: string;
    fontSize?: number;
    fill?: string | IColorKey;
    fontColor?: string | IColorKey;
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
export interface ITooltipTheme {
    panel?: {
        padding?: Padding;
        backgroundColor?: string | IColorKey;
        border?: {
            color?: string | IColorKey;
            width?: number;
            radius?: number;
        };
        shadow?: {
            x: number;
            y: number;
            blur: number;
            spread: number;
            color: string | IColorKey;
        };
    };
    shape?: {
        size?: number;
        spacing?: number;
    };
    titleLabel?: ITooltipTextTheme;
    keyLabel?: Omit<ITooltipTextTheme, 'autoWidth'>;
    valueLabel?: ITooltipTextTheme;
    spaceRow?: number;
    offset?: {
        x?: number;
        y?: number;
    };
}
