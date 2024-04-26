import { IRoleSpec } from '../role';

export type IAction = {
  startTime: number;
  action: string;
  duration: number;
  payload?: {
    style: {
      [key: string]: number | string;
    };
    animation: {
      duration: number;
      easing: string;
    };
  };
};

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
