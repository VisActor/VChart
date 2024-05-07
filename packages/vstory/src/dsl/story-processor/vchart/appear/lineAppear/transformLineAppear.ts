import VChart from '@visactor/vchart';
import { getAllSeriesMarksWithoutRoot } from '../../../../../util/vchart-api';
import { IChartAppearAction } from '../../../../types/chart/appear';

// 将payload转换为chart内置的动画type
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
  }
};

const lineGrow = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: { markIndex: number; disappear: boolean }
) => {
  const { duration, loop, oneByOne, easing } = animation;
  const { markIndex, disappear } = option;
  const type = disappear ? 'clipOut' : 'clipIn';
  if (oneByOne) {
    // 使用delay模拟线逐个出现
    return {
      type: type,
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
    type: type,
    duration,
    loop,
    oneByOne: false,
    easing
  };
};

const lineFade = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: { markIndex: number; disappear: boolean }
) => {
  const { duration, loop, oneByOne, easing } = animation;
  const { markIndex, disappear } = option;
  const type = disappear ? 'fadeOut' : 'fadeIn';
  if (oneByOne) {
    // 使用delay模拟线逐个出现
    return {
      type,
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
    type,
    duration,
    loop,
    oneByOne: false,
    easing
  };
};
