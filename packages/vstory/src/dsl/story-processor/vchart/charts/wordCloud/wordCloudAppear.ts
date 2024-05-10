import { ISpec } from '@visactor/vchart';

import { IChartAppearAction } from '../../../../types/chart/appear';
import { textAppearProcessor } from '../../marks';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';

export const wordCloudAppearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  textAppearProcessor(chartInstance, spec, action);
};
