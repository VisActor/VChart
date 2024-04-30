import VChart, { ISpec } from '@visactor/vchart';
import { getAllSeriesMarksWithoutRoot } from '../../../../util/vchart-api';
import { isDatumEqual } from '../../../utils/datum';
import { isValid } from '@visactor/vutils';
import { IChartStyleAction } from '../../../types/chart/style';

export const createMarkStyleProcessorByMarkType =
  (markType: string) => async (chartInstance: VChart, spec: ISpec, updateStyleAction: IChartStyleAction) => {
    const action = updateStyleAction;
    const { payload } = action;

    if (chartInstance) {
      const marks = getAllSeriesMarksWithoutRoot(chartInstance)?.filter(mark => mark.type === markType);
      if (!marks || !marks.length) {
        return;
      }

      const attrs = Object.keys(action.payload);

      const encodeHelper = (attribute: string) => {
        return (datum, element) => {
          if (isDatumEqual(datum, action.payload.data) && isValid(payload?.[attribute])) {
            return payload[attribute];
          }

          return element.graphicItem?.attribute?.[attribute];
        };
      };

      marks.forEach(mark => {
        mark.getProduct().encode(
          attrs.reduce<any>((res, attr: string) => {
            res[attr] = encodeHelper(attr);
            return res;
          }, {})
        );
      });

      chartInstance.renderSync();
    }
  };
