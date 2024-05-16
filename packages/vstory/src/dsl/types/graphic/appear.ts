import type { IAction, IAnimationParams, IActionPayload } from '../index';

export interface IGraphicAppearPayLoad extends IActionPayload {
  animation: Omit<IAnimationParams, 'loop'> & {
    effect?: string; // TODO: 枚举类型

    /**
     * 渐变行为
     */
    fade?: {
      opacity?: number;
    };

    /**
     * 缩放行为
     */
    scale?: {
      ratio?: number;
    };

    /**
     * 旋转行为
     */
    rotate?: {
      angle?: number;
    };

    /**
     * 移动行为
     */
    move?: {
      from?: 'top' | 'right' | 'bottom' | 'left';
    };
  };
}

export interface IGraphicAppearAction extends IAction {
  action: 'appear';
  payload: IGraphicAppearPayLoad;
}
