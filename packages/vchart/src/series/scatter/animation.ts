import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';

export type ScatterMarks = 'point' | 'label';

export type ScatterAppearPreset = 'scaleIn' | 'fadeIn';

export interface IScatterAnimationParams {
  [key: string]: object;
}

export const scatterPresetAnimation = (
  _params: IScatterAnimationParams, // 此处仅为保持结构统一
  preset: ScatterAppearPreset
): IAnimationTypeConfig => {
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
        type: 'scaleIn'
      };
    }
  }
};
