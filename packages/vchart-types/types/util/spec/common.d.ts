import { DataView } from '@visactor/vdataset';
import type { ITheme } from '../../theme';
export declare function isDataView(obj: any): obj is DataView;
export declare function isHTMLElement(obj: any): obj is Element;
export declare function getThemeObject(theme?: string | ITheme, transformed?: boolean): ITheme;
