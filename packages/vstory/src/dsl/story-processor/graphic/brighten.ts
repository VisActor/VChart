import type { IRole } from '../../../story/role';
import type { AppearOption } from '../../types/Appear';
import { brighten } from './effect/darken';
import { getRoleGraphic } from './util';

// TODO: 类型问题
export const brightenProcessor = async (role: IRole, spec = {}, appearAction: AppearOption) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getRoleGraphic(role).filter(graphic => graphic.type !== 'text');
  graphics.forEach(graphic => {
    brighten(graphic, animation);
  });
};
