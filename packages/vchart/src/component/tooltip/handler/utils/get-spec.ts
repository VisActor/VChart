import type { ITooltipSpec } from '../../interface';
import type {
  IToolTipLinePattern,
  ITooltipPattern,
  ITooltipShapePattern,
  MaybeArray,
  TooltipActiveType,
  TooltipPatternProperty
} from '../../../../typings';
import type { ISeries } from '../../../../series/interface';
import { cloneDeep, isValid, merge, array, isFunction, isNil } from '../../../../util';
import { makeDefaultPattern } from './pattern';
import type { IDimensionInfo } from '../../../../event/events/dimension/interface';
import { getTooltipActualActiveType } from '../../utils';

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
  // 默认的pattern
  let defaultPattern = {} as ITooltipPattern;
  // 用户配置的pattern
  let userPattern = {} as ITooltipPattern;

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

    // pattern
    defaultPattern = makeDefaultPattern(series, 'mark') ?? {};
    userPattern = merge({}, cloneDeep(globalSpec.mark), cloneDeep(seriesSpec.mark));
  } else if (activeType === 'dimension' && dimensionInfo?.length) {
    // tooltip spec覆盖优先级: series spec > global spec > default pattern
    const seriesList = dimensionInfo.reduce(
      (list, cur) => list.concat(cur.data.map(data => data.series).filter(isValid)),
      [] as ISeries[]
    );

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

    // 默认 pattern
    const patternList: ITooltipPattern[] = [];
    dimensionInfo[0].data.forEach(data => {
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
    });
    // 拼接默认 tooltip content
    const defaultPatternContent: Array<TooltipPatternProperty<MaybeArray<IToolTipLinePattern>>> = [];
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

    // 系列 pattern
    let seriesDimensionPattern: ITooltipPattern = {};
    const seriesPatternList = seriesList
      .filter(series => {
        const spec = series.tooltipHelper?.spec;
        return isValid(spec?.dimension) && getTooltipActualActiveType(spec).includes('dimension');
      })
      .map(series => {
        const pattern = series.tooltipHelper.spec!.dimension!;
        return pattern;
      });
    if (seriesPatternList.length) {
      // 拼接系列 tooltip content
      let seriesPatternContent: Array<TooltipPatternProperty<MaybeArray<IToolTipLinePattern>>> | undefined = [];
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
      seriesDimensionPattern = {
        ...seriesPatternList[0],
        content: seriesPatternContent
      };
    }

    userPattern = merge({}, cloneDeep(globalSpec.dimension), seriesDimensionPattern);
  }

  // 对pattern进行组装
  const defaultPatternTitle = defaultPattern.title as IToolTipLinePattern | undefined;
  const titleShape: ITooltipShapePattern = {
    hasShape: userPattern.hasShape ?? defaultPatternTitle?.hasShape,
    shapeType: userPattern.shapeType ?? defaultPatternTitle?.shapeType,
    shapeColor: userPattern.shapeColor ?? defaultPatternTitle?.shapeColor
  };
  if (isValid(userPattern.title)) {
    // 排除是回调的情况
    if (!isFunction(userPattern.title)) {
      userPattern.title = {
        ...defaultPattern.title,
        ...titleShape, // shape默认回调实现较复杂，如果用户没有配置则填补默认逻辑
        ...userPattern.title
      };
    }
  } else {
    userPattern.title = {
      ...defaultPattern.title,
      ...titleShape
    };
  }

  const getContentShape = (defaultContentLine?: IToolTipLinePattern): ITooltipShapePattern => ({
    hasShape: userPattern.hasShape ?? defaultContentLine?.hasShape,
    shapeType: userPattern.shapeType ?? defaultContentLine?.shapeType,
    shapeColor: userPattern.shapeColor ?? defaultContentLine?.shapeColor
  });
  const defaultPatternContent = array(defaultPattern.content) as IToolTipLinePattern[];
  if (isValid(userPattern.content)) {
    // 排除是回调的情况
    if (!isFunction(userPattern.content)) {
      const userPatternContent = array(userPattern.content);
      userPatternContent.forEach((line, i) => {
        userPatternContent[i] = {
          ...getContentShape(defaultPatternContent[0]), // shape默认回调实现较复杂，如果用户没有配置则填补默认逻辑
          ...line
        };
      });
    }
  } else {
    userPattern.content = defaultPatternContent.map(line => ({
      ...line,
      ...getContentShape(line)
    }));
  }

  finalSpec[activeType] = {
    ...defaultPattern,
    ...userPattern,
    activeType
  };

  return finalSpec;
};
