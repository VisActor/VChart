import type { IRole } from '../../../story/role';

export function getRoleGraphic(role: IRole) {
  // TODO: 需要 role 提供接口
  return [(role as any).graphic._graphic, (role as any).text._graphic];
}
