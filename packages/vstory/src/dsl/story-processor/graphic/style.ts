import { ICharacter } from '../../../story/character';
import { getCharacterGraphic } from './util';

export const styleProcessor = async (character: ICharacter, spec = {}, styleAction: any) => {
  const { graphic: graphicStyle } = styleAction;
  const { animation } = styleAction.payload ?? {};
  const { duration, easing } = animation;
  const graphic = getCharacterGraphic(character)[0];
  // TODO:
  if (graphic) {
    graphic.animate().to(graphicStyle, duration, easing);
  }
};
