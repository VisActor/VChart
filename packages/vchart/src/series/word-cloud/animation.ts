import type { IAnimationTypeConfig, IElement } from '@visactor/vgrammar';
import { RotateBySphereAnimate } from '@visactor/vrender';
import { DEFAULT_ANIMATION_CONFIG } from '../../animation/config';

export interface IWordcloud3dAnimationParams {
  radius: number;
  depth_3d: number;
}

export interface IWordcloudAnimationParams {
  animationConfig: () => IAnimationTypeConfig;
}

export type WordcloudAppearPreset = 'scaleIn' | 'fadeIn';

export const WordCloud3dAnimation = (params: IWordcloud3dAnimationParams | (() => any)): IAnimationTypeConfig => {
  return {
    custom: RotateBySphereAnimate,
    customParameters: (datum: any, element: IElement) => {
      return params;
      // return { center: { x: params.radius, y: params.radius, z: params.depth_3d }, r: params.radius };
    },
    easing: 'linear',
    loop: Infinity,
    duration: 6000
  };
};

function computeWordDelay(duration: number, totalTime: number, wordCount: number) {
  if (duration * wordCount < totalTime) {
    return duration + (totalTime - wordCount * duration) / (wordCount - 1);
  }
  return (totalTime - duration) / (wordCount - 1);
}

export const WordCloudScaleInAnimation = (params: IWordcloudAnimationParams): IAnimationTypeConfig => {
  return {
    channel: {
      fontSize: {
        from: 0
      }
    },
    duration: 200,
    delay: (datum, element, vgrammarParams) => {
      const animationConfig = params.animationConfig();
      const duration = animationConfig?.duration || 200;
      const totalTime = animationConfig?.totalTime || DEFAULT_ANIMATION_CONFIG.appear.duration;
      const count = vgrammarParams.VGRAMMAR_ANIMATION_PARAMETERS.elementCount;
      const index = vgrammarParams.VGRAMMAR_ANIMATION_PARAMETERS.elementIndex;
      return index * computeWordDelay(duration as number, totalTime as number, count);
    }
  };
};

export function wordcloudPresetAnimation(
  params: IWordcloudAnimationParams,
  preset: WordcloudAppearPreset | boolean
): IAnimationTypeConfig {
  if (preset === false) {
    return {};
  }
  switch (preset) {
    case 'fadeIn':
      return { type: 'fadeIn' };
    case 'scaleIn':
    default:
      return WordCloudScaleInAnimation(params);
  }
}
