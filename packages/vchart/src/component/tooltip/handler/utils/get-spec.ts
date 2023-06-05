import type { ITooltipSpec } from '../../interface';
import type {
  IToolTipLinePattern,
  ITooltipPattern,
  ITooltipShapePattern,
  TooltipActiveType
} from '../../../../typings';
import type { ISeries } from '../../../../series/interface';
import { cloneDeep, isValid, isNil, merge, array } from '../../../../util';
import { makeDefaultPattern } from './pattern';
import type { IDimensionInfo } from '../../../../event/events/dimension/interface';

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
      finalSpec.visible =
        seriesSpec.visible !== false &&
        seriesSpec.mark?.visible !== false &&
        (isNil(seriesSpec.activeType) || array(seriesSpec.activeType).includes?.('mark'));
    } else if (isValid(globalSpec.visible) || isValid(globalSpec.activeType)) {
      finalSpec.visible =
        globalSpec.visible !== false &&
        globalSpec.mark?.visible !== false &&
        (isNil(globalSpec.activeType) || array(globalSpec.activeType).includes?.('mark'));
    } else {
      finalSpec.visible = true;
    }

    // 优先使用自定义handler
    finalSpec.handler = seriesSpec.handler ?? globalSpec.handler ?? undefined;
    if (finalSpec.handler?.showTooltip) {
      return finalSpec;
    }

    // pattern
    defaultPattern = makeDefaultPattern(series, 'mark');
    userPattern = merge({}, cloneDeep(globalSpec.mark), cloneDeep(seriesSpec.mark));
  } else if (activeType === 'dimension' && dimensionInfo) {
    // dimension目前仅支持global spec

    // visible
    if (isValid(globalSpec.visible) || isValid(globalSpec.activeType)) {
      finalSpec.visible =
        globalSpec.visible !== false &&
        globalSpec.dimension?.visible !== false &&
        (isNil(globalSpec.activeType) || array(globalSpec.activeType).includes?.('dimension'));
    } else {
      finalSpec.visible = true;
    }

    // 优先使用自定义handler
    finalSpec.handler = globalSpec.handler ?? undefined;
    if (finalSpec.handler?.showTooltip) {
      return finalSpec;
    }

    // pattern
    const firstSeries = dimensionInfo[0]?.data[0]?.series;
    defaultPattern = firstSeries ? makeDefaultPattern(firstSeries, 'dimension', dimensionInfo) : {};
    userPattern = cloneDeep(globalSpec.dimension) ?? {};
  }

  // 对pattern进行组装
  const titleShape: ITooltipShapePattern = {
    hasShape: userPattern.hasShape ?? defaultPattern.title.hasShape,
    shapeType: userPattern.shapeType ?? defaultPattern.title.shapeType,
    shapeColor: userPattern.shapeColor ?? defaultPattern.title.shapeColor
  };
  if (isValid(userPattern.title)) {
    userPattern.title = {
      ...defaultPattern.title,
      ...titleShape, // shape默认回调实现较复杂，如果用户没有配置则填补默认逻辑
      ...userPattern.title
    };
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
  if (isValid(userPattern.content)) {
    userPattern.content.forEach((line, i) => {
      userPattern.content[i] = {
        ...getContentShape(defaultPattern.content[0]), // shape默认回调实现较复杂，如果用户没有配置则填补默认逻辑
        ...line
      };
    });
  } else {
    userPattern.content = defaultPattern.content.map(line => ({
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
