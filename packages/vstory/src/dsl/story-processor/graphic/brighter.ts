import type { IElement } from '../../../story/element';
import type { AppearOption } from '../../types/Appear';
import { brighten } from './effect/darken';
import { getElementGraphic } from './util';

// TODO: 类型问题
export const brightenProcessor = async (element: IElement, spec = {}, appearAction: AppearOption) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getElementGraphic(element).filter(graphic => graphic.type !== 'text');
  graphics.forEach(graphic => {
    brighten(graphic, animation);
  });
};
