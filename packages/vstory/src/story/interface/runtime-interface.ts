import { IGraphic } from '@visactor/vrender-core';

export interface IStoryInitOption {
  dom: string | HTMLDivElement; // dom id
}

export interface IStory {
  readonly id: string;
}

export type StoryEvent = Event & {
  detailPath: IGraphic[];
  path: IGraphic[];
};
