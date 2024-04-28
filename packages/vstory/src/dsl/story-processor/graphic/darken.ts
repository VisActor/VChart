import { IRole } from '../../../story/role';
import { AppearOption } from '../../types/Appear';
import { darken } from './effect/darken';
import { getRoleGraphic } from './util';

// TODO: 类型问题
export const darkenProcessor = async (role: IRole, spec = {}, appearAction: AppearOption) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getRoleGraphic(role).filter(graphic => graphic.type !== 'text');
  graphics.forEach(graphic => {
    darken(graphic, animation);
  });
};
