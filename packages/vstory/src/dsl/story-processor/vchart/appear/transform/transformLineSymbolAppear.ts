import VChart from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/Appear';

export const transformLineSymbolAppear = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  markIndex: number
) => {
  switch (animation.effect) {
    case 'grow': {
      return symbolGrow(instance, animation, markIndex);
    }
    case 'fade': {
      return symbolFade(instance, animation, markIndex);
    }
  }
};

const symbolGrow = (instance: VChart, animation: IChartAppearAction['payload']['animation'], markIndex: number) => {
  const { duration, loop, oneByOne, easing } = animation;

  if (oneByOne === true) {
    return {
      type: 'scaleIn',
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

const symbolFade = (instance: VChart, animation: IChartAppearAction['payload']['animation'], markIndex: number) => {
  const { duration, loop, oneByOne, easing } = animation;

  if (oneByOne === true) {
    return {
      type: 'fadeIn',
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
