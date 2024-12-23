import type { BaseLabelAttrs } from '@visactor/vrender-components';
import type { ConvertToMarkStyleSpec, Datum, IComposedTextMarkSpec, IFormatMethod, ITextMarkSpec } from '../../typings';
import type { IComponentSpec } from '../base/interface';
import type { ILabelMark } from '../../mark/interface';
import type { ISeries } from '../../series/interface';
import type { ICompilableMark } from '../../compile/mark/interface';
import type { IRegion } from '../../region/interface';
export interface ILabelInfo {
    baseMark: ICompilableMark;
    labelMark: ILabelMark;
    series: ISeries;
    labelSpec: TransformedLabelSpec;
}
export interface ILabelComponentContext {
    region: IRegion;
    labelInfo: ILabelInfo[];
}
export interface ILabelFormatMethodContext {
    series?: ISeries;
}
export interface ILabelSpec extends IComponentSpec, ILabelAnimationSpec {
    visible?: boolean;
    interactive?: boolean;
    textType?: 'text' | 'rich';
    formatMethod?: IFormatMethod<[text: string | string[], datum?: Datum, ctx?: ILabelFormatMethodContext]>;
    formatter?: string | string[];
    offset?: number;
    position?: string;
    style?: ConvertToMarkStyleSpec<IComposedTextMarkSpec>;
    state?: LabelStateStyle<Partial<IComposedTextMarkSpec>>;
    overlap?: BaseLabelAttrs['overlap'];
    smartInvert?: BaseLabelAttrs['smartInvert'];
    stackDataFilterType?: 'min' | 'max';
    dataFilter?: BaseLabelAttrs['dataFilter'];
    customLayoutFunc?: BaseLabelAttrs['customLayoutFunc'];
    customOverlapFunc?: BaseLabelAttrs['customOverlapFunc'];
    labelLayout?: 'series' | 'region';
    support3d?: boolean;
    syncState?: boolean;
}
export type ILabelAnimationSpec = Pick<BaseLabelAttrs, 'animation' | 'animationEnter' | 'animationUpdate' | 'animationExit'>;
export type IMultiLabelSpec<T extends Omit<ILabelSpec, 'position'>> = T | T[];
type LabelStateStyle<T> = {
    hover?: T;
    hover_reverse?: T;
    selected?: T;
    selected_reverse?: T;
};
export type ITotalLabelSpec = Pick<ILabelSpec, 'visible' | 'formatMethod' | 'interactive' | 'offset' | 'style' | 'state' | 'textType' | 'overlap'>;
export interface ITotalLabelTheme extends Pick<ILabelSpec, 'visible' | 'interactive' | 'offset' | 'overlap' | 'smartInvert' | 'animation'> {
    style?: ITextMarkSpec;
}
export type TransformedLabelSpec = ILabelSpec & {
    getStyleHandler: (series: ISeries) => (mark?: ILabelMark, spec?: any) => void;
};
export {};
