import { ICharacter } from '../../../story/character';
import { AppearOption } from '../../types/Appear';
import { darken } from './effect/darken';
import { getCharacterGraphic } from './util';

// TODO: 类型问题
export const darkenProcessor = async (character: ICharacter, spec = {}, appearAction: AppearOption) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getCharacterGraphic(character).filter(graphic => graphic.type !== 'text');
  graphics.forEach(graphic => {
    darken(graphic, animation);
  });
};
