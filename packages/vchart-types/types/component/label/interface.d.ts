import type { BaseLabelAttrs } from '@visactor/vrender-components';
import type { ConvertToMarkStyleSpec, Datum, IComposedTextMarkSpec, IFormatMethod, ITextMarkSpec } from '../../typings';
import type { IComponentSpec } from '../base/interface';
import type { ILabelMark } from '../../mark/label';
import type { ISeries } from '../../series';
export interface ILabelFormatMethodContext {
    series?: ISeries;
}
export interface ILabelSpec extends IComponentSpec {
    visible?: boolean;
    interactive?: boolean;
    textType?: 'text' | 'rich';
    formatMethod?: IFormatMethod<[text: string | string[], datum?: Datum, ctx?: ILabelFormatMethodContext]>;
    formatter?: string;
    offset?: number;
    position?: string;
    style?: ConvertToMarkStyleSpec<IComposedTextMarkSpec>;
    state?: LabelStateStyle<Partial<IComposedTextMarkSpec>>;
    overlap?: BaseLabelAttrs['overlap'];
    smartInvert?: BaseLabelAttrs['smartInvert'];
    animation?: BaseLabelAttrs['animation'];
    dataFilter?: BaseLabelAttrs['dataFilter'];
    customLayoutFunc?: BaseLabelAttrs['customLayoutFunc'];
    customOverlapFunc?: BaseLabelAttrs['customOverlapFunc'];
    labelLayout?: 'series' | 'region';
    support3d?: boolean;
    syncState?: boolean;
}
export type IMultiLabelSpec<T extends Omit<ILabelSpec, 'position'>> = T | T[];
type LabelStateStyle<T> = {
    hover?: T;
    hover_reverse?: T;
    selected?: T;
    selected_reverse?: T;
};
export type ITotalLabelSpec = Pick<ILabelSpec, 'visible' | 'formatMethod' | 'interactive' | 'offset' | 'style' | 'state' | 'textType'>;
export interface ITotalLabelTheme extends Pick<ILabelSpec, 'visible' | 'interactive' | 'offset' | 'overlap' | 'smartInvert' | 'animation'> {
    style?: ITextMarkSpec;
}
export type TransformedLabelSpec = ILabelSpec & {
    getStyleHandler: (series: ISeries) => (mark?: ILabelMark, spec?: any) => void;
};
export {};
