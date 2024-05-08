import type { ICharacter } from '../../../story/character';
import type { IGraphicDisappearAction } from '../../types/graphic/disappear';
import { getCharacterGraphic, getCharacterParentGraphic } from './util';
import { commonDisappearEffect } from './effect/disappear';
import { IGraphic } from '@visactor/vrender-core';

export const graphicDisappearProcessor = async (
  character: ICharacter,
  spec = {},
  IGraphicAppearAction: IGraphicDisappearAction
) => {
  const { animation } = IGraphicAppearAction.payload ?? {};
  let graphics;

  if (animation) {
    const { effect = 'fade' } = animation ?? {};
    if (effect === 'move') {
      graphics = [getCharacterParentGraphic(character)];
    } else {
      graphics = getCharacterGraphic(character);
    }
    graphics.forEach(text => {
      commonDisappearEffect(text, effect, animation);
    });
  } else {
    graphics = getCharacterParentGraphic(character);
    if (graphics) {
      graphics.setAttributes({ visibleAll: false });
    }
  }
};
