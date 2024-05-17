import type { ICharacter } from '../../../story/character';
import type { IText } from '@visactor/vrender-core';
import type { IGraphicAppearAction } from '../../types/graphic/appear';
import { appearEffectMap } from './effect/appear';
import { getCharacterByEffect } from './util';

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
