import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import { Factory } from '../../core/factory';

export interface ILiquidAnimationParams {
  height: {
    from: () => number | number;
    to: () => number | number;
  };
  y: {
    from: () => number | number;
    to: () => number | number;
  };
}

export type LiquidAppearPreset = 'wave' | 'grow' | 'waveGrow';

const Appear_Wave: IAnimationTypeConfig = {
  duration: 2000,
  loop: true,
  channel: {
    wave: { from: 0, to: 1 }
  }
};

const Appear_Grow = (params: ILiquidAnimationParams): IAnimationTypeConfig => {
  return {
    duration: 2000,
    channel: {
      wave: { from: 0, to: 1 },
      height: params.height,
      y: params.y
    }
  };
};

const Appear_WaveGrow = (params: ILiquidAnimationParams): IAnimationTypeConfig => {
  return {
    duration: 2000,
    channel: {
      wave: { from: 0, to: 1 },
      height: params.height,
      y: params.y
    }
  };
};

export function liquidPresetAnimation(
  params: ILiquidAnimationParams,
  preset: LiquidAppearPreset
): IAnimationTypeConfig {
  switch (preset) {
    case 'wave':
      return Appear_Wave;
    case 'grow':
      return Appear_Grow(params);
    case 'waveGrow':
      return Appear_WaveGrow(params);
    default:
      return Appear_Wave;
  }
}

export const registerLiquidAnimation = () => {
  Factory.registerAnimation('liquid', (params: ILiquidAnimationParams, preset: LiquidAppearPreset) => {
    return {
      appear: liquidPresetAnimation(params, preset),
      enter: liquidPresetAnimation(params, preset),
      exit: liquidPresetAnimation(params, preset)
    };
  });
};
