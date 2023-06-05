import type { IAnimationTypeConfig } from '@visactor/vgrammar';

export type CirclePackingMark = 'leaf' | 'nonLeaf' | 'label' | 'nonLeafLabel';

export type CirclePackingAppearPreset = 'growIn' | 'fadeIn';

export interface ICirclePackingAnimationParams {
  [key: string]: object;
}

export const circlePackingPresetAnimation = (
  _params: ICirclePackingAnimationParams, // 此处仅为保持结构统一
  preset: CirclePackingAppearPreset
): IAnimationTypeConfig => {
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
