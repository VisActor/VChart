/* eslint-disable no-duplicate-imports */
import { TagPointsUpdate, ClipDirectionAnimate } from '@visactor/vrender-core';
import type { IElement } from '@visactor/vgrammar-core';
import type { ILineAnimationParams, LineAppearPreset } from '../series/line/animation';
import { linePresetAnimation } from '../series/line/animation';
import type { MarkAnimationSpec, ICartesianGroupAnimationParams } from './interface';
import { Factory } from '../core/factory';
import {
  View,
  registerScaleInAnimation,
  registerScaleOutAnimation,
  registerFadeInAnimation,
  registerFadeOutAnimation,
  registerClipInAnimation,
  registerClipOutAnimation,
  registerGrowAngleInAnimation,
  registerGrowAngleOutAnimation,
  registerGrowCenterInAnimation,
  registerGrowCenterOutAnimation,
  registerGrowHeightInAnimation,
  registerGrowHeightOutAnimation,
  registerGrowPointsInAnimation,
  registerGrowPointsOutAnimation,
  registerGrowPointsXInAnimation,
  registerGrowPointsXOutAnimation,
  registerGrowPointsYInAnimation,
  registerGrowPointsYOutAnimation,
  registerGrowRadiusInAnimation,
  registerGrowRadiusOutAnimation,
  registerGrowWidthInAnimation,
  registerGrowWidthOutAnimation,
  registerMoveInAnimation,
  registerMoveOutAnimation,
  registerRotateInAnimation,
  registerRotateOutAnimation,
  registerUpdateAnimation
} from '@visactor/vgrammar-core';
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
        customParameters: (datum: any, element: IElement) => {
          return {
            animationType: 'in',
            group: element.getGraphicItem(),
            direction: params.direction(),
            width: params.width(),
            height: params.height(),
            orient: params.orient()
          };
        }
      },
      disappear: {
        custom: ClipDirectionAnimate,
        customParameters: (datum: any, element: IElement) => {
          return {
            animationType: 'out',
            group: element.getGraphicItem(),
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
        options: { excludeChannels: ['points', 'defined'] }
      },
      {
        channel: ['points'],
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

export const registerVGrammarCommonAnimation = () => {
  View.useRegisters([
    registerScaleInAnimation,
    registerScaleOutAnimation,
    registerFadeInAnimation,
    registerFadeOutAnimation,
    registerMoveInAnimation,
    registerMoveOutAnimation,
    registerRotateInAnimation,
    registerRotateOutAnimation,
    registerUpdateAnimation
  ]);
};

export const registerVGrammarRectAnimation = () => {
  View.useRegisters([
    registerGrowHeightInAnimation,
    registerGrowHeightOutAnimation,
    registerGrowWidthInAnimation,
    registerGrowWidthOutAnimation,
    registerGrowCenterInAnimation,
    registerGrowCenterOutAnimation
  ]);
};

export const registerVGrammarArcAnimation = () => {
  View.useRegisters([
    registerGrowRadiusInAnimation,
    registerGrowRadiusOutAnimation,
    registerGrowAngleInAnimation,
    registerGrowAngleOutAnimation
  ]);
};

export const registerVGrammarLineOrAreaAnimation = () => {
  View.useRegisters([
    registerGrowPointsInAnimation,
    registerGrowPointsOutAnimation,
    registerGrowPointsXInAnimation,
    registerGrowPointsXOutAnimation,
    registerGrowPointsYInAnimation,
    registerGrowPointsYOutAnimation,
    registerClipInAnimation,
    registerClipOutAnimation
  ]);
};

export const registerVGrammarPolygonAnimation = () => {
  View.useRegisters([registerGrowPointsInAnimation, registerGrowPointsOutAnimation]);
};
