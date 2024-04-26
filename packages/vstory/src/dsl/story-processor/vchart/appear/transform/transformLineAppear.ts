import VChart from '@visactor/vchart';
import { AppearAction } from '../../../../types/Appear';
import { getAllSeriesMarksWithoutRoot } from '../../../../../util/vchart-api';

// 将payload转换为chart内置的动画type
export const transformLineAppear = (
  instance: VChart,
  animation: AppearAction['payload']['animation'],
  markIndex: number
) => {
  switch (animation.effect) {
    case 'grow': {
      return lineGrow(instance, animation, markIndex);
    }
    case 'fade': {
      return lineFade(instance, animation, markIndex);
    }
  }
};

const lineGrow = (instance: VChart, animation: AppearAction['payload']['animation'], markIndex: number) => {
  const { duration, loop, oneByOne, easing } = animation;

  if (oneByOne) {
    // 使用delay模拟线逐个出现
    return {
      type: 'clipIn',
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
    type: 'clipIn',
    duration,
    loop,
    oneByOne: false,
    easing
  };
};

const lineFade = (instance: VChart, animation: AppearAction['payload']['animation'], markIndex: number) => {
  const { duration, loop, oneByOne, easing } = animation;

  if (oneByOne) {
    // 使用delay模拟线逐个出现
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
    oneByOne: false,
    easing
  };
};
