import VChart, { ISpec } from '@visactor/vchart';
import { ActionNode } from '../../types';
import { UpdateStyleAction } from '../../types/UpdateStyle';
import { getAllSeriesMarksWithoutRoot } from '../../../util/vchart-api';
import { isDatumEqual } from '../../utils/datum';

export const createMarkStyleProcessorByMarkType = (markType: string) => {
  async (chartInstance: VChart, spec: ISpec, updateStyleAction: ActionNode) => {
    const action = updateStyleAction as UpdateStyleAction;
    const { payload } = action;

    const helper = (attribute: string) => {
      return (datum, element) => {
        if (isDatumEqual(datum, action.data) && payload.style?.[attribute]) {
          return payload.style[attribute];
        }

        return element.graphicItem.attribute?.[attribute];
      };
    };

    const attrs = [
      'fill',
      'fillOpacity',
      'dx',
      'dy',
      'width',
      'height',
      'borderRadius',
      'opacity',
      'stroke',
      'strokeOpacity',
      'strokeOpacity',
      'texture',
      'scaleX',
      'scaleY',
      'scaleX',
      'scaleZ',
      'innerBorder',
      'outerBorder'
    ];

    if (chartInstance) {
      const marks = getAllSeriesMarksWithoutRoot(chartInstance).filter(mark => mark.type === markType);

      if (marks && marks.length) {
        marks.forEach(mark => {
          mark.getProduct().encode(
            attrs.reduce<any>((res, attr: string) => {
              res[attr] = helper(attr);
              return res;
            }, {})
          );
        });

        chartInstance.renderSync();
      }
    }
  };
};
