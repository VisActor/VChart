import VChart from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';

interface ArcAppearOption {
  disappear: boolean;
  index: number;
}

// 将payload转换为chart内置的动画type
export const transformRectAppear = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: ArcAppearOption
) => {
  switch (animation.effect) {
    case 'grow': {
      return rectGrowRadius(instance, animation, option);
    }
    case 'fade': {
      return arcFade(instance, animation, option);
    }
    default: {
      return arcFade(instance, animation, option);
    }
  }
};

const rectGrowRadius = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: ArcAppearOption
) => {
  const { duration, loop, oneByOne, easing } = animation;
  const { disappear } = option;
  const type = disappear ? 'growCenterOut' : 'growCenterIn';

  return {
    type,
    duration,
    loop,
    oneByOne,
    easing
  };
};

const arcFade = (instance: VChart, animation: IChartAppearAction['payload']['animation'], option: ArcAppearOption) => {
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
