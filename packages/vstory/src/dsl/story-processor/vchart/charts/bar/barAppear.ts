import { ISpec } from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { rectAppearProcessor } from '../../marks';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { graphicAppearProcessor } from '../../../graphic/appear';

export const barAppearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  // 显示: rect
  rectAppearProcessor(chartInstance, spec, action);

  // Group Appear
  delete action.payload.animation.effect;
  graphicAppearProcessor(chartInstance, spec, action);
};
