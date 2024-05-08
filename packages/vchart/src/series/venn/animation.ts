import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import { Factory } from '../../core/factory';
import { VennOverlapAnimation } from '@visactor/vgrammar-venn';

export type VennMark = 'circle' | 'overlap';

export type VennAppearPreset = 'growIn' | 'fadeIn' | 'scaleIn';

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
      update: { custom: VennOverlapAnimation },
      enter: { type: 'fadeIn' },
      exit: { type: 'fadeOut' },
      disappear: { type: 'fadeOut' }
    };
  });
};
