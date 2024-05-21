import type { ICharacter } from '../../../story/character';
import type { IGraphicDisappearAction } from '../../types/graphic/disappear';
import { getCharacterByEffect } from './util';
import { disappearEffectMap } from './effect/disappear';

export const graphicDisappearProcessor = async (
  character: ICharacter,
  spec = {},
  IGraphicAppearAction: IGraphicDisappearAction
) => {
  const { animation } = IGraphicAppearAction.payload ?? {};
  const { effect } = animation ?? {};

  const effects = effect ? [effect] : Object.keys(disappearEffectMap);

  effects.forEach(effect => {
    if (animation.effect === effect || animation[effect]) {
      // 获取执行方法
      const disappearEffect = disappearEffectMap[effect];
      // 获取相关图形
      const graphics = getCharacterByEffect(character, effect);
      // 执行disappearEffect
      graphics.forEach(graphic => disappearEffect(graphic, animation));
    }
  });
};
