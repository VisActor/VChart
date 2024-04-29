import type { IGraphic } from '@visactor/vrender-core';
import type { ICharacter } from '../../../story/character';

export function getCharacterGraphic(character: ICharacter) {
  return character.getGraphicParent().getChildren() as IGraphic[];
}

export function getCharacterParentGraphic(character: ICharacter) {
  return character.getGraphicParent();
}
