import { IRole } from '../../../story/role';
import { FlickerOption } from '../../types/Flicker';
import { flicker } from './effect/flicker';
import { getRoleGraphic } from './util';

export const flickerProcessor = async (role: IRole, spec = {}, appearAction: FlickerOption) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getRoleGraphic(role);
  graphics.forEach(graphic => {
    flicker(graphic, animation);
  });
};
