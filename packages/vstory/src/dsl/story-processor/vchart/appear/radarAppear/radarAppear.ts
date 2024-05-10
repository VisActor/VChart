import VChart, { ISpec } from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { areaAppearProcessor, lineAppearProcessor, symbolAppearProcessor } from '../../marks';

export const radarAppearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  const chart = chartInstance.getGraphicParent();
  const vchart = chart?._vchart;
  const instance: VChart = vchart ? vchart : chartInstance;

  if (!instance) {
    return;
  }

  // 显示: symbol
  symbolAppearProcessor(chartInstance, spec, action);
  // 显示: area
  areaAppearProcessor(chartInstance, spec, action);
  // 显示: line
  lineAppearProcessor(chartInstance, spec, action);
};
