import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { DirectionType } from '../../typings';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../typings/space';
import { Factory } from '../../core/factory';
import { FadeInOutAnimation } from '../../animation/config';

export type SankeyMark = 'node' | 'link' | 'label';

export type SankeyAppearPreset = 'growIn' | 'fadeIn';

export interface ISankeyAnimationParams {
  direction: DirectionType;
  growFrom: () => number;
}

export const sankeyGrowIn = (params: ISankeyAnimationParams, isOverall: boolean = true): IAnimationTypeConfig => {
  return {
    type: params.direction === Direction.horizontal ? 'growWidthIn' : 'growHeightIn',
    options: {
      overall: isOverall ? params.growFrom() : isOverall,
      orient: Direction.horizontal ? 'positive' : 'negative'
    }
  };
};

export const sankeyGrowOut = (params: ISankeyAnimationParams, isOverall: boolean = true): IAnimationTypeConfig => {
  return {
    type: params.direction === Direction.horizontal ? 'growWidthOut' : 'growHeightOut',
    options: {
      overall: isOverall ? params.growFrom() : isOverall,
      orient: Direction.horizontal ? 'positive' : 'negative'
    }
  };
};

export const sankeyNodePresetAnimation = (
  params: ISankeyAnimationParams,
  preset: SankeyAppearPreset
): IAnimationTypeConfig => {
  switch (preset) {
    case 'fadeIn': {
      return {
        type: 'fadeIn'
      };
    }
    case 'growIn': {
      return sankeyGrowIn(params);
    }
    default: {
      return sankeyGrowIn(params);
    }
  }
};

export const sankeyLinkPresetAnimation = (preset: SankeyAppearPreset): IAnimationTypeConfig => {
  switch (preset) {
    case 'fadeIn': {
      return {
        type: 'fadeIn'
      };
    }
    case 'growIn': {
      return { type: 'linkPathGrowIn' };
    }
    default: {
      return { type: 'linkPathGrowIn' };
    }
  }
};

export const registerSankeyAnimation = () => {
  Factory.registerAnimation('sankeyNode', (params: ISankeyAnimationParams, preset: SankeyAppearPreset) => ({
    appear: sankeyNodePresetAnimation(params, preset),
    ...FadeInOutAnimation
  }));
  Factory.registerAnimation('sankeyLinkPath', (params: unknown, preset: SankeyAppearPreset) => ({
    appear: sankeyLinkPresetAnimation(preset),
    enter: { type: 'linkPathGrowIn' },
    exit: { type: 'linkPathGrowOut' },
    disappear: { type: 'linkPathGrowOut' }
  }));
};
