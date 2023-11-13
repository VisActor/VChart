import { Factory } from '../../core/factory';
import { Direction } from '../../typings/space';
// eslint-disable-next-line no-duplicate-imports
import type { Datum, DirectionType } from '../../typings';
import type { IElement, IAnimationTypeConfig } from '@visactor/vgrammar-core';

export interface IBarAnimationParams {
  xField: string;
  yField: string;
  direction: DirectionType;
  // growHeightOverall，需要知道一起生长的起始点
  // 即 x轴 在canvas上的y（ 或 y轴 在canvas上的x ）。
  growFrom: () => number;
}

export type BarAppearPreset = 'grow' | 'fadeIn' | 'scaleIn';

/**
 * grow生长option
 * 在appear时，所有柱子一起从同一个位置生长，需要growXXXOverall效果；
 * 在enter时，柱子应该从自身位置生长；
 * @param params
 * @param isOverall
 * @returns
 */
function barGrowOption(barParams: IBarAnimationParams, isOverall = true) {
  return (datum: Datum, element: IElement, params: any) => {
    const field = barParams.direction === 'vertical' ? barParams.yField : barParams.xField;
    const data = datum?.[field];
    if (barParams.direction === 'vertical') {
      return {
        overall: isOverall ? barParams.growFrom() : isOverall,
        orient: data > 0 ? 'negative' : 'positive'
      };
    }
    return {
      overall: isOverall ? barParams.growFrom() : false,
      orient: data > 0 ? 'positive' : 'negative'
    };
  };
}
export const barGrowIn = (params: IBarAnimationParams, isOverall: boolean = true): IAnimationTypeConfig => {
  return {
    type: params.direction === Direction.horizontal ? 'growWidthIn' : 'growHeightIn',
    options: barGrowOption(params, isOverall)
  };
};

export const barGrowOut = (params: IBarAnimationParams, isOverall: boolean = true): IAnimationTypeConfig => {
  return {
    type: params.direction === Direction.horizontal ? 'growWidthOut' : 'growHeightOut',
    options: barGrowOption(params, isOverall)
  };
};

const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

const Appear_ScaleIn: IAnimationTypeConfig = {
  type: 'growCenterIn'
};

export function barPresetAnimation(
  params: IBarAnimationParams,
  preset: BarAppearPreset | boolean
): IAnimationTypeConfig {
  if (preset === false) {
    return {};
  }
  switch (preset) {
    case 'fadeIn':
      return Appear_FadeIn;
    case 'scaleIn':
      return Appear_ScaleIn;
    default:
      return barGrowIn(params);
  }
}

export const registerBarAnimation = () => {
  Factory.registerAnimation('bar', (params: IBarAnimationParams, preset: BarAppearPreset) => {
    return {
      appear: barPresetAnimation(params, preset),
      enter: barGrowIn(params, false),
      exit: barGrowOut(params, false),
      disappear: barGrowOut(params)
    };
  });
};

export const registerBar3dAnimation = () => {
  Factory.registerAnimation('bar3d', (params: IBarAnimationParams, preset: BarAppearPreset) => {
    return {
      appear: barPresetAnimation(params, preset),
      enter: barGrowIn(params, false),
      exit: barGrowOut(params, false),
      disappear: barGrowOut(params)
    };
  });
};
