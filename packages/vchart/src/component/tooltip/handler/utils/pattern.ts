import type { IDimensionInfo } from '../../../../event/events/dimension/interface';
import type { ISeries } from '../../../../series/interface';
import type { ITooltipPattern, TooltipActiveType } from '../../../../typings';

/**
 * 根据图表上下文生成默认的tooltip pattern
 * @param activeType
 * @param series
 * @param dimensionInfo
 * @returns
 */
export const makeDefaultPattern = (
  series: ISeries,
  activeType: TooltipActiveType,
  dimensionInfo?: IDimensionInfo[]
): ITooltipPattern | null => {
  return series.tooltipHelper?.getDefaultTooltipPattern(activeType, dimensionInfo) ?? null;
};
