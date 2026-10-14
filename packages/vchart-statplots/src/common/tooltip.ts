import type { ITooltipSpec, Datum } from '@visactor/vchart';

/** 只格式化语义数据；不在 hover 时执行统计计算。 */
export function semanticTooltip(
  fields: readonly string[],
  labels: Record<string, string | undefined> = {},
  activeType: 'mark' | 'dimension' = 'mark'
): ITooltipSpec {
  return {
    activeType: [activeType],
    [activeType]: {
      title: { value: (datum?: Datum) => String(datum?.series ?? datum?.category ?? '') },
      content: fields.map(field => ({
        key: labels[field] ?? (field === '__crowded' ? '拥挤重叠' : field),
        value: (datum?: Datum) => {
          const value = datum?.[field];
          return value === null ? '不可计算' : value === undefined ? '—' : String(value);
        }
      }))
    }
  };
}
