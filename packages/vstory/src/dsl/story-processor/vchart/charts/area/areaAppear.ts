import { ISpec } from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { areaAppearProcessor as areaMarkAppearProcessor } from '../../marks';
import { graphicAppearProcessor } from '../../../graphic/appear';

export const areaAppearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  areaMarkAppearProcessor(chartInstance, spec, action);

  // Group Appear
  graphicAppearProcessor(chartInstance, spec, action);
};
