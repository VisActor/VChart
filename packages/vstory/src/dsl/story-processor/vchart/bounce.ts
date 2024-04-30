import type { ISpec } from '@visactor/vchart';
import type { IBounceAction } from '../../types/common/bounce';
import type { ICharacterVisactor } from '../../../story/character/visactor/interface';
import { bounce } from '../graphic/effect/bounce';

export const bounceProcessor = async (chartInstance: ICharacterVisactor, spec: ISpec, action: IBounceAction) => {
  const chart = chartInstance.getGraphicParent();
  if (chart) {
    const { payload } = action ?? {};
    bounce(chart, payload.animation);
  }
};
