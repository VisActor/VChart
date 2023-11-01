import type { ILayoutItemSpec } from '../../../model/interface';
import type { IColorKey } from '../../../theme/color-scheme/interface';
import type { StringOrNumber } from '../../../typings';
import type { TextAlign, TextBaseLine } from '../../../typings/visual';
export interface ITitleTextTheme {
    width?: number;
    height?: number;
    fontFamily?: string;
    fontSize?: number;
    fill?: string | IColorKey;
    fontWeight?: StringOrNumber;
    textAlign?: TextAlign;
    textBaseline?: TextBaseLine;
    lineHeight?: number;
}
export interface ITitleTheme extends ILayoutItemSpec {
    textStyle?: ITitleTextTheme;
    subtextStyle?: ITitleTextTheme;
}
