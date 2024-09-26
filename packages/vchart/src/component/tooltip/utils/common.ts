import { isArray, isFunction, isNil, isValid } from '@visactor/vutils';
import type {
  ITooltipLinePattern,
  ITooltipPattern,
  MaybeArray,
  TooltipActiveType,
  TooltipData,
  TooltipPatternProperty
} from '../../../typings';
import type { ISeriesTooltipSpec, ITooltipActiveTypeAsKeys, ITooltipSpec, TooltipHandlerParams } from '../interface';
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

export const isActiveTypeVisible = (type: TooltipActiveType, spec?: ISeriesTooltipSpec) => {
  if (!spec) {
    return true;
  }

  if (spec.visible === false) {
    return false;
  }

  if (spec[type] && spec[type].visible === false) {
    return false;
  }

  if (spec.activeType && (isArray(spec.activeType) ? !spec.activeType.includes(type) : spec.activeType !== type)) {
    return false;
  }

  return true;
};

export function isEmptyPos(params: BaseEventParams): boolean {
  return isNil(params.mark) && isNil(params.model) && isNil(params.datum);
}

function addContentLine(result: ITooltipPattern[], contentSpec: MaybeArray<ITooltipLinePattern>) {
  if (isArray(contentSpec)) {
    contentSpec.forEach(spec => {
      spec && result.push(spec as ITooltipLinePattern);
    });
  } else if (contentSpec) {
    result.push(contentSpec as ITooltipLinePattern);
  }
}

function parseContentFunction(
  result: ITooltipPattern[],
  contentSpec: TooltipPatternProperty<MaybeArray<ITooltipLinePattern>>,
  data?: TooltipData,
  params?: TooltipHandlerParams
) {
  if (isFunction(contentSpec)) {
    const specs = contentSpec(data, params);

    addContentLine(result, specs);
  } else if (contentSpec) {
    addContentLine(result, contentSpec);
  }
}

export function parseContent(
  contentSpec: MaybeArray<TooltipPatternProperty<MaybeArray<ITooltipLinePattern>>>,
  data?: TooltipData,
  params?: TooltipHandlerParams
) {
  const contents: ITooltipLinePattern[] = [];

  if (isArray(contentSpec)) {
    contentSpec.forEach(spec => {
      parseContentFunction(contents, spec, data, params);
    });
  } else if (isFunction(contentSpec)) {
    parseContentFunction(contents, contentSpec, data, params);
  } else if (contentSpec) {
    addContentLine(contents, contentSpec as MaybeArray<ITooltipLinePattern>);
  }

  return contents;
}

export function combinePattern(patternList: ITooltipPattern[]) {
  if (!patternList || !patternList.length) {
    return null;
  }

  // 拼接默认 tooltip content
  const defaultPatternContent: ITooltipLinePattern[] = [];
  patternList.forEach(({ content }) => {
    if (content) {
      (content as ITooltipLinePattern[]).forEach(c => {
        defaultPatternContent.push(c);
      });
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
