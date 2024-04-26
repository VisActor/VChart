import { AppearAction } from '../../types/Appear';
import { IElement } from '../../../story/element';
import { commonAppearEffect } from './effect/appear';
import { getElementGraphic } from './util';

export const rectAppearProcessor = async (element: IElement, spec = {}, appearAction: AppearAction) => {
  const { animation } = appearAction.payload ?? {};
  const { effect } = animation;
  // if (effect === 'moveIn') {
  //   if (!commonAppearEffect(element.geElementRootMark(), effect, animation)) {
  //     // rect 自身特有 appear 效果
  //   }
  // } else {

  // }
  const graphics = getElementGraphic(element);
  graphics.forEach(graphic => {
    if (!commonAppearEffect(graphic, effect, animation)) {
      // rect 自身特有 appear 效果
    }
  });
};
export const qipaoAppearProcessor = async (element: IElement, spec = {}, appearAction: AppearAction) => {
  const { animation } = appearAction.payload ?? {};
  const { effect } = animation;
  const graphics = getElementGraphic(element);
  graphics.forEach(graphic => {
    if (!commonAppearEffect(graphic, effect, animation)) {
      // rect 自身特有 appear 效果
    }
  });
};
