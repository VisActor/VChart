import type { IRole } from '../../../story/role';
import type { IFlickerAction } from '../../types';
import { flicker } from './effect/flicker';
import { getRoleGraphic } from './util';

export const flickerProcessor = async (role: IRole, spec = {}, appearAction: IFlickerAction) => {
  const { animation } = appearAction.payload ?? {};
  const graphics = getRoleGraphic(role);
  graphics.forEach(graphic => {
    flicker(graphic, animation);
  });
};
