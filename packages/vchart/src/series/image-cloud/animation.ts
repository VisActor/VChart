import type { EasingType } from '@visactor/vrender-core';
import type { MaybeArray } from '../../typings';
import type { IAnimationTypeConfig, IElement } from '@visactor/vgrammar-core';
import { ACustomAnimate } from '@visactor/vrender-core';
import { Factory } from '../../core';
import { isValidNumber } from '@visactor/vutils';
import { DEFAULT_ANIMATION_CONFIG } from '../../animation/config';

export class AxialRotateAnimation extends ACustomAnimate<{}> {
  declare valid: boolean;

  private _rotations: number;
  private _scaleX: number;

  constructor(from: any, to: any, duration: number, easing: EasingType, params: { rotation?: number }) {
    super(from, to, duration, easing, params);
    this._rotations = params?.rotation ?? 1;
  }

  onBind(): void {
    this._scaleX = this.target.attribute.scaleX;
    if (!isValidNumber(this._rotations)) {
      this.valid = false;
    }
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>) {
    if (this.valid === false) {
      return;
    }

    if (end) {
      out.scaleX = this._scaleX;
      return;
    }

    // 计算当前的旋转角度
    const currentAngle = this._rotations * 360 * ratio;
    const currentAngleInRadians = (currentAngle * Math.PI) / 180;
    const scaleX = Math.abs(Math.cos(currentAngleInRadians)) * (this._scaleX ?? 1);
    out.scaleX = scaleX;
  }
}

export type ImageCloudAppearPresetType = 'fadeIn' | 'scaleIn' | 'growIn' | 'axialRotate';

export function imageCloudPresetAnimation(
  params: any,
  preset: ImageCloudAppearPresetType
): MaybeArray<IAnimationTypeConfig> {
  switch (preset) {
    case 'axialRotate':
      return [
        {
          custom: AxialRotateAnimation,
          customParameters: {
            rotation: 1
          },
          duration: DEFAULT_ANIMATION_CONFIG.appear.duration
        },
        {
          channel: {
            y: {
              from: (datum: any, element: IElement) => {
                return params.height() + element.getGraphicItem().attribute.y;
              }
            },
            fillOpacity: {
              from: 0,
              to: 1
            }
          },
          easing: 'sineInOut'
        }
      ];
    case 'growIn':
      return {
        channel: {
          scaleX: {
            from: 0,
            to: 1
          },
          scaleY: {
            from: 0,
            to: 1
          },
          x: { from: () => params.center().x },
          y: { from: () => params.center().y }
        },
        duration: DEFAULT_ANIMATION_CONFIG.appear.duration
      };
    case 'scaleIn':
      return { type: 'scaleIn', duration: DEFAULT_ANIMATION_CONFIG.appear.duration };
    case 'fadeIn':
    default:
      return { type: 'fadeIn', duration: DEFAULT_ANIMATION_CONFIG.appear.duration };
  }
}

export const registerImageCloudAnimation = () => {
  Factory.registerAnimation('imageCloud', (params: any, preset: any) => ({
    enter: imageCloudPresetAnimation(params, preset),
    disappear: { type: 'fadeOut' }
  }));
};
