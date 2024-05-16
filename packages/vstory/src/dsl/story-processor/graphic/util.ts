import type { IGraphic } from '@visactor/vrender-core';
import type { ICharacter } from '../../../story/character';

export function getCharacterGraphic(character: ICharacter) {
  return character.getGraphicParent().getChildren() as IGraphic[];
}

export function getCharacterParentGraphic(character: ICharacter) {
  return character.getGraphicParent();
}

export function getCharacterByEffect(character: ICharacter, effect: 'move' | string) {
  // move效果, 一定是对parent的操作
  return effect === 'move' ? [getCharacterParentGraphic(character)] : getCharacterGraphic(character);
}
