import type { IComponent } from '../../interface';
import type { ITextGraphicAttribute, IRichTextCharacter, ITextAttribute } from '@visactor/vrender-core';
import type { ILayoutNumber, IOrientType, IPadding } from '../../../typings';
import type { IComponentSpec } from '../../base/interface';
interface ITitleSpecWithoutText extends Omit<IComponentSpec, 'orient'> {
    visible?: boolean;
    orient?: IOrientType;
    x?: number;
    y?: number;
    width?: ILayoutNumber;
    height?: ILayoutNumber;
    minWidth?: ILayoutNumber;
    maxWidth?: ILayoutNumber;
    minHeight?: ILayoutNumber;
    maxHeight?: ILayoutNumber;
    innerPadding?: IPadding | number | number[];
    align?: string;
    verticalAlign?: string;
    textStyle?: {
        width?: number;
        height?: number;
        align?: string;
        verticalAlign?: string;
        wordBreak?: ITextAttribute['wordBreak'];
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
        wordBreak?: ITextAttribute['wordBreak'];
        maxLineWidth?: number;
        heightLimit?: number;
        lineClamp?: number;
        character?: IRichTextCharacter[];
    } & Partial<ITextGraphicAttribute>;
}
export type ITitleTextSpec = {
    textType?: 'text';
    text?: string | number | string[] | number[];
} | {
    textType: 'rich';
    text?: IRichTextCharacter[];
};
export type ISubTitleTextSpec = {
    subtextType?: 'text';
    subtext?: string | number | string[] | number[];
} | {
    subtextType?: 'rich';
    subtext?: IRichTextCharacter[];
};
export type ITitleSpec = ITitleSpecWithoutText & ITitleTextSpec & ISubTitleTextSpec;
export type ITitle = IComponent;
export {};
