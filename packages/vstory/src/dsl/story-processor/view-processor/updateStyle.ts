import VChart, { IChartSpec } from '@visactor/vchart';
import { ActionNode } from '../../types';
import { UpdateStyleAction } from '../../types/UpdateStyle';
import { getAllSeriesMarksWithoutRoot } from '../../../util/vchart-api';
import { highlight } from '../../../animate/highlight';

export const updateStyleParser = async (chartInstance: VChart, spec: IChartSpec, updateStyleAction: ActionNode) => {
  const action = updateStyleAction as UpdateStyleAction;

  if (chartInstance) {
    const marks = getAllSeriesMarksWithoutRoot(chartInstance);
    if (marks && marks.length) {
      marks.forEach(mark => {
        mark.getProduct().encodeState('updateStyle', action.style);
      });

      chartInstance.updateState({
        updateStyle: {
          filter: {
            datums: [action.data]
          }
        }
      });
    }
  }
};
