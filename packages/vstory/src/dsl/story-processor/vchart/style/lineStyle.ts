import VChart, { ISpec } from '@visactor/vchart';
import { ActionNode } from '../../../types';
import { StyleAction } from '../../../types/Style';
import { getAllSeriesMarksWithoutRoot } from '../../../../util/vchart-api';
import { isDatumEqual } from '../../../utils/datum';
import { isValid } from '@visactor/vutils';

export const lineStyleProcessor = async (chartInstance: VChart, spec: ISpec, updateStyleAction: ActionNode) => {
  const action = updateStyleAction as StyleAction;
  const { payload } = action;

  const encodeHelper = (attribute: string) => {
    return (_, element) => {
      if (element.data.some(d => isDatumEqual(d, action.data)) && isValid(payload?.[attribute])) {
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
