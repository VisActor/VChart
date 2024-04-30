import type { ICharacter } from '../../../story/character';
import type { IBrightenAction } from '../../types/common/Brighten';
import { brighten } from './effect/Shade';
import { getCharacterGraphic } from './util';

export const brightenProcessor = async (character: ICharacter, spec = {}, brightenAction: IBrightenAction) => {
  const { animation } = brightenAction.payload ?? {};
  const graphics = getCharacterGraphic(character);
  graphics.forEach(graphic => {
    brighten(graphic, animation);
  });
};
