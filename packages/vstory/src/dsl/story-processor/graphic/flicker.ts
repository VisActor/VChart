import type { ICharacter } from '../../../story/character';
import type { IFlickerAction } from '../../types';
import { flicker } from './effect/flicker';
import { getCharacterGraphic } from './util';

export const flickerProcessor = async (character: ICharacter, spec = {}, appearAction: IFlickerAction) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getCharacterGraphic(character);
  graphics.forEach(graphic => {
    flicker(graphic, animation);
  });
};
