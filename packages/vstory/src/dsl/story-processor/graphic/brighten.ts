import type { IRole } from '../../../story/role';
import type { IBrightenAction } from '../../types/common/brighten';
import { brighten } from './effect/shade';
import { getRoleGraphic } from './util';

export const brightenProcessor = async (role: IRole, spec = {}, brightenAction: IBrightenAction) => {
  const { animation } = brightenAction.payload ?? {};
  const graphics = getRoleGraphic(role);
  graphics.forEach(graphic => {
    brighten(graphic, animation);
  });
};
