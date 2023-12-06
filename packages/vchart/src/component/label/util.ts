import type { WaterfallSeries } from './../../series/waterfall/waterfall';
import type { Datum } from '../../typings/common';
import { Direction } from '../../typings/space';
import type { ILabelInfo } from './label';
import type { BaseLabelAttrs, LabelItem, Strategy } from '@visactor/vrender-components';
import type { ICartesianSeries } from '../../series/interface';
import { isBoolean, isFunction, isString, substitute } from '@visactor/vutils';
import { createText } from '@visactor/vrender/es/register';
import type { IWaterfallSeriesSpec } from '../../series/waterfall/interface';
import type { ILabelSpec } from './interface';
import { ARC_RATIO } from '../../constant';
import { STACK_FIELD_END_PERCENT } from '../../constant';

export const labelRuleMap = {
  rect: barLabel,
  symbol: symbolLabel,
  arc: pieLabel,
  point: pointLabel,
  'line-data': lineDataLabel,
  stackLabel: stackLabel,
  line: LineLabel,
  area: LineLabel
};

export enum LabelRule {
  rect = 'rect',
  symbol = 'symbol',
  arc = 'arc',
  point = 'point',
  stackLabel = 'stackLabel',
  line = 'line'
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

  if (formatMethod) {
    textAttribute.text = formatMethod(textAttribute.text, datum, { series });
  }

  if (formatter) {
    if (series.type === 'pie') {
      datum._percent_ = (datum[ARC_RATIO] * 100).toFixed(2) + '%';
    } else if (datum[STACK_FIELD_END_PERCENT]) {
      datum._percent_ = (datum[STACK_FIELD_END_PERCENT] * 100).toFixed(2) + '%';
    }
    textAttribute.text = substitute(formatter, datum);
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
      strategy: labelSpec.overlap?.strategy ?? symbolLabelOverlapStrategy(),
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

  if (isString(originPosition) && position !== 'inside') {
    position = (data: Datum) => {
      const { data: datum } = data;
      const dataField = series.getMeasureField()[0];
      if (originPosition === 'outside') {
        const positionMap = { vertical: ['top', 'bottom'], horizontal: ['right', 'left'] };
        const index = (datum?.[dataField] >= 0 && isInverse) || (datum?.[dataField] < 0 && !isInverse) ? 1 : 0;
        return positionMap[direction][index];
      }
      if (originPosition === 'inside-bottom') {
        return (series as ICartesianSeries).direction === 'horizontal' ? 'inside-left' : 'inside-bottom';
      }
      if (originPosition === 'inside-top') {
        return (series as ICartesianSeries).direction === 'horizontal' ? 'inside-right' : 'inside-top';
      }
      return originPosition;
    };
  }
  // encode overlap config
  let overlap;
  if (labelSpec.overlap === false) {
    overlap = false;
  } else {
    overlap = {
      strategy: labelSpec.overlap?.strategy ?? barLabelOverlapStrategy(series as ICartesianSeries)
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

export function stackLabel(labelInfo: ILabelInfo) {
  const series = labelInfo.series as WaterfallSeries;
  const labelSpec = labelInfo.labelSpec || ({} as IWaterfallSeriesSpec['stackLabel']);
  const totalData = series.getTotalData();
  return {
    customLayoutFunc: (labels: LabelItem[]) => {
      return labels.map(label => {
        const pos = labelSpec.position || 'withChange';
        const offset = labelSpec.offset || 0;

        const datum = label.data;
        const attribute = textAttribute(labelInfo, datum, labelSpec.formatMethod);
        const x = (datum: any) => {
          if (series.direction === Direction.vertical) {
            return series.totalPositionX(datum, 'index', 0.5);
          }
          if (pos === 'middle') {
            return (series.totalPositionX(datum, 'end') + series.totalPositionY(datum, 'start')) * 0.5;
          } else if (pos === 'max') {
            return series.totalPositionX(datum, datum.end >= datum.start ? 'end' : 'start') + offset;
          } else if (pos === 'min') {
            return series.totalPositionX(datum, datum.end >= datum.start ? 'start' : 'end') - offset;
          }
          return series.totalPositionX(datum, 'end') + (datum.end >= datum.start ? offset : -offset);
        };
        const y = (datum: any) => {
          if (series.direction === Direction.vertical) {
            if (pos === 'middle') {
              return (series.totalPositionY(datum, 'end') + series.totalPositionY(datum, 'start')) * 0.5;
            } else if (pos === 'max') {
              return series.totalPositionY(datum, datum.end >= datum.start ? 'end' : 'start') - offset;
            } else if (pos === 'min') {
              return series.totalPositionY(datum, datum.end >= datum.start ? 'start' : 'end') + offset;
            }
            return series.totalPositionY(datum, 'end') + (datum.end >= datum.start ? -offset : offset);
          }
          return series.totalPositionY(datum, 'index', 0.5);
        };
        attribute.x = x(datum);
        attribute.y = y(datum);
        if (series.direction === Direction.vertical) {
          attribute.textBaseline =
            pos === 'middle'
              ? pos
              : (pos === 'withChange' && datum.end - datum.start >= 0) || pos === 'max'
              ? 'bottom'
              : 'top';
        } else {
          attribute.textAlign =
            pos === 'middle'
              ? 'center'
              : (pos === 'withChange' && datum.end - datum.start >= 0) || pos === 'max'
              ? 'left'
              : 'right';
        }
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
 * line 图元标签
 */

export function LineLabel(labelInfo: ILabelInfo) {
  const { labelSpec, series } = labelInfo;

  const seriesData = series.getViewDataStatistics?.().latestData?.[series.getSeriesField()]?.values;
  const data = seriesData ? seriesData.map((d: Datum, index: number) => ({ [series.getSeriesField()]: d, index })) : [];
  return { position: labelSpec.position ?? 'end', data };
}
