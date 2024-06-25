import type { WaterfallSeries } from './../../series/waterfall/waterfall';
import type { Datum } from '../../typings/common';
import { Direction } from '../../typings/space';
import type { ILabelInfo } from './label';
import type { BaseLabelAttrs, LabelItem, OverlapAttrs, Strategy } from '@visactor/vrender-components';
import { SeriesTypeEnum, type ICartesianSeries } from '../../series/interface';
import { isBoolean, isFunction, isObject, isString } from '@visactor/vutils';
import { createText } from '@visactor/vrender-core';
import type { IWaterfallSeriesSpec } from '../../series/waterfall/interface';
import type { ILabelSpec } from './interface';
import { getFormatFunction } from '../util';

export const labelRuleMap = {
  rect: barLabel,
  symbol: symbolLabel,
  arc: pieLabel,
  point: pointLabel,
  'line-data': lineDataLabel,
  stackLabel: stackLabel,
  line: LineLabel,
  area: LineLabel,
  rect3d: barLabel,
  arc3d: pieLabel,
  treemap: treemapLabel,
  venn: vennLabel
};

export function defaultLabelConfig(rule: string, labelInfo: ILabelInfo) {
  const { labelSpec } = labelInfo;
  if (labelSpec.overlap && !isObject(labelSpec.overlap)) {
    labelSpec.overlap = {};
  }
  const processor = labelRuleMap[rule] ?? labelRuleMap.point;

  if (labelInfo.series.type === SeriesTypeEnum.sankey) {
    return sankeyLabel(labelInfo);
  }
  return processor(labelInfo);
}

export function textAttribute(
  labelInfo: ILabelInfo,
  datum: Datum,
  formatMethod?: ILabelSpec['formatMethod'],
  formatter?: ILabelSpec['formatter']
) {
  const { labelMark, series } = labelInfo;
  const field = series.getMeasureField()[0];
  const textAttribute = { text: datum[field], data: datum, textType: labelInfo.labelSpec.textType ?? 'text' } as any;

  const attributes = Object.keys(labelMark.stateStyle.normal);

  for (const key of attributes) {
    const attr = labelMark.getAttribute(key as any, datum);
    textAttribute[key] = attr;
  }

  const { formatFunc, args } = getFormatFunction(formatMethod, formatter, textAttribute.text, datum);
  if (formatFunc) {
    textAttribute.text = formatFunc(...args, { series });
  }

  return textAttribute;
}

function uniformLabelPosition(position?: ILabelSpec['position']) {
  if (isFunction(position)) {
    return (datum: Datum) => {
      return position(datum.data);
    };
  }
  return position;
}

/**
 * symbol 图元标签规则。
 */
export function symbolLabel(labelInfo: ILabelInfo) {
  const { series, labelSpec } = labelInfo;

  // encode position config
  const defaultPosition = (series as ICartesianSeries).direction === 'horizontal' ? 'right' : 'top';
  const position = uniformLabelPosition(labelSpec.position) ?? defaultPosition;

  // encode overlap config
  let overlap;
  if (labelSpec.overlap === false) {
    overlap = false;
  } else {
    overlap = {
      strategy: (labelSpec.overlap as OverlapAttrs)?.strategy ?? symbolLabelOverlapStrategy(),
      avoidBaseMark: position !== 'center'
    };
  }

  return { position, overlap };
}

export function lineDataLabel(labelInfo: ILabelInfo) {
  const result = symbolLabel(labelInfo);
  if (!isBoolean(result.overlap)) {
    result.overlap.avoidBaseMark = false;
  }
  return result;
}

function symbolLabelOverlapStrategy() {
  const strategy: Strategy[] = [
    {
      type: 'position',
      position: ['top', 'bottom', 'right', 'left', 'top-right', 'top-left', 'bottom-left', 'bottom-right']
    }
  ];

  return strategy;
}

/**
 *
 */
export function barLabel(labelInfo: ILabelInfo) {
  const { series, labelSpec = {} as ILabelSpec } = labelInfo;

  // encode position config
  const originPosition = uniformLabelPosition(labelSpec.position) ?? 'outside';
  const direction = (series as ICartesianSeries).direction ?? 'vertical';
  const isInverse =
    (series as ICartesianSeries).direction === 'horizontal'
      ? (series as ICartesianSeries).getXAxisHelper()?.isInverse()
      : (series as ICartesianSeries).getYAxisHelper()?.isInverse();

  let position = originPosition as BaseLabelAttrs['position'];

  if (isString(originPosition) && originPosition === 'outside') {
    position = (data: Datum) => {
      const { data: datum } = data;
      const dataField = series.getMeasureField()[0];
      const positionMap = { vertical: ['top', 'bottom'], horizontal: ['right', 'left'] };
      const index = (datum?.[dataField] >= 0 && isInverse) || (datum?.[dataField] < 0 && !isInverse) ? 1 : 0;
      return positionMap[direction][index];
    };
  }
  // encode overlap config
  let overlap;
  if (labelSpec.overlap === false) {
    overlap = false;
  } else {
    overlap = {
      strategy: (labelSpec.overlap as OverlapAttrs)?.strategy ?? barLabelOverlapStrategy(series as ICartesianSeries)
    };
  }

  // encode smartInvert
  let smartInvert = false;
  if (isString(originPosition) && originPosition.includes('inside')) {
    smartInvert = true;
  }

  return { position, overlap, smartInvert };
}

function barLabelOverlapStrategy(series: ICartesianSeries) {
  const strategy: Strategy[] = [
    {
      type: 'position',
      position: (data: any) => {
        const { data: datum } = data;
        const dataField = series.getMeasureField()[0];
        const isInverse =
          (series as ICartesianSeries).direction === 'horizontal'
            ? (series as ICartesianSeries).getXAxisHelper()?.isInverse()
            : (series as ICartesianSeries).getYAxisHelper()?.isInverse();
        if (isInverse) {
          if (datum?.[dataField] >= 0) {
            return series.direction === 'horizontal' ? ['left', 'inside-left'] : ['bottom', 'inside-bottom'];
          }
          return series.direction === 'horizontal' ? ['right', 'inside-right'] : ['top', 'inside-top'];
        }
        if (datum?.[dataField] >= 0) {
          return series.direction === 'horizontal' ? ['right', 'inside-right'] : ['top', 'inside-top'];
        }
        return series.direction === 'horizontal' ? ['left', 'inside-left'] : ['bottom', 'inside-bottom'];
      }
    }
  ];

  return strategy;
}

/**
 * 无关图元，指定x/y坐标的标签配置规则
 */
export function pointLabel(labelInfo: ILabelInfo) {
  const { labelSpec } = labelInfo;

  // encode overlap config
  let overlap;
  if (labelSpec.overlap === false) {
    overlap = false;
  } else {
    overlap = {
      avoidBaseMark: false
    };
  }

  return { position: 'center', overlap };
}

/**
 * pie 图元标签配置规则
 */

export function pieLabel(labelInfo: ILabelInfo) {
  const { labelSpec } = labelInfo;
  // encode position config
  const labelPosition = uniformLabelPosition(labelSpec.position) ?? 'outside';
  const position = labelPosition as BaseLabelAttrs['position'];

  // encode smartInvert
  let smartInvert;
  if (labelSpec.smartInvert) {
    smartInvert = labelSpec.smartInvert;
  } else {
    smartInvert = isString(labelPosition) && labelPosition.includes('inside');
  }

  return { position, smartInvert };
}

/**
 * 瀑布图堆积标签配置规则
 */

export function stackLabelX(datum2: Datum, series: WaterfallSeries, pos: string, offset: number) {
  if (series.direction === Direction.horizontal) {
    if (pos === 'middle') {
      return (series.totalPositionX(datum2, 'end') + series.totalPositionY(datum2, 'start')) * 0.5;
    } else if (pos === 'max') {
      return series.totalPositionX(datum2, datum2.end >= datum2.start ? 'end' : 'start') + offset;
    } else if (pos === 'min') {
      return series.totalPositionX(datum2, datum2.end >= datum2.start ? 'start' : 'end') - offset;
    }
    return series.totalPositionX(datum2, 'end') + (datum2.end >= datum2.start ? offset : -offset);
  }
  return series.totalPositionX(datum2, 'index', 0.5);
}
export function stackLabelY(datum2: Datum, series: WaterfallSeries, pos: string, offset: number) {
  if (series.direction === Direction.horizontal) {
    return series.totalPositionY(datum2, 'index', 0.5);
  }
  if (pos === 'middle') {
    return (series.totalPositionY(datum2, 'end') + series.totalPositionY(datum2, 'start')) * 0.5;
  } else if (pos === 'max') {
    return series.totalPositionY(datum2, datum2.end >= datum2.start ? 'end' : 'start') - offset;
  } else if (pos === 'min') {
    return series.totalPositionY(datum2, datum2.end >= datum2.start ? 'start' : 'end') + offset;
  }
  return series.totalPositionY(datum2, 'end') + (datum2.end >= datum2.start ? -offset : offset);
}

export function stackLabel(
  labelInfo: ILabelInfo,
  datumTransform?: (data: any) => any,
  attributeTransform?: (label: LabelItem, datum: Datum, att: any) => any
) {
  const series = labelInfo.series as WaterfallSeries;
  const labelSpec = labelInfo.labelSpec || ({} as IWaterfallSeriesSpec['stackLabel']);
  const totalData = series.getTotalData();
  return {
    customLayoutFunc: (labels: LabelItem[]) => {
      return labels.map(label => {
        const pos = labelSpec.position || 'withChange';
        const offset = labelSpec.offset || 0;

        const datum = datumTransform ? datumTransform(label.data) : label.data;
        const attribute = textAttribute(labelInfo, datum, labelSpec.formatMethod);

        attribute.x = stackLabelX(datum, series, pos, offset);
        attribute.y = stackLabelY(datum, series, pos, offset);
        if (series.direction === Direction.horizontal) {
          attribute.textAlign =
            pos === 'middle'
              ? 'center'
              : (pos === 'withChange' && datum.end - datum.start >= 0) || pos === 'max'
              ? 'left'
              : 'right';
        } else {
          attribute.textBaseline =
            pos === 'middle'
              ? pos
              : (pos === 'withChange' && datum.end - datum.start >= 0) || pos === 'max'
              ? 'bottom'
              : 'top';
        }
        attributeTransform?.(label, datum, attribute);
        return createText({ ...attribute, id: label.id });
      });
    },
    dataFilter: (labels: LabelItem[]) => {
      const result: LabelItem[] = [];
      totalData.forEach((total: any) => {
        const label = labels.find(labelItem => {
          return total.index === labelItem.data?.[series.getDimensionField()[0]];
        });
        if (label) {
          label.data = total;
          result.push(label);
        }
      });
      return result;
    },
    overlap: {
      strategy: [] as any
    }
  };
}

/**
 * treemap 非叶子节点标签配置规则
 */
export function treemapLabel(labelInfo: ILabelInfo) {
  return {
    customLayoutFunc: (labels: LabelItem[], text: any) => text,
    overlap: false
  };
}

/**
 * venn 标签配置规则
 */
export function vennLabel(labelInfo: ILabelInfo) {
  return {
    customLayoutFunc: (labels: LabelItem[], text: any) => text,
    smartInvert: true
  };
}

/**
 * line 图元标签
 */

export function LineLabel(labelInfo: ILabelInfo) {
  const { labelSpec, series } = labelInfo;

  const seriesData = series.getViewDataStatistics?.().latestData?.[series.getSeriesField()]?.values;
  const data = seriesData ? seriesData.map((d: Datum, index: number) => ({ [series.getSeriesField()]: d, index })) : [];
  return { position: labelSpec.position ?? 'end', data };
}

export function sankeyLabel(labelInfo: ILabelInfo) {
  const { series, labelSpec = {} as ILabelSpec } = labelInfo;
  // encode position config
  const originPosition = uniformLabelPosition(labelSpec.position) ?? 'outside';
  const direction = (series as ICartesianSeries).direction;
  let position = originPosition as BaseLabelAttrs['position'];

  if (isString(originPosition)) {
    if (direction === 'vertical') {
      if (originPosition === 'inside-start') {
        position = (datum: Datum) => {
          return 'inside-left';
        };
      } else if (originPosition === 'inside-middle') {
        position = (datum: Datum) => {
          return 'center';
        };
      } else if (originPosition === 'inside-end') {
        position = (datum: Datum) => {
          return 'inside-right';
        };
      } else {
        position = (datum: Datum) => {
          return 'bottom';
        };
      }
    } else {
      if (originPosition === 'inside-start') {
        position = (datum: Datum) => {
          return 'inside-left';
        };
      } else if (originPosition === 'inside-middle') {
        position = (datum: Datum) => {
          return 'center';
        };
      } else if (originPosition === 'inside-end') {
        position = (datum: Datum) => {
          return 'inside-right';
        };
      } else if (originPosition === 'outside') {
        position = (datum: Datum) => {
          return 'right';
        };
      }
    }
  }
  // encode overlap config
  let overlap;
  if (labelSpec.overlap === false) {
    overlap = false;
  } else {
    overlap =
      isString(originPosition) && originPosition.includes('inside')
        ? false
        : {
            strategy:
              (labelSpec.overlap as OverlapAttrs)?.strategy ?? sankeyLabelOverlapStrategy(series as ICartesianSeries)
          };
  }

  return { position, overlap, smartInvert: false, offset: 0 };
}

function sankeyLabelOverlapStrategy(series: ICartesianSeries) {
  const strategy: Strategy[] = [
    {
      type: 'position',
      position: (data: any) => {
        return series.direction === 'horizontal' ? ['right', 'left'] : ['bottom', 'top'];
      }
    }
  ];

  return strategy;
}
