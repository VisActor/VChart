import VChart from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';

interface ArcAppearOption {
  disappear: boolean;
  index: number;
}

// 将payload转换为chart内置的动画type
export const transformArcAppear = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: ArcAppearOption
) => {
  switch (animation.effect) {
    case 'grow': {
      return arcGrowRadius(instance, animation, option);
    }
    case 'growRadius': {
      return arcGrowRadius(instance, animation, option);
    }
    case 'growAngle': {
      return arcGrowAngle(instance, animation, option);
    }
    case 'fade': {
      return arcFade(instance, animation, option);
    }
    default: {
      return arcFade(instance, animation, option);
    }
  }
};

const arcGrowRadius = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: ArcAppearOption
) => {
  const { duration, loop, oneByOne, easing } = animation;
  const { disappear } = option;
  const type = disappear ? 'growRadiusOut' : 'growRadiusIn';

  return {
    type,
    duration,
    loop,
    oneByOne,
    easing
  };
};

const arcGrowAngle = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: ArcAppearOption
) => {
  const { duration, loop, oneByOne, easing } = animation;
  const { disappear } = option;
  const type = disappear ? 'growAngleOut' : 'growAngleIn';

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
