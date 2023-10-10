export * from './light';
export * from './common/legacy';
import type { ITheme } from '../interface';
export declare const builtinThemeMap: Map<string, ITheme>;
export declare const defaultThemeName: string;
export declare const themes: Map<string, ITheme>;
export declare const getMergedTheme: (theme: Partial<ITheme>) => ITheme;
