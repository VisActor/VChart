import type { EasingType, IGraphic } from '@visactor/vrender-core';
import type { IBounceParams } from '../../../types/common/bounce';
import { CustomEase } from './../../../../animate/util/util';
import { Bounce } from '../../../../animate/bounce';

export function bounce(graphic: IGraphic, params: IBounceParams) {
  if (graphic) {
    const { dy } = params;
    let { customEase } = params;
    const { y1, y2 } = graphic.AABBBounds;
    const height = Math.abs(y1 - y2);
    if (!customEase) {
      customEase = CustomEase.create(
        'bounce',
        'M0,0 C0,0 0.058,1 0.2,1 0.346,1 0.41,0 0.53,0 0.559,0 0.681,-0.002 0.702,0.011 0.788,0.065 0.774,0.212 0.853,0.212 0.928,0.212 1,0 1,0 ',
        {}
      );
    }
    graphic.animate().play(new Bounce({}, {}, 3000, 'linear' as EasingType, { dy: dy ?? height * 0.2, customEase }));
  }
}
