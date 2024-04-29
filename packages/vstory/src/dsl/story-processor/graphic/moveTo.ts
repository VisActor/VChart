import { ICharacter } from '../../../story/character';
import { moveTo } from './effect/moveTo';
import { getCharacterParentGraphic } from './util';

export const moveToProcessor = async (character: ICharacter, spec = {}, moveToAction: any) => {
  const { destination } = moveToAction;
  const { animation } = moveToAction.payload ?? {};
  const graphic = getCharacterParentGraphic(character);
  moveTo(graphic, { ...animation, destination });
};
