import { IGroup } from '@visactor/vrender-core';
import { IPointLike } from '@visactor/vutils';
import { StoryCanvas } from '../canvas/canvas';
import { IStory } from '../interface/runtime-interface';
import { IRoleSpec } from './dsl-interface';
export interface IRole {
  id: string;
  spec: IRoleSpec;

  init(): void;
  reset(): void;
  show(): void;
  hide(): void;

  getGraphicParent(): IGroup;
}

export interface IRoleInitOption {
  story: IStory;
  canvas: StoryCanvas;
  graphicParent: IGroup;
}

export interface IRoleConstructor {
  new (spec: IRoleSpec, option: IRoleInitOption): IRole;
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
