import VChart, { ISpec } from '@visactor/vchart';
import { Action } from '../../../types';
import { getAllSeriesMarksWithoutRoot } from '../../../../util/vchart-api';
import { isDatumEqual } from '../../../utils/datum';
import { isValid } from '@visactor/vutils';
import { IChartStyleAction } from '../../../types/chart/Style';

export const lineStyleProcessor = async (chartInstance: VChart, spec: ISpec, updateStyleAction: IChartStyleAction) => {
  const action = updateStyleAction as IChartStyleAction;
  const { payload } = action;

  const encodeHelper = (attribute: string) => {
    return (_, element) => {
      if (element.data.some(d => isDatumEqual(d, action.payload.data)) && isValid(payload?.[attribute])) {
        return payload[attribute];
      }

      return element.graphicItem.attribute?.[attribute];
    };
  };

  if (chartInstance) {
    const marks = getAllSeriesMarksWithoutRoot(chartInstance).filter(mark => mark.type === 'line');
    if (!marks.length) {
      return;
    }

    const attrs = Object.keys(action.payload);
    marks.forEach(mark => {
      mark.getProduct().encode(
        attrs.reduce<any>((res, attr: string) => {
          res[attr] = encodeHelper(attr);
          return res;
        }, {})
      );
      mark.getProduct();
    });

    chartInstance.renderSync();
  }
};
