import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';

export type TreemapMark = 'leaf' | 'nonLeaf';

export type TreemapAppearPreset = 'growIn' | 'fadeIn';

export const scatterPresetAnimation = (preset: TreemapAppearPreset): IAnimationTypeConfig => {
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
