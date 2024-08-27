import { isArray, isFunction, isNil, isValid } from '@visactor/vutils';
import type {
  ITooltipLinePattern,
  ITooltipPattern,
  MaybeArray,
  TooltipActiveType,
  TooltipPatternProperty
} from '../../../typings';
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
      activeTypeMap[t as TooltipActiveType] = spec?.activeType?.includes(t as TooltipActiveType);
    });
  }

  return Object.keys(activeTypeMap).filter(t => activeTypeMap[t as TooltipActiveType]) as TooltipActiveType[];
};

export const isActiveTypeVisible = (type: TooltipActiveType, spec?: ITooltipSpec) => {
  if (!spec) {
    return true;
  }

  if (spec.visible === false) {
    return false;
  }

  if (spec[type] && spec[type].visible === false) {
    return false;
  }

  if (spec.activeType && !spec.activeType.includes(type)) {
    return false;
  }

  return true;
};

export function isEmptyPos(params: BaseEventParams): boolean {
  return isNil(params.mark) && isNil(params.model) && isNil(params.datum);
}

export function combinePattern(patternList: ITooltipPattern[]) {
  if (!patternList || !patternList.length) {
    return null;
  }

  // 拼接默认 tooltip content
  const defaultPatternContent: Array<TooltipPatternProperty<MaybeArray<ITooltipLinePattern>>> = [];
  patternList.forEach(({ content }) => {
    if (isFunction(content)) {
      defaultPatternContent.push(content);
    } else if (isArray(content)) {
      content.forEach(c => {
        defaultPatternContent.push(c);
      });
    } else if (content) {
      defaultPatternContent.push(content);
    }
  });

  if (defaultPatternContent.length) {
    return {
      ...patternList[0],
      content: defaultPatternContent
    };
  }

  return patternList[0];
}
