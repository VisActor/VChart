import { ISpec } from '@visactor/vchart';

import { IChartAppearAction } from '../../../../types/chart/appear';
import { textAppearProcessor } from '../../marks';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { graphicAppearProcessor } from '../../../graphic/appear';

export const wordCloudAppearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  textAppearProcessor(chartInstance, spec, action);

  // Group Appear
  graphicAppearProcessor(chartInstance, spec, action);
};
