import { IGraphic } from '@visactor/vrender-core';
import { AppearAction } from '../../types/Appear';
import { IElement } from '../../../story/element';

export const rectAppearProcessor = async (element: IElement, appearAction: AppearAction) => {
  const { animation } = appearAction.payload;
  if (animation.effect === 'fadeIn') {
    (element as any).graphic._graphic.animate().from({ opacity: 0 }, animation.duration, animation.easing);
    (element as any).text._graphic.animate().from({ opacity: 0 }, animation.duration, animation.easing);
  }
};
