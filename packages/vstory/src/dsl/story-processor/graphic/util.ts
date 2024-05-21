import type { IGraphic } from '@visactor/vrender-core';
import type { ICharacter } from '../../../story/character';
import { IAnimationParams } from '../../types';

export function getCharacterGraphic(character: ICharacter) {
  return character.getGraphicParent().getChildren() as IGraphic[];
}

export function getCharacterParentGraphic(character: ICharacter) {
  return character.getGraphicParent();
}

export function getCharacterByEffect(character: ICharacter, effect: 'move' | string) {
  // 图表仅操作父节点.
  // @ts-ignore
  if (character._graphic.type === 'chart') {
    return [getCharacterParentGraphic(character)];
  }
  // move效果, 一定是对parent的操作
  return effect === 'move' ? [getCharacterParentGraphic(character)] : getCharacterGraphic(character);
}

export const canDoGraphicAnimation = (graphic: IGraphic, animationParams: IAnimationParams) => {
  return graphic && animationParams.duration && animationParams.duration > 0;
};
