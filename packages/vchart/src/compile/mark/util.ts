import { isFunction } from '@visactor/vutils';
import type { IAttrs, IMarkStateStyle, MarkType } from '../../mark/interface';
import { STATE_VALUE_ENUM } from './interface';

export function isAttrChangeable<T>(key: string, stateStyle: IMarkStateStyle<T>) {
  for (const state in stateStyle) {
    if (state === STATE_VALUE_ENUM.STATE_NORMAL) {
      const style = stateStyle[state][key]?.style;
      const isGradient = isGradientAttribute(key, style);
      if (isGradient) {
        return true;
      }
      const isFunctionStyle = isFunction(style);
      if (isFunctionStyle) {
        return true;
      }
      const isScale = !!style?.scale;
      if (isScale) {
        return true;
      }
      continue;
    }
    if (key in stateStyle[state]) {
      return true;
    }
  }
  return false;
}

export function isStateAttrChangeable<T>(key: string, stateStyle: Partial<IAttrs<T>>, facetField: string) {
  const style = stateStyle[key]?.style;
  const isGradient = isGradientAttribute(key, style);
  if (isGradient) {
    return true;
  }
  const isFunctionStyle = isFunction(style);
  if (isFunctionStyle) {
    return true;
  }
  const isScale = !!style?.scale;
  if (isScale) {
    if (style.field !== facetField) {
      return true;
    }
  }
  return false;
}

function isGradientAttribute(key: string, style: any) {
  return (key === 'fill' || key === 'stroke') && style?.gradient && style?.stops;
}

function symbolAttrTransform(attr: string, value: any) {
  switch (attr) {
    case 'shape':
    case 'symbolType':
      return chartShapes[value] ?? value;
    default:
      return value;
  }
}

// TODO：沉淀到 VRender
const chartShapes = {
  arrowLeft: 'M 0.25 -0.5 L -0.25 0 l 0.5 0.5',
  arrowRight: 'M -0.25 -0.5 l 0.5 0.5 l -0.5 0.5',
  rect: 'M -0.5,0.25 L 0.5,0.25 L 0.5,-0.25,L -0.5,-0.25 Z',
  rectRound:
    // eslint-disable-next-line max-len
    'M 0.3 -0.5 C 0.41 -0.5 0.5 -0.41 0.5 -0.3 C 0.5 -0.3 0.5 0.3 0.5 0.3 C 0.5 0.41 0.41 0.5 0.3 0.5 C 0.3 0.5 -0.3 0.5 -0.3 0.5 C -0.41 0.5 -0.5 0.41 -0.5 0.3 C -0.5 0.3 -0.5 -0.3 -0.5 -0.3 C -0.5 -0.41 -0.41 -0.5 -0.3 -0.5 C -0.3 -0.5 0.3 -0.5 0.3 -0.5 Z'
};

const transforms = {
  symbol: symbolAttrTransform
};
const transformsCheck = {
  symbol: {
    shape: true,
    symbolType: true
  }
};

export function needAttrTransform(type: MarkType, attr: string) {
  if (!transformsCheck[type]) {
    return false;
  }
  if (!transformsCheck[type][attr]) {
    return false;
  }
  return true;
}

export function attrTransform(type: MarkType, attr: string, value: any) {
  if (!transforms[type]) {
    return value;
  }
  return transforms[type](attr, value);
}

const DEFAULT_STATE_VALUE_ENUM = {};
Object.values(STATE_VALUE_ENUM).forEach(v => {
  DEFAULT_STATE_VALUE_ENUM[v] = true;
});

export function stateInDefaultEnum(state: string) {
  return !!DEFAULT_STATE_VALUE_ENUM[state];
}

const DEFAULT_STATE_VALUE_TO_REVERSE = {
  [STATE_VALUE_ENUM.STATE_HOVER]: STATE_VALUE_ENUM.STATE_HOVER_REVERSE,
  [STATE_VALUE_ENUM.STATE_SELECTED]: STATE_VALUE_ENUM.STATE_SELECTED_REVERSE,
  [STATE_VALUE_ENUM.STATE_DIMENSION_HOVER]: STATE_VALUE_ENUM.STATE_DIMENSION_HOVER_REVERSE
};

export function stateToReverse(state: string) {
  return DEFAULT_STATE_VALUE_TO_REVERSE[state];
}
