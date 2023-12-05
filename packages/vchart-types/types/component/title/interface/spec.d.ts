import type { IComponent } from '../../interface';
import type { ITextGraphicAttribute, IRichTextCharacter, RichTextWordBreak } from '@visactor/vrender-core';
import type { IOrientType, IPadding, StringOrNumber } from '../../../typings';
import type { IComponentSpec } from '../../base/interface';
export interface ITitleSpec extends Omit<IComponentSpec, 'orient'> {
    visible?: boolean;
    orient?: IOrientType;
    text?: string | number | string[] | number[] | IRichTextCharacter[];
    textType?: string;
    subtext?: string | number | string[] | number[] | IRichTextCharacter[];
    subtextType?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    innerPadding?: IPadding | number | number[];
    align?: string;
    verticalAlign?: string;
    textStyle?: {
        width?: number;
        height?: number;
        align?: string;
        verticalAlign?: string;
        wordBreak?: RichTextWordBreak;
        maxLineWidth?: number;
        heightLimit?: number;
        lineClamp?: number;
        character?: IRichTextCharacter[];
    } & Partial<ITextGraphicAttribute>;
    subtextStyle?: {
        width?: number;
        height?: number;
        align?: string;
        verticalAlign?: string;
        wordBreak?: RichTextWordBreak;
        maxLineWidth?: number;
        heightLimit?: number;
        lineClamp?: number;
        character?: IRichTextCharacter[];
    } & Partial<ITextGraphicAttribute>;
}
export type Text = StringOrNumber;
export type ITitle = IComponent;
