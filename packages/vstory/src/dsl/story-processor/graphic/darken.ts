import { IElement } from '../../../story/element';
import { AppearOption } from '../../types/Appear';
import { darken } from './effect/darken';
import { getElementGraphic } from './util';

// TODO: 类型问题
export const darkenProcessor = async (element: IElement, spec = {}, appearAction: AppearOption) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getElementGraphic(element).filter(graphic => graphic.type !== 'text');
  graphics.forEach(graphic => {
    darken(graphic, animation);
  });
};
