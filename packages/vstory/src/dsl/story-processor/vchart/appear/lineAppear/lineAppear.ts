import { ISpec } from '@visactor/vchart';

import { IChartAppearAction } from '../../../../types/chart/appear';
import { lineAppearProcessor as lineMarkAppearProcessor, symbolAppearProcessor } from '../../marks';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';

export const lineAppearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  lineMarkAppearProcessor(chartInstance, spec, action);
  symbolAppearProcessor(chartInstance, spec, action);
};
