import VChart from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';

interface ArcAppearOption {
  disappear: boolean;
  index: number;
}

// 将payload转换为chart内置的动画type
export const transformTextAppear = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: ArcAppearOption
) => {
  switch (animation.effect) {
    case 'grow': {
      return textGrow(instance, animation, option);
    }
    case 'fade': {
      return textFade(instance, animation, option);
    }
    default: {
      return textFade(instance, animation, option);
    }
  }
};

const textGrow = (instance: VChart, animation: IChartAppearAction['payload']['animation'], option: ArcAppearOption) => {
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

const textFade = (instance: VChart, animation: IChartAppearAction['payload']['animation'], option: ArcAppearOption) => {
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
