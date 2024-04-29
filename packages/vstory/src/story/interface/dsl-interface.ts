import type { Action } from '../../dsl/types';
import type { IRoleSpec } from '../role';

export interface IAction {
  startTime: number;
  action: string;
  duration: number;
  payload?: Action['payload'];
}

export interface IStorySpec {
  acts: IActSpec[]; // 作品的章节
  roles: IRoleSpec[]; // 作品中的元素
}

export interface IRoleLink {
  roleId: string;
  actions: IAction[];
}

export type ISceneSpec = IRoleLink[];

export interface IActSpec {
  id: string;
  scenes: ISceneSpec[];
}
