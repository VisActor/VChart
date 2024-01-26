import type { IPercent } from '../../typings/layout';
import type { ConvertToMarkStyleSpec, ITextMarkSpec } from '../../typings/visual';
import type { IComponentSpec } from '../base/interface';
import type { IComponent } from '../interface';
import type { IRichTextCharacter } from '@visactor/vrender-core';
export interface IIndicatorItemSpec {
    visible?: boolean;
    field?: string;
    space?: number;
    autoLimit?: boolean;
    autoFit?: boolean;
    fitPercent?: number;
    fitStrategy?: 'default' | 'inscribed';
    style?: Omit<ConvertToMarkStyleSpec<ITextMarkSpec>, 'visible' | 'text'> & {
        type?: 'text' | 'rich' | 'html';
        text?: string | string[] | number | number[] | IRichTextCharacter[];
    };
}
export type IIndicator = IComponent;
export interface IIndicatorSpec extends IComponentSpec {
    visible?: boolean;
    fixed?: boolean;
    trigger?: 'hover' | 'select' | 'none';
    gap?: number;
    offsetX?: number | IPercent;
    offsetY?: number | IPercent;
    limitRatio?: number;
    title?: IIndicatorItemSpec;
    content?: IIndicatorItemSpec[] | IIndicatorItemSpec;
}
export interface IIndicatorItemTheme extends IIndicatorItemSpec {
    style?: Omit<ITextMarkSpec, 'visible'>;
}
export interface IIndicatorTheme extends IIndicatorSpec {
    title?: IIndicatorItemTheme;
    content?: IIndicatorItemTheme;
}
