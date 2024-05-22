import type { EasingType } from '@visactor/vrender-core';
import type { IGraphicStyleAction } from '../../types/graphic/style';
import type { ICharacter } from '../../../story/character';
import { getCharacterGraphic } from './util';

export const styleProcessor = async (character: ICharacter, spec = {}, styleAction: IGraphicStyleAction) => {
  const { animation, graphic: graphicStyle, text: textStyle } = styleAction.payload ?? {};
  const { duration, easing } = animation;
  const graphic = getCharacterGraphic(character)[0];
  const text = getCharacterGraphic(character)[1];

  if (graphic && graphicStyle) {
    graphic.animate().to(graphicStyle, duration, easing as EasingType);
  }
  if (text && textStyle) {
    graphic.animate().to(textStyle, duration, easing as EasingType);
  }
  return {
    totalTime: duration
  };
};
