import { ISpec } from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { rectAppearProcessor } from '../../marks';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';

export const treeMapAppearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  rectAppearProcessor(chartInstance, spec, action);
};
