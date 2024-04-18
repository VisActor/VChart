import { IElementSpec } from '../element';

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

export interface IStepSpec {
  elements: (IChapterElementCopy | IChapterElementLink)[]; // 这个章节中的元素和它的动作
}

export interface IChapterSpec {
  id: string;
  steps: IStepSpec[];
}
