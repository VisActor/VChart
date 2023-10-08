import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';

export type CorrelationMarks = 'point' | 'label';

export type CorrelationAppearPreset = 'scaleIn' | 'fadeIn';

export interface ICorrelationAnimationParams {
  [key: string]: object;
}

export const correlationPresetAnimation = (
  _params: ICorrelationAnimationParams, // 此处仅为保持结构统一
  preset: CorrelationAppearPreset
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
