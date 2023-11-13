import type { IPercent } from '../../model/interface';
import type { ConvertToMarkStyleSpec, ITextMarkSpec } from '../../typings/visual';
import type { IComponentSpec } from '../base/interface';
import type { IComponent } from '../interface';
export interface IIndicatorItemSpec {
    visible?: boolean;
    field?: string;
    space?: number;
    autoLimit?: boolean;
    autoFit?: boolean;
    fitPercent?: number;
    style?: Omit<ConvertToMarkStyleSpec<ITextMarkSpec>, 'visible'>;
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
