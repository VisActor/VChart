import type { Datum, IAnimationTypeConfig, IElement, MarkAnimationSpec } from '@visactor/vgrammar-core';
import type { IPoint, Maybe } from '../../typings';
import { ClipAngleAnimate } from '@visactor/vrender-core';
import type { IPolarAxisHelper } from '../../component/axis';
import { Factory } from '../../core/factory';
import { PolarPointUpdate, PolarTagPointsUpdate } from '../polar/animation';
import { DEFAULT_ANIMATION_CONFIG } from '../../animation/config';

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

export const registerRadarAnimation = () => {
  Factory.registerAnimation('radar', (params: IRadarAnimationParams, preset: RadarAppearPreset) => {
    return {
      appear: preset === 'clipIn' ? undefined : radarPresetAnimation(params, preset, 'in'),
      enter: radarPresetAnimation(params, preset, 'in'),
      exit: radarPresetAnimation(params, preset, 'out'),
      disappear: preset === 'clipIn' ? undefined : radarPresetAnimation(params, preset, 'out'),
      update: [
        {
          options: { excludeChannels: 'points' }
        },
        {
          channel: ['points'],
          custom: PolarTagPointsUpdate,
          customParameters: params,
          duration: DEFAULT_ANIMATION_CONFIG.update.duration,
          easing: DEFAULT_ANIMATION_CONFIG.update.easing
        }
      ]
    } as MarkAnimationSpec;
  });
  Factory.registerAnimation(
    'radarSymbol',
    (params: IRadarAnimationParams, preset: RadarAppearPreset) =>
      ({
        appear: preset === 'clipIn' ? undefined : radarSymbolPresetAnimation(params, preset, 'in'),
        enter: { type: 'scaleIn' },
        exit: { type: 'scaleOut' },
        disappear: preset === 'clipIn' ? undefined : radarSymbolPresetAnimation(params, preset, 'out'),
        update: [
          {
            options: { excludeChannels: ['x', 'y'] }
          },
          {
            channel: ['x', 'y'],
            custom: PolarPointUpdate,
            customParameters: params,
            duration: DEFAULT_ANIMATION_CONFIG.update.duration,
            easing: DEFAULT_ANIMATION_CONFIG.update.easing
          }
        ]
      } as MarkAnimationSpec)
  );
  Factory.registerAnimation('radarGroup', (params: IRadarAnimationParams, preset: RadarAppearPreset) => {
    return {
      appear: radarGroupClipAnimation(params, 'in'),
      disappear: radarGroupClipAnimation(params, 'out')
    };
  });
};
