import { Action } from '../../dsl/types';
import { ICharacterSpec } from '../character';

export interface IAction {
  startTime: number;
  action: string;
  duration: number;
  payload?: Action['payload'];
}

export interface IStorySpec {
  acts: IActSpec[]; // 作品的章节
  characters: ICharacterSpec[]; // 作品中的元素
}

export interface IActionsLink {
  characterId: string;
  characterActions: IAction[];
}

export type ISceneSpec = {
  id: string;
  actions: IActionsLink[];
};

export interface IActSpec {
  id: string;
  scenes: ISceneSpec[];
}
