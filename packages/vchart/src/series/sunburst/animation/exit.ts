import type { IAnimationTypeConfig, IElement } from '@visactor/vgrammar';
import type { ISunburstAnimationParams } from './interface';
import type { Datum } from '../../../typings';
import { computeRatio, getInnerMostElements } from './utils';

const computeInnerAngleRange = (elements: IElement[]): [number, number] => {
  const minStartAngle = Math.min(...elements.map(m => m.getGraphicAttribute('startAngle', false)));
  const maxEndAngle = Math.max(...elements.map(m => m.getGraphicAttribute('endAngle', false)));
  return [minStartAngle, maxEndAngle];
};

export const sunburstExit = (params: ISunburstAnimationParams): IAnimationTypeConfig => {
  return {
    channel: {
      startAngle: {
        from: (_d: Datum, element: IElement) => element.getGraphicAttribute('startAngle', false),
        to: (_d: Datum, element: IElement) => {
          const { startAngle, endAngle } = params.animationInfo();
          // 得到最内层的elements.
          const innerElements = getInnerMostElements(element);
          // 计算range
          const range = computeInnerAngleRange(innerElements);
          // 计算比例
          const ratio = computeRatio(element.getGraphicAttribute('startAngle', false), range);
          return ratio * (endAngle - startAngle) + startAngle;
        }
      },
      endAngle: {
        from: (_d: Datum, element: IElement) => element.getGraphicAttribute('endAngle', false),
        to: (_d: Datum, element: IElement) => {
          const { startAngle, endAngle } = params.animationInfo();
          // 得到最内层的elements.
          const innerElements = getInnerMostElements(element);
          // 计算range
          const range = computeInnerAngleRange(innerElements);
          // 计算比例
          const ratio = computeRatio(element.getGraphicAttribute('endAngle', false), range);
          return ratio * (endAngle - startAngle) + startAngle;
        }
      },
      outerRadius: {
        from: (_d: Datum, element: IElement) => element.getGraphicAttribute('outerRadius', false),
        to: () => params.animationInfo().innerRadius
      },
      innerRadius: {
        from: (_d: Datum, element: IElement) => element.getGraphicAttribute('innerRadius', false),
        to: () => params.animationInfo().innerRadius
      }
    }
  };
};
