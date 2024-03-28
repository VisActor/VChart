import { isNil, isValid } from '@visactor/vutils';
import type { TooltipActiveType } from '../../../typings';
import type { ITooltipActiveTypeAsKeys, ITooltipSpec } from '../interface';
import type { BaseEventParams } from '../../../event/interface';

export const getTooltipActualActiveType = (spec?: ITooltipSpec): TooltipActiveType[] => {
  if (spec?.visible === false) {
    return [];
  }

  const activeTypeMap: ITooltipActiveTypeAsKeys<boolean, boolean, boolean> = {
    mark: spec?.mark?.visible !== false,
    dimension: spec?.dimension?.visible !== false,
    group: spec?.group?.visible !== false
  };

  if (isValid(spec?.activeType)) {
    Object.keys(activeTypeMap).forEach(t => {
      activeTypeMap[t] = spec?.activeType?.includes(t as TooltipActiveType);
    });
  }

  return Object.keys(activeTypeMap).filter(t => activeTypeMap[t]) as TooltipActiveType[];
};

export function isEmptyPos(params: BaseEventParams): boolean {
  return isNil(params.mark) && isNil(params.model) && isNil(params.datum);
}
