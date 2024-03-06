import type {
  ITooltipLinePattern,
  ITooltipPattern,
  ITooltipShapePattern,
  MaybeArray,
  TooltipActiveType,
  TooltipPatternProperty
} from '../../../../typings';
import type { ISeries } from '../../../../series/interface';
import { mergeSpec } from '../../../../util/spec/merge-spec';
import { makeDefaultPattern } from './pattern';
import type { IDimensionInfo } from '../../../../event/events/dimension/interface';
import { memoize, isValid, array, isFunction, isNil, cloneDeep } from '@visactor/vutils';
import type { ITooltipSpec, ITooltipTheme } from '../../../../component/tooltip';
import { getTooltipActualActiveType } from '../../../../component/tooltip/utils';
import {
  addExtraInfoToTooltipContentPattern,
  addExtraInfoToTooltipTitlePattern
} from '../../../../series/base/tooltip-helper';

export const getTooltipSpecForShow = (
  activeType: TooltipActiveType,
  globalSpec: ITooltipSpec,
  series?: ISeries,
  dimensionInfo?: IDimensionInfo[]
): ITooltipSpec => {
  // 组装tooltip spec
  const finalSpec = {
    ...globalSpec,
    activeType
  } as ITooltipSpec;

  const { style = {} } = globalSpec;

  if (activeType === 'mark' && series) {
    // tooltip spec覆盖优先级: series spec > global spec > default pattern
    const seriesSpec = (series.tooltipHelper?.spec ?? {}) as ITooltipSpec;

    // visible
    if (isValid(seriesSpec.visible) || isValid(seriesSpec.activeType)) {
      finalSpec.visible = getTooltipActualActiveType(seriesSpec).includes('mark');
    } else if (isValid(globalSpec.visible) || isValid(globalSpec.activeType)) {
      finalSpec.visible = getTooltipActualActiveType(globalSpec).includes('mark');
    } else {
      finalSpec.visible = true;
    }

    // 优先使用自定义handler
    finalSpec.handler = seriesSpec.handler ?? globalSpec.handler ?? undefined;
    if (finalSpec.handler?.showTooltip) {
      return finalSpec;
    }
  } else if (activeType === 'dimension' && dimensionInfo?.length) {
    // tooltip spec覆盖优先级: series spec > global spec > default pattern
    const seriesList = getSeriesListFromDimensionInfo(dimensionInfo);

    // visible
    if (seriesList.every(series => !getTooltipActualActiveType(series.tooltipHelper?.spec).includes('dimension'))) {
      finalSpec.visible = false;
    } else if (isValid(globalSpec.visible) || isValid(globalSpec.activeType)) {
      finalSpec.visible = getTooltipActualActiveType(globalSpec).includes('dimension');
    } else {
      finalSpec.visible = true;
    }

    // 优先使用自定义handler
    finalSpec.handler = globalSpec.handler ?? undefined;
    if (finalSpec.handler?.showTooltip) {
      return finalSpec;
    }
  }

  // 默认的 pattern
  const defaultPattern = getDefaultTooltipPattern(activeType, series, dimensionInfo);
  // 来自系列的 pattern
  const seriesPattern = getSeriesTooltipPattern(activeType, series, dimensionInfo);
  // 来自用户配置的 pattern
  const userPattern: ITooltipPattern = mergeSpec({}, cloneDeep(globalSpec[activeType]), seriesPattern);

  // 对pattern进行组装
  // 组装 title
  const defaultPatternTitle = defaultPattern.title as ITooltipLinePattern | undefined;
  const titleShape: ITooltipShapePattern = getShapePattern(
    undefined,
    userPattern,
    style.shape,
    undefined,
    defaultPatternTitle
  );
  if (isValid(userPattern.title)) {
    userPattern.title = addExtraInfoToTooltipTitlePattern(userPattern.title, {
      ...defaultPatternTitle,
      ...titleShape // shape默认回调实现较复杂，如果用户没有配置则填补默认逻辑
    });
  } else {
    userPattern.title = addExtraInfoToTooltipTitlePattern(
      defaultPatternTitle,
      titleShape, // shape默认回调实现较复杂，如果用户没有配置则填补默认逻辑
      true
    );
  }

  // 组装 content
  const defaultPatternContent = array(defaultPattern.content) as ITooltipLinePattern[];
  if (isValid(userPattern.content)) {
    const shapePatternMap = getShapePatternMapOfEachSeries(defaultPatternContent);
    userPattern.content = addExtraInfoToTooltipContentPattern(
      userPattern.content,
      // shape默认回调实现较复杂，如果用户没有配置则填补默认逻辑
      userLine => getShapePattern(userLine, userPattern, style.shape, shapePatternMap)
    );
  } else {
    userPattern.content = addExtraInfoToTooltipContentPattern(
      defaultPatternContent,
      // shape默认回调实现较复杂，如果用户没有配置则填补默认逻辑
      line => getShapePattern(undefined, userPattern, style.shape, undefined, line),
      true
    );
  }

  finalSpec[activeType] = {
    ...defaultPattern,
    ...userPattern,
    activeType
  };

  return finalSpec;
};

/** 获取默认 tooltip pattern */
const getDefaultTooltipPattern = (
  activeType: TooltipActiveType,
  series?: ISeries,
  dimensionInfo?: IDimensionInfo[]
): ITooltipPattern => {
  // 默认的pattern
  let defaultPattern = {} as ITooltipPattern;
  if (activeType === 'mark' && series) {
    // mark tooltip
    defaultPattern = makeDefaultPattern(series, 'mark') ?? {};
  } else if (activeType === 'dimension' && dimensionInfo?.length) {
    // dimension tooltip
    const patternList: ITooltipPattern[] = [];
    dimensionInfo.forEach(({ data }) =>
      data.forEach(data => {
        const { series } = data;
        const mockDimensionInfo = [
          {
            ...dimensionInfo[0],
            data: [data]
          }
        ] as IDimensionInfo[];
        const pattern = makeDefaultPattern(series, 'dimension', mockDimensionInfo);
        if (pattern) {
          patternList.push(pattern);
        }
      })
    );
    // 拼接默认 tooltip content
    const defaultPatternContent: Array<TooltipPatternProperty<MaybeArray<ITooltipLinePattern>>> = [];
    patternList.forEach(({ content }) => {
      if (isFunction(content)) {
        defaultPatternContent.push(content);
      } else {
        defaultPatternContent.push(...array(content));
      }
    });
    defaultPattern = {
      ...patternList[0],
      content: defaultPatternContent
    };
  }
  return defaultPattern;
};

/** 获取来自系列 spec 的 tooltip pattern */
const getSeriesTooltipPattern = (
  activeType: TooltipActiveType,
  series?: ISeries,
  dimensionInfo?: IDimensionInfo[]
): ITooltipPattern => {
  // 默认的pattern
  let seriesPattern = {} as ITooltipPattern;
  if (activeType === 'mark' && series) {
    // mark tooltip
    const seriesSpec = (series.tooltipHelper?.spec ?? {}) as ITooltipSpec;
    seriesPattern = seriesSpec.mark ? cloneDeep(seriesSpec.mark) : {};
  } else if (activeType === 'dimension' && dimensionInfo?.length) {
    // dimension tooltip
    const seriesList = getSeriesListFromDimensionInfo(dimensionInfo);
    const seriesPatternList = seriesList
      .filter(series => {
        const spec = series.tooltipHelper?.spec;
        return isValid(spec?.dimension) && getTooltipActualActiveType(spec).includes('dimension');
      })
      .map(series => series.tooltipHelper.spec.dimension);
    if (seriesPatternList.length) {
      // 拼接系列 tooltip content
      let seriesPatternContent: Array<TooltipPatternProperty<MaybeArray<ITooltipLinePattern>>> | undefined = [];
      if (seriesPatternList.every(({ content }) => isNil(content))) {
        seriesPatternContent = undefined;
      } else {
        seriesPatternList.forEach(({ content }) => {
          if (isNil(content)) {
            return;
          }
          if (isFunction(content)) {
            seriesPatternContent?.push(content);
          } else {
            seriesPatternContent?.push(...array(content));
          }
        });
      }
      seriesPattern = {
        ...seriesPatternList[0],
        content: seriesPatternContent
      };
    }
  }
  return seriesPattern;
};

const getSeriesListFromDimensionInfo = memoize((dimensionInfo: IDimensionInfo[]): ISeries[] => {
  return dimensionInfo.reduce(
    (list, cur) => list.concat(cur.data.map(data => data.series).filter(isValid)),
    [] as ISeries[]
  );
});

/** 获取每个系列对应的 shape pattern */
const getShapePatternMapOfEachSeries = (content: ITooltipLinePattern[]): Record<number, ITooltipShapePattern> => {
  const shapePatternMap: Record<number, ITooltipShapePattern> = {};
  content.forEach(line => {
    const key = line.seriesId ?? 0;
    if (!shapePatternMap[key]) {
      shapePatternMap[key] = line;
    }
  });
  return shapePatternMap;
};

/** 根据优先级获取形状配置 */
const getShapePattern = (
  userLinePattern?: ITooltipLinePattern,
  userPattern?: ITooltipPattern,
  userStyle?: ITooltipTheme['shape'],
  shapePatternMap?: Record<number, ITooltipShapePattern>,
  defaultShapePattern?: ITooltipShapePattern
): ITooltipShapePattern => {
  if (userStyle) {
    userStyle.shapeSize = userStyle.shapeSize ?? userStyle.size; // 兼容旧配置
  }
  const shapePatternFromMap = shapePatternMap?.[userLinePattern?.seriesId ?? 0] ?? shapePatternMap?.[0];

  const maps = [userLinePattern, userPattern, userStyle, shapePatternFromMap, defaultShapePattern].filter(isValid);

  const shapeKeys: Set<keyof ITooltipShapePattern> = new Set(
    maps
      .reduce((keys, cur) => keys.concat(Object.keys(cur)), [] as string[])
      .filter(key => key.toLowerCase().includes('shape')) as any[]
  );

  const shapePattern: ITooltipShapePattern = {};
  shapeKeys.forEach(key => {
    let value;
    let i = 0;
    do {
      value = maps[i++][key];
    } while (i < maps.length && isNil(value));
    if (value !== undefined) {
      shapePattern[key as any] = value;
    }
  });
  return shapePattern;
};
