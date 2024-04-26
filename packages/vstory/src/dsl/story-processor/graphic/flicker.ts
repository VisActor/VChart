import { IElement } from '../../../story/element';
import { FlickerOption } from '../../types/Flicker';
import { flicker } from './effect/flicker';
import { getElementGraphic } from './util';

export const flickerProcessor = async (element: IElement, spec = {}, appearAction: FlickerOption) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getElementGraphic(element);
  graphics.forEach(graphic => {
    flicker(graphic, animation);
  });
};
