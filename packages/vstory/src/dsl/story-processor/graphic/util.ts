import type { IGraphic } from '@visactor/vrender-core';
import type { IRole } from '../../../story/role';

export function getRoleGraphic(role: IRole) {
  return role.getGraphicParent().getChildren() as IGraphic[];
}

export function getRoleParentGraphic(role: IRole) {
  return role.getGraphicParent();
}
