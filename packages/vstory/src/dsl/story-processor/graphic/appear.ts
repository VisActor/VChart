import type { ICharacter } from '../../../story/character';
import type { IText } from '@visactor/vrender-core';
import type { IGraphicAppearAction } from '../../types/graphic/appear';
import { commonAppearEffect } from './effect/appear';
import { getCharacterGraphic, getCharacterParentGraphic } from './util';
import { typewriter } from './effect/typewriter';

export const textAppearProcessor = async (
  character: ICharacter,
  spec = {},
  IGraphicAppearAction: IGraphicAppearAction
) => {
  const { animation } = IGraphicAppearAction.payload ?? {};
  const { effect } = animation;
  const graphics = getCharacterGraphic(character);
  const textGraphics = graphics.filter(graphic => graphic.type === 'text') as IText[];
  textGraphics.forEach(text => {
    if (!commonAppearEffect(text, effect, animation)) {
      switch (effect) {
        case 'typewriter':
          typewriter(text, animation);
          break;
      }
    }
  });
};

export const graphicAppearProcessor = async (
  character: ICharacter,
  spec = {},
  IGraphicAppearAction: IGraphicAppearAction
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
    if (!commonAppearEffect(text, effect, animation)) {
    }
  });
};
