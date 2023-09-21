import type { Datum, IAnimationTypeConfig, IElement } from '@visactor/vgrammar-core';
import type { IPoint, Maybe } from '../../typings';
import { ClipAngleAnimate } from '@visactor/vrender-core';
import type { IPolarAxisHelper } from '../../component/axis';

export interface IRadarAnimationParams {
  center: () => Maybe<IPoint>;
  radius: () => number;
  startAngle: number;
  pointToCoord: IPolarAxisHelper['pointToCoord'];
  coordToPoint: IPolarAxisHelper['coordToPoint'];
}

export type RadarAppearPreset = 'grow' | 'fadeIn' | 'clipIn';

export const radarFadeAnimation = (animationType: 'in' | 'out') => ({
  type: animationType === 'in' ? 'fadeIn' : 'fadeOut'
});

export const radarGrowAnimation = (params: IRadarAnimationParams, animationType: 'in' | 'out') => ({
  type: animationType === 'in' ? 'growPointsIn' : 'growPointsOut',
  options: () => ({
    center: params.center()
  })
});

export function radarPresetAnimation(
  params: IRadarAnimationParams,
  preset: RadarAppearPreset,
  animationType: 'in' | 'out'
) {
  switch (preset) {
    case 'fadeIn':
      return radarFadeAnimation(animationType);
    case 'clipIn':
    case 'grow':
    default:
      return radarGrowAnimation(params, animationType);
  }
}

export const radarSymbolMoveAnimation = (params: IRadarAnimationParams, animationType: 'in' | 'out') => {
  const xFrom = () => params.center()?.x;
  const xTo = (datum: Datum, element: IElement) => element.getGraphicAttribute('x');
  const yFrom = () => params.center()?.y;
  const yTo = (datum: Datum, element: IElement) => element.getGraphicAttribute('y');
  if (animationType === 'in') {
    return {
      channel: {
        x: { from: xFrom, to: xTo },
        y: { from: yFrom, to: yTo }
      }
    };
  }
  return {
    channel: {
      x: { from: xTo, to: xFrom },
      y: { from: yTo, to: yFrom }
    }
  };
};

export function radarSymbolPresetAnimation(
  params: IRadarAnimationParams,
  preset: RadarAppearPreset,
  animationType: 'in' | 'out'
) {
  switch (preset) {
    case 'fadeIn':
      return radarFadeAnimation(animationType);
    case 'clipIn':
    case 'grow':
    default:
      return radarSymbolMoveAnimation(params, animationType);
  }
}

export const radarGroupClipAnimation = (
  params: IRadarAnimationParams,
  animationType: 'in' | 'out'
): IAnimationTypeConfig => {
  return {
    custom: ClipAngleAnimate,
    customParameters: (datum: any, element: IElement) => {
      return {
        group: element.getGraphicItem(),
        startAngle: params.startAngle ?? Math.PI / 2,
        orient: 'clockwise',
        center: params.center(),
        radius: params.radius(),
        animationType
      };
    }
  };
};
