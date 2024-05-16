import type { ICharacter } from '../../../story/character';
import type { IText } from '@visactor/vrender-core';
import type { IGraphicAppearAction } from '../../types/graphic/appear';
import { appearEffectMap, commonAppearEffect } from './effect/appear';
import { getCharacterByEffect } from './util';
import { typewriter } from './effect/typewriter';

export const textAppearProcessor = async (
  character: ICharacter,
  spec = {},
  IGraphicAppearAction: IGraphicAppearAction
) => {
  const { animation } = IGraphicAppearAction.payload ?? {};
  const { effect } = animation ?? {};
  const graphics = getCharacterByEffect(character, effect);

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

export const graphicAppearProcessor = async (character: ICharacter, spec = {}, action: IGraphicAppearAction) => {
  const { animation } = action.payload ?? {};
  const { effect } = animation ?? {};

  const effects = effect ? [effect] : Object.keys(appearEffectMap);

  effects.forEach(effect => {
    if (animation.effect === effect || animation[effect]) {
      // 获取执行方法
      const appearEffect = appearEffectMap[effect];
      // 获取相关图形
      const graphics = getCharacterByEffect(character, effect);
      // 执行appearEffect
      graphics.forEach(graphic => appearEffect(graphic, animation));
    }
    return false;
  });
};
