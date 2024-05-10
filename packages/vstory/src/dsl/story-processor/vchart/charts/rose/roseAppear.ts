import { ISpec } from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { arcAppearProcessor } from '../../marks';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';

export const roseAppearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  arcAppearProcessor(chartInstance, spec, action);
};
