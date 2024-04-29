import type { ICharacter } from '../../../story/character';
import type { AppearOption } from '../../types/Appear';
import { brighten } from './effect/darken';
import { getCharacterGraphic } from './util';

// TODO: 类型问题
export const brightenProcessor = async (character: ICharacter, spec = {}, appearAction: AppearOption) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getCharacterGraphic(character).filter(graphic => graphic.type !== 'text');
  graphics.forEach(graphic => {
    brighten(graphic, animation);
  });
};
