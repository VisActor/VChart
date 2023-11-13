import type { IModelOption } from '../model/interface';
import type { ComponentTypeEnum } from './interface';
import type { IComponentTheme } from './interface/theme';
export declare function getComponentThemeFromOption(type: keyof IComponentTheme | ComponentTypeEnum, option: Partial<IModelOption>): any;
