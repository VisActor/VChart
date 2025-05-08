import type { VennAppearPreset } from './interface';
import type { IAnimationTypeConfig } from '../../animation/interface';
// import { ACustomAnimate } from '@visactor/vrender-animate';
import { Factory } from '../../core/factory';

export const vennCirclePresetAnimation = (preset: VennAppearPreset): IAnimationTypeConfig => {
  switch (preset) {
    case 'fadeIn': {
      return {
        type: 'fadeIn'
      };
    }
    case 'growIn': {
      return {
        type: 'growRadiusIn'
      };
    }
    case 'scaleIn': {
      return {
        type: 'scaleIn'
      };
    }
    default: {
      return {
        type: 'fadeIn'
      };
    }
  }
};

export const vennOverlapPresetAnimation = (preset: VennAppearPreset): IAnimationTypeConfig => {
  switch (preset) {
    case 'fadeIn': {
      return {
        type: 'fadeIn'
      };
    }
    case 'scaleIn': {
      return {
        type: 'scaleIn'
      };
    }
    default: {
      return {
        type: 'fadeIn'
      };
    }
  }
};

export const registerVennAnimation = () => {
  Factory.registerAnimation('vennCircle', (params: unknown, preset: VennAppearPreset) => {
    return {
      appear: vennCirclePresetAnimation(preset),
      enter: { type: 'growRadiusIn' },
      exit: { type: 'growRadiusOut' },
      disappear: { type: 'growRadiusOut' }
    };
  });
  Factory.registerAnimation('vennOverlap', (params: unknown, preset: VennAppearPreset) => {
    return {
      appear: vennOverlapPresetAnimation(preset),
      // update: { custom: VennOverlapAnimation }, // TODO: vgrammar 封装的动画，要更新依赖
      enter: { type: 'fadeIn' },
      exit: { type: 'fadeOut' },
      disappear: { type: 'fadeOut' }
    };
  });
};
