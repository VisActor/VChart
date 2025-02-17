import type { ISunburstAnimationParams } from './interface';
import type { Datum } from '../../../typings';
import { computeRatio, getInnerMostElements } from './utils';
import { isEmpty, maxInArray, minInArray } from '@visactor/vutils';
import type { IAnimationTypeConfig } from '../../../animation/interface';
import type { IGraphic } from '@visactor/vrender-core';

const computeInnerAngleRange = (elements: IGraphic[], startAngle: number, endAngle: number): [number, number] => {
  // 处理enter时从无到有的case, 例如图例.
  if (isEmpty(elements)) {
    return [startAngle, endAngle];
  }

  const minStartAngle = minInArray(elements.map(m => m.getGraphicAttribute('startAngle', false) * 1));
  const maxEndAngle = maxInArray(elements.map(m => m.getGraphicAttribute('endAngle', false) * 1));
  return [minStartAngle, maxEndAngle];
};

export const sunburstEnter = (params: ISunburstAnimationParams): IAnimationTypeConfig => {
  return {
    channel: {
      startAngle: {
        from: (d: Datum, element: IGraphic) => {
          const { startAngle, endAngle } = params.animationInfo();
          // 得到最内层的elements.
          const innerElements = getInnerMostElements(element);
          // 计算间距
          const angleRange = computeInnerAngleRange(innerElements, startAngle, endAngle);
          // 计算比例
          const ratio = computeRatio(d.startAngle, angleRange);
          return ratio * (endAngle - startAngle) + startAngle;
        },
        to: (d: Datum) => d.startAngle
      },
      endAngle: {
        from: (d: Datum, element: IGraphic) => {
          const { startAngle, endAngle } = params.animationInfo();
          // 得到最内层的elements.
          const innerElements = getInnerMostElements(element);
          // 计算间距
          const angleRange = computeInnerAngleRange(innerElements, startAngle, endAngle);
          // 计算比例
          const ratio = computeRatio(d.endAngle, angleRange);
          return ratio * (endAngle - startAngle) + startAngle;
        },
        to: (d: Datum) => d.endAngle
      },
      outerRadius: {
        from: (d: Datum) => d.innerRadius,
        to: (d: Datum) => d.outerRadius
      },
      innerRadius: {
        from: (d: Datum) => d.innerRadius,
        to: (d: Datum) => d.innerRadius
      }
    }
  };
};
