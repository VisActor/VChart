import { ICharacter } from '../../../story/character';
import { IDarkenAction } from '../../types/common/Darken';
import { darken } from './effect/Shade';
import { getCharacterGraphic } from './util';

// TODO: 类型问题
export const darkenProcessor = async (character: ICharacter, spec = {}, darkenAction: IDarkenAction) => {
  const { animation } = darkenAction.payload ?? {};
  const graphics = getCharacterGraphic(character);
  graphics.forEach(graphic => {
    darken(graphic, animation);
  });
};
