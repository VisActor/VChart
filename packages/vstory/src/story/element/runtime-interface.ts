import { IGroup } from '@visactor/vrender-core';
import { IPointLike } from '@visactor/vutils';
import { StoryCanvas } from './../canvas/canvas';
import { IStory } from './../interface/runtime-interface';
import { IElementSpec } from './dsl-interface';
export interface IElement {
  id: string;
  spec: IElementSpec;

  init(): void;
  geElementRootMark(): IGroup;
}

export interface IElementInitOption {
  story: IStory;
  canvas: StoryCanvas;
}

export interface IElementConstructor {
  new (spec: IElementSpec, option: IElementInitOption): IElement;
}

export interface ILayoutAttribute {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  anchor?: [number | string, number | string];
  dx?: number;
  dy?: number;
  shapePoints?: IPointLike[];
}
