import type { BaseSpec } from './types';
import { colorblind, deep, viridis, cividis, RdBu_r } from './palettes';

/** 每次编译拥有独立数组，VChart 不会共享调用方或内置色板。 */
export function categoricalColors(spec: BaseSpec): string[] | undefined {
  const colors = spec.colors?.categorical ?? 'colorblind';
  if (colors === 'vchart') {
    return undefined;
  }
  return Array.isArray(colors) ? colors.slice() : (colors === 'deep' ? deep : colorblind).slice();
}

export function continuousColorScale(
  spec: BaseSpec,
  role: 'sequential' | 'diverging',
  id: string,
  min: number,
  max: number
) {
  const colors = spec.colors?.[role] ?? (role === 'sequential' ? 'viridis' : 'RdBu_r');
  const range = (Array.isArray(colors) ? colors : { viridis, cividis, RdBu_r }[colors]).slice();
  // 多停靠点色标的 domain 与 range 必须等长，确保图元、图例使用相同插值。
  const domain = range.map((_, i) => min + ((max - min) * i) / (range.length - 1));
  return { id, type: 'linear' as const, domain, range };
}
