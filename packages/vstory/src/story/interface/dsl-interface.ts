import { ICharacterSpec } from '../character';

export type IAction = {
  startTime: number;
  action: string;
  duration: number;
  payload?: {
    style?: {
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
  characters: ICharacterSpec[]; // 作品中的元素
}

export interface ICharacterLink {
  characterId: string;
  actions: IAction[];
}

export type ISceneSpec = ICharacterLink[];

export interface IActSpec {
  id: string;
  scenes: ISceneSpec[];
}
