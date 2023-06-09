import type { ITheme } from './../../theme/interface';
import { isFunction, merge, get, isNil, degreeToRadian } from '@visactor/vutils';
import type { Datum, IOrientType, IPolarOrientType } from '../../typings';
import type { AxisType, ICommonAxisSpec, ILinearAxisSpec } from './interface';
import { transformToGraphic, transformComponentStyle, transformStateStyle } from '../../util/style';
import { isXAxis } from './cartesian/util';

const DEFAULT_TITLE_STYLE = {
  left: {
    textAlign: 'center',
    textBaseline: 'bottom'
  },
  right: {
    textAlign: 'center',
    textBaseline: 'bottom'
  },
  radius: {},
  angle: {}
};

function transformAxisLineStyle(lineCfg: any) {
  transformComponentStyle(lineCfg);
  transformComponentStyle(lineCfg.startSymbol);
  transformComponentStyle(lineCfg.endSymbol);

  return lineCfg;
}

export function getAxisAttributes(spec: any, theme: any) {
  let titleAngle = spec.title.angle;
  let titleTextStyle;
  if (spec.orient === 'left' || spec.orient === 'right') {
    // 处理纵轴的标题样式
    if (spec.title?.autoRotate && isNil(spec.title.angle)) {
      titleAngle = spec.orient === 'left' ? -90 : 90;
      titleTextStyle = DEFAULT_TITLE_STYLE[spec.orient];
    }
  }

  return {
    select: spec.select,
    hover: spec.hover,
    line: transformAxisLineStyle(spec.domainLine),
    label: {
      visible: spec.label.visible,
      space: spec.label.space,
      inside: spec.label.inside,
      style: isFunction(spec.label.style)
        ? (datum: Datum, index: number) => {
            const style = spec.label.style(datum.rawValue, index, datum);

            return transformToGraphic(merge({}, theme.label.style, style));
          }
        : transformToGraphic(spec.label.style),
      formatMethod: spec.label.formatMethod
        ? (value: any, datum: any, index: number) => {
            return spec.label.formatMethod(datum.rawValue, datum);
          }
        : null,
      state: transformStateStyle(spec.label.state)
    },
    tick: {
      visible: spec.tick.visible,
      length: spec.tick.tickSize,
      inside: spec.tick.inside,
      alignWithLabel: spec.tick.alignWithLabel,
      style: isFunction(spec.tick.style)
        ? (datum: Datum, index: number) => {
            const style = spec.tick.style(datum.rawValue, index, datum);

            return transformToGraphic(merge({}, theme.tick.style, style));
          }
        : transformToGraphic(spec.tick.style),
      state: transformStateStyle(spec.tick.state)
    },
    subTick: {
      visible: spec.subTick.visible,
      length: spec.subTick.tickSize,
      inside: spec.subTick.inside,
      count: spec.subTick.tickCount,
      style: transformToGraphic(spec.subTick.style),
      state: transformStateStyle(spec.subTick.state)
    },
    grid: {
      type: 'line',
      visible: spec.grid.visible,
      alternateColor: spec.grid.alternateColor,
      alignWithLabel: spec.grid.alignWithLabel,
      style: isFunction(spec.grid.style)
        ? (datum: Datum, index: number) => {
            const style = spec.grid.style(datum.datum?.rawValue, index, datum.datum);

            return transformToGraphic(merge({}, theme.grid.style, style));
          }
        : transformToGraphic(spec.grid.style)
    },
    subGrid: {
      type: 'line',
      visible: spec.subGrid.visible,
      alternateColor: spec.subGrid.alternateColor,
      style: transformToGraphic(spec.subGrid.style)
    },
    title: {
      visible: spec.title.visible,
      position: spec.title.position,
      space: spec.title.space,
      autoRotate: false, // 默认不对外提供该配置
      angle: titleAngle ? degreeToRadian(titleAngle) : null,
      textStyle: merge({}, titleTextStyle, transformToGraphic(spec.title.style)),
      padding: spec.title.padding,
      shape: {
        visible: spec.title.shape?.visible,
        space: spec.title.shape?.space,
        style: transformToGraphic(spec.title.shape?.style)
      },
      background: {
        visible: spec.title.background?.visible,
        style: transformToGraphic(spec.title.background?.style)
      },
      state: {
        text: transformStateStyle(spec.title.state),
        shape: transformStateStyle(spec.title.shape?.state),
        background: transformStateStyle(spec.title.background?.state)
      }
    },
    panel: {
      visible: spec.background?.visible,
      style: transformToGraphic(spec.background?.style),
      state: transformStateStyle(spec.background?.state)
    }
  };
}

export function getAxisLabelOffset(axisSpec: ICommonAxisSpec) {
  let labelOffset = 0;
  if (get(axisSpec, 'tick.visible')) {
    labelOffset += get(axisSpec, 'tick.tickSize');
  }

  if (get(axisSpec, 'label.visible')) {
    labelOffset += get(axisSpec, 'label.space');
  }

  return labelOffset;
}

export function getLinearAxisSpecDomain(
  axisSpec: ILinearAxisSpec,
  defaultDomain?: {
    min?: number;
    max?: number;
  }
) {
  // 兼容策略
  return {
    min: axisSpec.min ?? axisSpec.range?.min ?? defaultDomain?.min,
    max: axisSpec.max ?? axisSpec.range?.max ?? defaultDomain?.max
  };
}

export function isValidCartesianAxis(spec: any) {
  const orient = spec?.orient;
  return orient === 'top' || orient === 'bottom' || orient === 'left' || orient === 'right' || orient === 'z';
}

export function isValidPolarAxis(spec: any) {
  const orient = spec?.orient;
  return orient === 'angle' || orient === 'radius';
}

export const getCartesianAxisTheme = (orient: IOrientType, type: AxisType, theme: ITheme) => {
  const { axisBand, axisLinear, axisX, axisY, axis } = theme.component ?? {};
  const axisTypeTheme = (type === 'band' ? axisBand : type === 'linear' ? axisLinear : {}) ?? {};
  const axisTheme = isXAxis(orient) ? axisX : axisY;
  return merge({}, axis, axisTypeTheme, axisTheme);
};

export const getPolarAxisTheme = (orient: IPolarOrientType, type: AxisType, theme: ITheme) => {
  const { axisBand, axisLinear, axisAngle, axisRadius, axis } = theme.component ?? {};
  const axisTypeTheme = (type === 'band' ? axisBand : type === 'linear' ? axisLinear : {}) ?? {};
  const axisTheme = orient === 'angle' ? axisAngle : axisRadius;
  return merge({}, axis, axisTypeTheme, axisTheme);
};
