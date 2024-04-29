import { EasingType, IGraphic } from '@visactor/vrender-core';
import { AnimationParams } from './appear';

export interface MoveToParams extends AnimationParams {
  destination: { x: number; y: number };
  // TODO: 后续可以增加参数 path: 指定移动的方式或路径类型，例如直线移动、曲线移动等。
}

export function moveTo(graphic: IGraphic, params: MoveToParams) {
  if (graphic) {
    const { duration, easing, destination } = params;
    if (destination) {
      graphic.animate().to(destination, duration, easing as EasingType);
    }
  }
}
