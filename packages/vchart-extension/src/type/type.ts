import type { IStage } from '@visactor/vrender-core';

export type IContext = {
  dom: string | HTMLElement;
  width: number;
  height: number;
  stage: IStage;
  canvas: HTMLCanvasElement;
};
