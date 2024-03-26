import type { IPathMarkSpec, ITextMarkSpec } from '../../typings/visual';
import type { IMarkSpec, IMarkTheme, ISeriesSpec } from '../../typings/spec/common';
import type { IAnimationSpec } from '../../animation/spec';
import { ILabelSpec } from '../../component';
type LineMarks = 'area';
export interface IMapSeriesSpec extends ISeriesSpec, IAnimationSpec<LineMarks, 'fadeIn'> {
    type: 'map';
    map: string;
    nameField?: string;
    valueField?: string;
    nameProperty?: string;
    centroidProperty?: string;
    nameMap?: {
        [key: string]: string;
    };
    area?: IMarkSpec<Omit<IPathMarkSpec, 'smoothScale'>>;
    defaultFillColor?: string;
    showDefaultName?: boolean;
    label?: Omit<ILabelSpec, 'position'>;
}
export interface IMapSeriesTheme {
    defaultFillColor?: string;
    label?: Partial<IMarkTheme<ITextMarkSpec> & {
        offset?: number;
        position?: string;
    }>;
    area?: Partial<IMarkTheme<Omit<IPathMarkSpec, 'smoothScale'>>>;
}
export {};
