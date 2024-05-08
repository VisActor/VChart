import VChart from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';

export const transformLineAppear = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: { markIndex: number; disappear: boolean }
) => {
  switch (animation.effect) {
    case 'grow': {
      return lineGrow(instance, animation, option);
    }
    case 'fade': {
      return lineFade(instance, animation, option);
    }
    default: {
      return lineFade(instance, animation, option);
    }
  }
};

const lineGrow = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: { markIndex: number; disappear: boolean }
) => {
  const { duration, loop, oneByOne, easing } = animation;
  const { disappear } = option;

  const type = disappear ? 'clipOut' : 'clipIn';

  return {
    type,
    duration,
    loop,
    oneByOne,
    easing
  };
};

const lineFade = (
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
