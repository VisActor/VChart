import { IElementSpec } from '../element';

export type IAction = any;

export interface IStorySpec {
  chapter: IChapterSpec[]; // 作品的章节
  elements: IElementSpec[]; // 作品中的元素
}

export interface IChapterElementLink {
  elementId: string;
  actions: IAction[];
}

export interface IChapterElementCopy {
  element: IElementSpec;
  actions: IAction[];
}

export interface IChapterSpec {
  id: string;
  elements: (IChapterElementCopy | IChapterElementLink)[]; // 这个章节中的元素和它的动作
}
