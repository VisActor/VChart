import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import { Factory } from '../../core/factory';

export type CirclePackingMark = 'leaf' | 'nonLeaf' | 'label' | 'nonLeafLabel';

export type CirclePackingAppearPreset = 'growIn' | 'fadeIn';

export const circlePackingPresetAnimation = (preset: CirclePackingAppearPreset): IAnimationTypeConfig => {
  switch (preset) {
    case 'fadeIn': {
      return {
        type: 'fadeIn'
      };
    }

    default: {
      return {
        type: 'growRadiusIn'
      };
    }
  }
};

export const registerCirclePackingAnimation = () => {
  Factory.registerAnimation('circlePacking', (parmas: unknown, preset: CirclePackingAppearPreset) => ({
    appear: circlePackingPresetAnimation(preset),
    enter: { type: 'growRadiusIn' },
    exit: { type: 'growRadiusOut' },
    disappear: { type: 'growRadiusOut' }
  }));
};
