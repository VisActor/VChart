import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import { Factory } from '../../core/factory';

export type VennMark = 'circle' | 'overlap';

export type VennAppearPreset = 'growIn' | 'fadeIn';

export const vennPresetAnimation = (preset: VennAppearPreset): IAnimationTypeConfig => {
  switch (preset) {
    case 'fadeIn': {
      return {
        type: 'fadeIn'
      };
    }
    case 'growIn': {
      return {
        type: 'growCenterIn'
      };
    }
    default: {
      return {
        type: 'growCenterIn'
      };
    }
  }
};
export const registerVennAnimation = () => {
  Factory.registerAnimation('venn', (params: unknown, preset: VennAppearPreset) => {
    return {
      appear: vennPresetAnimation(preset),
      enter: { type: 'growCenterIn' },
      exit: { type: 'growCenterOut' },
      disappear: { type: 'growCenterOut' }
    };
  });
};
