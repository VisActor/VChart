import VChart from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';

export const transformSymbolAppear = (
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
    default: {
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
  const { disappear } = option;

  const type = disappear ? 'scaleOut' : 'scaleIn';

  return {
    type,
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
  const { disappear } = option;
  const type = disappear ? 'fadeOut' : 'fadeIn';

  return {
    type,
    duration,
    loop,
    oneByOne,
    easing
  };
};
