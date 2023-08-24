import type { Datum } from '../../typings';
import type { ILabelInfo } from './label';
import type { BaseLabelAttrs, Strategy } from '@visactor/vrender-components';
import type { ICartesianSeries } from '../../series/interface';
import { isString } from '@visactor/vutils';

export const markLabelConfigFunc = {
  rect: barLabel,
  symbol: symbolLabel,
  arc: pieLabel,
  point: pointLabel
};

export function textAttribute(
  labelInfo: ILabelInfo,
  datum: Datum,
  formatMethod: (text: string | string[], datum?: any) => string | string[]
) {
  const { labelMark, series } = labelInfo;
  const field = series.getMeasureField()[0];
  const textAttribute = { text: datum[field], data: datum } as any;

  const attributes = Object.keys(labelMark.stateStyle.normal);
  for (const key of attributes) {
    const attr = labelMark.getAttribute(key as any, datum);
    textAttribute[key] = attr;
    if (key === 'text' && formatMethod) {
      textAttribute[key] = formatMethod(textAttribute[key], datum);
    }
  }
  return textAttribute;
}

/**
 * symbol 图元标签规则。
 */
export function symbolLabel(labelInfo: ILabelInfo) {
  const { series, labelSpec } = labelInfo;

  // encode position config
  const defaultPosition = (series as ICartesianSeries).direction === 'horizontal' ? 'right' : 'top';
  const position = labelSpec.position ?? defaultPosition;

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
  const { series, labelSpec = {} } = labelInfo;

  // encode position config
  const labelPosition = labelSpec.position ?? 'outside';
  const direction = (series as ICartesianSeries).direction ?? 'vertical';
  const isInverse =
    (series as ICartesianSeries).direction === 'horizontal'
      ? (series as ICartesianSeries).getXAxisHelper()?.isInverse()
      : (series as ICartesianSeries).getYAxisHelper()?.isInverse();

  let position = labelPosition as BaseLabelAttrs['position'];

  if (position !== 'inside') {
    position = (data: Datum) => {
      const { data: datum } = data;
      const dataField = series.getMeasureField()[0];
      if (labelPosition === 'outside') {
        const positionMap = { vertical: ['top', 'bottom'], horizontal: ['right', 'left'] };
        const index = (datum?.[dataField] >= 0 && isInverse) || (datum?.[dataField] < 0 && !isInverse) ? 1 : 0;
        return positionMap[direction][index];
      }
      if (labelPosition === 'inside-bottom') {
        return (series as ICartesianSeries).direction === 'horizontal' ? 'inside-left' : 'inside-bottom';
      }
      if (labelPosition === 'inside-top') {
        return (series as ICartesianSeries).direction === 'horizontal' ? 'inside-right' : 'inside-top';
      }
      return labelPosition;
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
  if (isString(labelPosition) && labelPosition.includes('inside')) {
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
  const labelPosition = labelSpec.position ?? 'outside';
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
