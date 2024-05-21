import { ISpec } from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { arcAppearProcessor } from '../../marks';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { graphicAppearProcessor } from '../../../graphic/appear';

export const sunburstAppearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  arcAppearProcessor(chartInstance, spec, action);

  // Group Appear
  graphicAppearProcessor(chartInstance, spec, action);
};
