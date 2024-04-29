import { IRole } from '../../../story/role';
import { moveTo } from './effect/moveTo';
import { getRoleParentGraphic } from './util';

export const moveToProcessor = async (role: IRole, spec = {}, moveToAction: any) => {
  const { destination } = moveToAction;
  const { animation } = moveToAction.payload ?? {};
  const graphic = getRoleParentGraphic(role);
  moveTo(graphic, { ...animation, destination });
};
