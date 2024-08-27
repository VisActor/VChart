import type { ITooltipLinePattern, ITooltipPattern, ITooltipShapePattern, TooltipActiveType } from '../../../typings';
import type { ISeries } from '../../../series/interface';
import { mergeSpec } from '@visactor/vutils-extension';
import type { IDimensionInfo } from '../../../event/events/dimension/interface';
import { isValid, array, isNil, cloneDeep, isFunction } from '@visactor/vutils';
import type { ITooltipSpec, ITooltipTheme } from '..';
import { combinePattern, isActiveTypeVisible } from './common';

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

  switch (activeType) {
    case 'mark':
    case 'group':
      if (series) {
        // tooltip spec覆盖优先级: series spec > global spec > default pattern
        const seriesSpec = series.getSpec()?.tooltip as ITooltipSpec;
        finalSpec.visible = true;

        // 优先使用自定义handler
        finalSpec.handler = seriesSpec?.handler ?? globalSpec.handler;
        if (finalSpec.handler?.showTooltip) {
          return finalSpec;
        }
      }
      break;
    case 'dimension':
      if (dimensionInfo?.length) {
        // tooltip spec覆盖优先级: series spec > global spec > default pattern
        const seriesList = getSeriesListFromDimensionInfo(dimensionInfo);

        // visible
        if (seriesList.every(series => !isActiveTypeVisible('dimension', series.getSpec()?.tooltip))) {
          finalSpec.visible = false;
        } else {
          finalSpec.visible = true;
        }

        // 优先使用自定义handler
        finalSpec.handler = globalSpec.handler ?? undefined;
        if (finalSpec.handler?.showTooltip) {
          return finalSpec;
        }
      }
      break;
  }

  // 默认的 pattern
  const defaultPattern = getDefaultTooltipPattern(activeType, series, dimensionInfo) ?? {};
  // 来自系列的 pattern
  const seriesPattern = getSeriesTooltipPattern(activeType, series, dimensionInfo);
  // 来自用户配置的 pattern
  const userPattern: ITooltipPattern =
    globalSpec[activeType] || seriesPattern
      ? mergeSpec(
          {},
          addSeriesInfo(
            globalSpec[activeType],
            activeType === 'dimension' ? getSeriesListFromDimensionInfo(dimensionInfo) : [series]
          ),
          seriesPattern
        )
      : null;

  if (userPattern) {
    // 对pattern进行组装
    // 组装 title
    const defaultPatternTitle = defaultPattern.title as ITooltipLinePattern | undefined;
    const defaultTitleShape: ITooltipShapePattern = getShapePattern(
      undefined,
      userPattern,
      style.shape,
      undefined,
      defaultPatternTitle
    );
    if (isValid(userPattern.title)) {
      userPattern.title = addExtraInfoToTooltipTitlePattern(userPattern.title, {
        ...defaultPatternTitle,
        ...defaultTitleShape // shape默认回调实现较复杂，如果用户没有配置则填补默认逻辑
      });
    } else {
      userPattern.title = addExtraInfoToTooltipTitlePattern(
        defaultPatternTitle,
        defaultTitleShape, // shape默认回调实现较复杂，如果用户没有配置则填补默认逻辑
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
  switch (activeType) {
    case 'mark':
    case 'group':
      if (series) {
        return series.tooltipHelper.getDefaultTooltipPattern(activeType);
      }
      break;
    case 'dimension':
      if (dimensionInfo?.length) {
        const patternList: ITooltipPattern[] = [];
        dimensionInfo.forEach(info =>
          info.data.forEach(datum => {
            const { series } = datum;
            const mockDimensionInfo = [
              {
                ...info,
                data: [datum]
              }
            ] as IDimensionInfo[];
            const pattern = series.tooltipHelper.getDefaultTooltipPattern(activeType, mockDimensionInfo);
            if (pattern) {
              patternList.push(pattern);
            }
          })
        );
        return combinePattern(patternList);
      }
      break;
  }
  return undefined;
};

/** 获取来自系列 spec 的 tooltip pattern */
const getSeriesTooltipPattern = (
  activeType: TooltipActiveType,
  series?: ISeries,
  dimensionInfo?: IDimensionInfo[]
): ITooltipPattern => {
  switch (activeType) {
    case 'mark':
    case 'group':
      if (series) {
        const seriesSpec = series.tooltipHelper?.spec as ITooltipSpec;
        return seriesSpec && seriesSpec[activeType] ? cloneDeep(seriesSpec[activeType]) : undefined;
      }
      break;
    case 'dimension':
      if (dimensionInfo?.length) {
        // dimension tooltip
        const seriesList = getSeriesListFromDimensionInfo(dimensionInfo);

        const seriesPatternList: ITooltipPattern[] = [];

        seriesList.forEach(series => {
          const spec = series.tooltipHelper?.spec;

          if (isActiveTypeVisible(activeType, spec) && spec?.dimension) {
            seriesPatternList.push(spec.dimension);
          }
        });

        return combinePattern(seriesPatternList);
      }
      break;
  }
  return undefined;
};

const getSeriesListFromDimensionInfo = (dimensionInfo: IDimensionInfo[]): ISeries[] => {
  const list: ISeries[] = [];
  dimensionInfo.forEach(info => {
    info.data.forEach(datum => {
      if (isValid(datum.series)) {
        list.push(datum.series);
      }
    });
  });

  return list;
};

/** 获取每个系列对应的 shape pattern */
const getShapePatternMapOfEachSeries = (content: ITooltipLinePattern[]): Record<number, ITooltipShapePattern> => {
  const shapePatternMap: Record<number, ITooltipShapePattern> = {};

  content.forEach(line => {
    const key = line.seriesId;

    if (isValid(key) && !shapePatternMap[key]) {
      shapePatternMap[key] = line;
    }

    if (!shapePatternMap[-1]) {
      shapePatternMap[-1] = line;
    }
  });
  return shapePatternMap;
};

const isShapeKey = (key: string) => key.toLowerCase().includes('shape');

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
  const shapePatternFromMap = shapePatternMap
    ? shapePatternMap[userLinePattern?.seriesId] ?? shapePatternMap[-1]
    : null;
  const shapePattern: ITooltipShapePattern = {};

  [userLinePattern, userPattern, userStyle, shapePatternFromMap, defaultShapePattern].forEach(cfg => {
    if (isValid(cfg)) {
      Object.keys(cfg).forEach(key => {
        if (isShapeKey(key) && isNil((shapePattern as any)[key]) && !isNil((cfg as any)[key])) {
          (shapePattern as any)[key] = (cfg as any)[key];
        }
      });
    }
  });

  return shapePattern;
};

const merge = <T, K>(source: K, extraInfo: T | ((source: K) => T), overwrite?: boolean) => {
  const info = isFunction(extraInfo) ? extraInfo(source) : extraInfo;
  return overwrite ? { ...source, ...info } : { ...info, ...source };
};

const addExtraInfoToTooltipTitlePattern = <T>(
  pattern: ITooltipPattern['title'],
  extraInfo: T | ((line: ITooltipLinePattern) => T),
  overwrite?: boolean
): ITooltipPattern['title'] | undefined => {
  const result = isValid(pattern)
    ? isFunction(pattern)
      ? (...args: any[]) => merge(pattern(...args), extraInfo, overwrite)
      : merge(pattern, extraInfo, overwrite)
    : undefined;
  return result;
};

const addExtraInfoToTooltipContentPattern = <T>(
  pattern: ITooltipPattern['content'],
  extraInfo: T | ((line: ITooltipLinePattern) => T),
  overwrite?: boolean
): ITooltipPattern['content'] | undefined => {
  const result = isValid(pattern)
    ? array(pattern).map(patternItem =>
        isFunction(patternItem)
          ? (...args: any[]) => array(patternItem(...args)).map(line => merge(line, extraInfo, overwrite))
          : merge(patternItem as ITooltipLinePattern, extraInfo, overwrite)
      )
    : undefined;
  return result;
};

const addSeriesInfo = (pattern: ITooltipPattern, series: ISeries[]) => {
  if (pattern && pattern.content) {
    return combinePattern(
      series.map(s => {
        return {
          ...pattern,
          content: addExtraInfoToTooltipContentPattern(
            pattern.content,
            {
              seriesId: s.id
            },
            true
          )
        };
      })
    );
  }

  return pattern;
};
