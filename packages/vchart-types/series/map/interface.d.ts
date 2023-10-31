import type { IPathMarkSpec, ITextMarkSpec } from '../../typings/visual';
import type { IMarkSpec, IMarkTheme, ISeriesSpec } from '../../typings/spec/common';
import type { IAnimationSpec } from '../../animation/spec';
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
  label?: IMarkSpec<ITextMarkSpec> & {
    offset?: number;
    position?: string;
    formatMethod?: (text: string | string[], datum?: any) => string | string[];
  };
}
export interface IMapSeriesTheme {
  defaultFillColor?: string;
  label?: Partial<
    IMarkTheme<ITextMarkSpec> & {
      offset?: number;
      position?: string;
    }
  >;
  area?: Partial<IMarkTheme<Omit<IPathMarkSpec, 'smoothScale'>>>;
}
export {};
