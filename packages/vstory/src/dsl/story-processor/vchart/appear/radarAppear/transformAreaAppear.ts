import VChart from '@visactor/vchart';
import { IOrientType } from '@visactor/vchart/src/typings';
import { IChartAppearAction } from '../../../../types/chart/appear';

interface AreaAppearOption {
  markIndex: number;
  disappear: boolean;
}

export const transformAreaAppear = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: AreaAppearOption
) => {
  switch (animation.effect) {
    case 'grow': {
      return areaGrow(instance, animation, option);
    }
    case 'fade': {
      return areaFade(instance, animation, option);
    }
    default: {
      return areaFade(instance, animation, option);
    }
  }
};

const areaGrow = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: AreaAppearOption
) => {
  const { duration, loop, oneByOne, easing } = animation;
  const { markIndex, disappear } = option;

  const type = disappear ? 'clipOut' : 'clipIn';

  return {
    type,
    duration,
    loop,
    oneByOne: false,
    easing
  };
};

const areaFade = (
  instance: VChart,
  animation: IChartAppearAction['payload']['animation'],
  option: AreaAppearOption
) => {
  const { duration, loop, oneByOne, easing } = animation;
  const { disappear } = option;

  const type = disappear ? 'fadeOut' : 'fadeIn';

  return {
    type: type,
    duration,
    loop,
    oneByOne,
    easing
  };
};
