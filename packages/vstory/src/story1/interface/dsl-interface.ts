import { IRoleSpec } from '../role';

export type IAction = {
  startTime: number;
  action: string;
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
  chapters: IChapterSpec[]; // 作品的章节
  roles: IRoleSpec[]; // 作品中的元素
}

export interface IChapterRoleLink {
  roleId: string;
  actions: IAction[];
}

export interface IChapterSpec {
  id: string;
  steps: IChapterRoleLink[];
}
