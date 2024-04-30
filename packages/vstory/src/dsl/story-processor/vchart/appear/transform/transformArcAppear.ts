import VChart from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/Appear';

// 将payload转换为chart内置的动画type
export const transformArcAppear = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  index: number
) => {
  switch (animation.effect) {
    case 'grow': {
      return arcGrowRadius(instance, animation, index);
    }
    case 'growRadius': {
      return arcGrowRadius(instance, animation, index);
    }
    case 'growAngle': {
      return arcGrowAngle(instance, animation, index);
    }
    case 'fade': {
      return arcFade(instance, animation, index);
    }
  }
};

const arcGrowRadius = (instance: VChart, animation: IChartAppearAction['payload']['animation'], index: number) => {
  const { duration, loop, oneByOne, easing } = animation;

  return {
    type: 'growRadiusIn',
    duration,
    loop,
    oneByOne,
    easing
  };
};

const arcGrowAngle = (instance: VChart, animation: IChartAppearAction['payload']['animation'], index: number) => {
  const { duration, loop, oneByOne, easing } = animation;

  return {
    type: 'growAngleIn',
    duration,
    loop,
    oneByOne,
    easing
  };
};

const arcFade = (instance: VChart, animation: IChartAppearAction['payload']['animation'], index: number) => {
  const { duration, loop, oneByOne, easing } = animation;

  return {
    type: 'fadeIn',
    duration,
    loop,
    oneByOne,
    easing
  };
};
