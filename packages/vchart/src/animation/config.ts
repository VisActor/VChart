/* eslint-disable no-duplicate-imports */
import type { IGraphic } from '@visactor/vrender-core';
import {
  TagPointsUpdate,
  ClipDirectionAnimate,
  AnimateExecutor,
  ScaleIn,
  ScaleOut,
  FadeIn,
  FadeOut,
  MoveIn,
  MoveOut,
  RotateIn,
  RotateOut,
  Update,
  State,
  GrowHeightIn,
  GrowHeightOut,
  GrowWidthIn,
  GrowWidthOut,
  GrowCenterIn,
  GrowCenterOut,
  GrowRadiusIn,
  GrowRadiusOut,
  GrowAngleIn,
  GrowAngleOut,
  GrowPointsIn,
  GrowPointsOut,
  GrowPointsXIn,
  GrowPointsXOut,
  GrowPointsYIn,
  GrowPointsYOut,
  ClipIn,
  ClipOut,
  FromTo
} from '@visactor/vrender-animate';

import {
  Pixelation,
  GaussianBlur,
  ParticleDisintegrationRefactor,
  DistortionDisintegrationRefactor,
  GlitchDisintegrationRefactor,
  GrayscaleDisintegrationRefactor,
  DissolveRefactor
} from './disappear';

import type { ILineAnimationParams, LineAppearPreset } from '../series/line/interface';
import { linePresetAnimation } from '../series/line/animation';
import type { MarkAnimationSpec, ICartesianGroupAnimationParams } from './interface';
import { Factory } from '../core/factory';
import { Direction } from '../typings/space';

export const DEFAULT_ANIMATION_CONFIG = {
  appear: {
    duration: 1000,
    easing: 'cubicOut'
  },
  update: {
    type: 'update',
    duration: 300,
    easing: 'linear'
  },
  enter: {
    duration: 300,
    easing: 'linear'
  },
  exit: {
    duration: 300,
    easing: 'linear'
  },
  disappear: {
    duration: 500,
    easing: 'cubicIn'
  },
  state: {
    duration: 300,
    easing: 'linear'
  }
};

export const ScaleInOutAnimation = {
  appear: { type: 'scaleIn' },
  enter: { type: 'scaleIn' },
  exit: { type: 'scaleOut' },
  disappear: { type: 'scaleOut' }
};

export const FadeInOutAnimation = {
  appear: { type: 'fadeIn' },
  enter: { type: 'fadeIn' },
  exit: { type: 'fadeOut' },
  disappear: { type: 'fadeOut' }
};

export const registerScaleInOutAnimation = () => {
  Factory.registerAnimation('scaleInOut', () => ScaleInOutAnimation);
};

export const registerFadeInOutAnimation = () => {
  Factory.registerAnimation('fadeInOut', () => FadeInOutAnimation);
};

export const registerCartesianGroupClipAnimation = () => {
  Factory.registerAnimation('cartesianGroupClip', (params?: ICartesianGroupAnimationParams) => {
    return {
      appear: {
        custom: ClipDirectionAnimate,
        customParameters: (datum: any, g: IGraphic) => {
          return {
            animationType: 'in',
            group: g,
            direction: params.direction(),
            width: params.width(),
            height: params.height(),
            orient: params.orient()
          };
        }
      },
      disappear: {
        custom: ClipDirectionAnimate,
        customParameters: (datum: any, g: IGraphic) => {
          return {
            animationType: 'out',
            group: g,
            direction: params.direction(),
            width: params.width(),
            height: params.height(),
            orient: params.orient()
          };
        }
      }
    };
  });
};

const lineOrAreaAnimation = (params: ILineAnimationParams, preset: LineAppearPreset) => {
  return {
    appear: linePresetAnimation(params, preset),
    enter: { type: 'fadeIn' },
    exit: { type: 'fadeOut' },
    update: [
      {
        type: 'update',
        options: { excludeChannels: ['points', 'defined', 'segments'] }
      },
      {
        channel: ['points', 'segments'],
        custom: TagPointsUpdate,
        duration: DEFAULT_ANIMATION_CONFIG.update.duration,
        easing: DEFAULT_ANIMATION_CONFIG.update.easing,
        customParameters: {
          clipRangeByDimension: params.direction === Direction.horizontal ? 'y' : 'x'
        }
      }
    ],
    disappear: { type: 'clipOut' }
  } as MarkAnimationSpec;
};

export const registerLineAnimation = () => {
  Factory.registerAnimation('line', lineOrAreaAnimation);
};

export const registerAreaAnimation = () => {
  Factory.registerAnimation('area', lineOrAreaAnimation);
};

export const registerBuiltInAnimation = () => {
  AnimateExecutor.registerBuiltInAnimate('scaleIn', ScaleIn);
  AnimateExecutor.registerBuiltInAnimate('scaleOut', ScaleOut);
  AnimateExecutor.registerBuiltInAnimate('fadeIn', FadeIn);
  AnimateExecutor.registerBuiltInAnimate('fadeOut', FadeOut);
  AnimateExecutor.registerBuiltInAnimate('moveIn', MoveIn);
  AnimateExecutor.registerBuiltInAnimate('moveOut', MoveOut);
  AnimateExecutor.registerBuiltInAnimate('rotateIn', RotateIn);
  AnimateExecutor.registerBuiltInAnimate('rotateOut', RotateOut);
  AnimateExecutor.registerBuiltInAnimate('update', Update);
  AnimateExecutor.registerBuiltInAnimate('state', State);
  AnimateExecutor.registerBuiltInAnimate('fromTo', FromTo);
};

export const registerRectAnimation = () => {
  AnimateExecutor.registerBuiltInAnimate('growHeightIn', GrowHeightIn);
  AnimateExecutor.registerBuiltInAnimate('growHeightOut', GrowHeightOut);
  AnimateExecutor.registerBuiltInAnimate('growWidthIn', GrowWidthIn);
  AnimateExecutor.registerBuiltInAnimate('growWidthOut', GrowWidthOut);
  AnimateExecutor.registerBuiltInAnimate('growCenterIn', GrowCenterIn);
  AnimateExecutor.registerBuiltInAnimate('growCenterOut', GrowCenterOut);
};

export const registerArcAnimation = () => {
  AnimateExecutor.registerBuiltInAnimate('growRadiusIn', GrowRadiusIn);
  AnimateExecutor.registerBuiltInAnimate('growRadiusOut', GrowRadiusOut);
  AnimateExecutor.registerBuiltInAnimate('growAngleIn', GrowAngleIn);
  AnimateExecutor.registerBuiltInAnimate('growAngleOut', GrowAngleOut);
};

export const registerLineOrAreaAnimation = () => {
  AnimateExecutor.registerBuiltInAnimate('growPointsIn', GrowPointsIn);
  AnimateExecutor.registerBuiltInAnimate('growPointsOut', GrowPointsOut);
  AnimateExecutor.registerBuiltInAnimate('growPointsXIn', GrowPointsXIn);
  AnimateExecutor.registerBuiltInAnimate('growPointsXOut', GrowPointsXOut);
  AnimateExecutor.registerBuiltInAnimate('growPointsYIn', GrowPointsYIn);
  AnimateExecutor.registerBuiltInAnimate('growPointsYOut', GrowPointsYOut);
  AnimateExecutor.registerBuiltInAnimate('clipIn', ClipIn);
  AnimateExecutor.registerBuiltInAnimate('clipOut', ClipOut);
};

export const registerPolygonAnimation = () => {
  AnimateExecutor.registerBuiltInAnimate('growPointsOut', GrowPointsOut);
};

export const registerDisappearAnimation = () => {
  AnimateExecutor.registerBuiltInAnimate('distortion', DistortionDisintegrationRefactor);
  // AnimateExecutor.registerBuiltInAnimate('particle', ParticleDisintegration);
  AnimateExecutor.registerBuiltInAnimate('pixelation', Pixelation);
  AnimateExecutor.registerBuiltInAnimate('gaussianBlur', GaussianBlur);
  AnimateExecutor.registerBuiltInAnimate('glitch', GlitchDisintegrationRefactor);
  AnimateExecutor.registerBuiltInAnimate('grayscale', GrayscaleDisintegrationRefactor);
  AnimateExecutor.registerBuiltInAnimate('dissolve', DissolveRefactor);
  AnimateExecutor.registerBuiltInAnimate('particle', ParticleDisintegrationRefactor);
};
