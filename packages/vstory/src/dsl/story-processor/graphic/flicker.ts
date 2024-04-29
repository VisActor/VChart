import { ICharacter } from '../../../story/character';
import { FlickerOption } from '../../types/Flicker';
import { flicker } from './effect/flicker';
import { getCharacterGraphic } from './util';

export const flickerProcessor = async (character: ICharacter, spec = {}, appearAction: FlickerOption) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getCharacterGraphic(character);
  graphics.forEach(graphic => {
    flicker(graphic, animation);
  });
};
