import { ISpec } from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { rectAppearProcessor } from '../../marks';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';

export const barAppearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  // 显示: rect
  rectAppearProcessor(chartInstance, spec, action);
};
