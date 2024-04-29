import { IGroup } from '@visactor/vrender-core';
import { IPointLike } from '@visactor/vutils';
import { StoryCanvas } from '../canvas/canvas';
import { IStory } from '../interface/runtime-interface';
import { ICharacterSpec } from './dsl-interface';
export interface ICharacter {
  id: string;
  spec: ICharacterSpec;

  init(): void;
  reset(): void;
  show(): void;
  hide(): void;
  getGraphicParent(): IGroup;
  tickTo(t: number): void;
}

export interface ICharacterInitOption {
  story: IStory;
  canvas: StoryCanvas;
  graphicParent: IGroup;
}

export interface ICharacterConstructor {
  new (spec: ICharacterSpec, option: ICharacterInitOption): ICharacter;
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
