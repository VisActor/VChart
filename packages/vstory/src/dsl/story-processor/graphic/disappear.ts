import type { ICharacter } from '../../../story/character';
import type { IText } from '@visactor/vrender-core';
import type { IGraphicDisappearAction } from '../../types/graphic/disappear';
import { getCharacterGraphic, getCharacterParentGraphic } from './util';
import { typewriter } from './effect/typewriter';
import { commonDisappearEffect } from './effect/disappear';

export const textDisappearProcessor = async (
  character: ICharacter,
  spec = {},
  IGraphicAppearAction: IGraphicDisappearAction
) => {
  const { animation } = IGraphicAppearAction.payload ?? {};
  const { effect } = animation;
  const graphics = getCharacterGraphic(character);
  const textGraphics = graphics.filter(graphic => graphic.type === 'text') as IText[];
  textGraphics.forEach(text => {
    if (!commonDisappearEffect(text, effect, animation)) {
      switch (effect) {
        case 'typewriter':
          typewriter(text, animation);
          break;
      }
    }
  });
};

export const graphicDisappearProcessor = async (
  character: ICharacter,
  spec = {},
  IGraphicAppearAction: IGraphicDisappearAction
) => {
  const { animation } = IGraphicAppearAction.payload ?? {};
  const { effect } = animation;
  let graphics;
  if (effect === 'move') {
    graphics = [getCharacterParentGraphic(character)];
  } else {
    graphics = getCharacterGraphic(character);
  }
  graphics.forEach(text => {
    if (!commonDisappearEffect(text, effect, animation)) {
    }
  });
};
