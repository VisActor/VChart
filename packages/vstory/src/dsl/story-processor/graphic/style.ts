import { IRole } from '../../../story/role';
import { getRoleGraphic } from './util';

export const styleProcessor = async (role: IRole, spec = {}, styleAction: any) => {
  const { graphic: graphicStyle } = styleAction;
  const { animation } = styleAction.payload ?? {};
  const { duration, easing } = animation;
  const graphic = getRoleGraphic(role)[0];
  // TODO:
  if (graphic) {
    graphic.animate().to(graphicStyle, duration, easing);
  }
};
