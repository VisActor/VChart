import { ThemeManager, queryColorFromColorScheme } from '@visactor/vchart';
import type { BuiltinColorPalette } from '@visactor/vchart';
import type { BaseSpec } from './types';

/** 只读取 VChart 原生主题的语义颜色，不创建或注册额外主题。 */
export function paletteColor(mode: BaseSpec['theme'], key: keyof BuiltinColorPalette & string): string {
  return queryColorFromColorScheme(ThemeManager.getTheme(mode ?? 'light')!.colorScheme!, {
    type: 'palette',
    key
  }) as string;
}
