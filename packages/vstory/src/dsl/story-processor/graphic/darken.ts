import { ICharacter } from '../../../story/character';
import { IDarkenAction } from '../../types/common/darken';
import { darken } from './effect/shade';
import { getCharacterGraphic } from './util';

export const darkenProcessor = async (character: ICharacter, spec = {}, darkenAction: IDarkenAction) => {
  const { animation } = darkenAction.payload ?? {};
  const graphics = getCharacterGraphic(character);
  graphics.forEach(graphic => {
    darken(graphic, animation);
  });
};
