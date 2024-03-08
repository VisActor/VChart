import type { ITheme } from '../../theme';
import { type IOrientType } from '../../typings';
import type { ComponentThemeWithDirection } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
export declare function getComponentThemeFromGlobalTheme(type: ComponentTypeEnum, chartTheme: ITheme, componentSpec: any, chartSpec: any): any;
export declare const getComponentThemeWithDirection: <T>(componentSpec: {
    orient?: IOrientType;
}, originalTheme: ComponentThemeWithDirection<T>) => T;
