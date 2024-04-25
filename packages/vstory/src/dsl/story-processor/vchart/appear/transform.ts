import VChart from '@visactor/vchart';
import { AppearAction } from '../../../types/Appear';
import { IOrientType } from '@visactor/vchart/src/typings';

// 将payload转换为chart内置的动画type
export const transformAppearAnimation = (instance: VChart, animation: AppearAction['payload']['animation']) => {
  switch (animation.effect) {
    case 'grow': {
      return barGrow(instance, animation);
    }
    case 'fade': {
      return barFade(instance, animation);
    }
    case 'bounce': {
      return barBounce(instance, animation);
    }
  }
};

export function isXAxis(orient: IOrientType) {
  return orient === 'bottom' || orient === 'top';
}

export function isYAxis(orient: IOrientType) {
  return orient === 'left' || orient === 'right';
}

export const getXYAxis = (instance: VChart) => {
  const axes = instance.getChart().getComponentsByKey('axes');
  const xAxis = axes.find(axis => {
    const orient = axis.getOrient();
    if (isXAxis(orient)) {
      return true;
    }
  });
  const yAxis = axes.find(axis => {
    const orient = axis.getOrient();
    if (isYAxis(orient)) {
      return true;
    }
  });

  return [xAxis, yAxis];
};

const barGrow = (instance: VChart, animation: AppearAction['payload']['animation']) => {
  const { duration, loop, oneByOne, easing } = animation;

  const direction = instance.getChart().getSpec().direction ?? 'vertical';
  const xField = instance.getChart().getSpec().xField;
  const yField = instance.getChart().getSpec().yField;
  const [xAxis, yAxis] = getXYAxis(instance);

  return {
    type: 'growHeightIn',
    duration,
    loop,
    oneByOne,
    easing,
    options: (datum: any, element: any, params: any) => {
      console.log('debug instance', instance);
      const field = direction === 'vertical' ? yField : xField;
      const data = datum?.[field];

      if (direction === 'vertical') {
        return {
          overall: yAxis?.getScale(0).scale(0),
          orient: data > 0 ? 'negative' : 'positive'
        };
      } else {
        return {
          overall: xAxis?.getScale(0).scale(0),
          orient: data > 0 ? 'negative' : 'positive'
        };
      }
    }
  };
};

const barFade = (instance: VChart, animation: AppearAction['payload']['animation']) => {
  const { duration, loop, oneByOne, easing } = animation;

  return {
    type: 'fadeIn',
    duration,
    loop,
    oneByOne,
    easing
  };
};

const barBounce = (instance: VChart, animation: AppearAction['payload']['animation']) => {};
