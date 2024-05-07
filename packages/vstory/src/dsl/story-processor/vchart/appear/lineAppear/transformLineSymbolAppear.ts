import VChart from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';

export const transformLineSymbolAppear = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: { markIndex: number; disappear: boolean }
) => {
  switch (animation.effect) {
    case 'grow': {
      return symbolGrow(instance, animation, option);
    }
    case 'fade': {
      return symbolFade(instance, animation, option);
    }
  }
};

const symbolGrow = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: { markIndex: number; disappear: boolean }
) => {
  const { duration, loop, oneByOne, easing } = animation;
  const { markIndex, disappear } = option;

  if (oneByOne === true) {
    return {
      type: disappear ? 'scaleOut' : 'scaleIn',
      duration,
      loop,
      oneByOne: false,
      easing,
      delay: () => {
        return markIndex * Number(duration);
      }
    };
  }

  return {
    type: 'scaleIn',
    duration,
    loop,
    oneByOne,
    easing
  };
};

const symbolFade = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: { markIndex: number; disappear: boolean }
) => {
  const { duration, loop, oneByOne, easing } = animation;
  const { markIndex, disappear } = option;

  if (oneByOne === true) {
    return {
      type: disappear ? 'fadeOut' : 'fadeIn',
      duration,
      loop,
      oneByOne: false,
      easing,
      delay: () => {
        return markIndex * Number(duration);
      }
    };
  }

  return {
    type: 'fadeIn',
    duration,
    loop,
    oneByOne,
    easing
  };
};
