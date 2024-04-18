import VChart, { ISpec } from '@visactor/vchart';
import { ActionNode } from '../../types';
import { StyleAction } from '../../types/Style';
import { getAllSeriesMarksWithoutRoot } from '../../../util/vchart-api';
import { isDatumEqual } from '../../utils/datum';

export const createMarkStyleProcessorByMarkType =
  (markType: string) => async (chartInstance: VChart, spec: ISpec, updateStyleAction: ActionNode) => {
    const action = updateStyleAction as StyleAction;
    const { payload } = action;

    const helper = (attribute: string) => {
      return (datum, element) => {
        if (isDatumEqual(datum, action.data) && payload?.[attribute]) {
          return payload[attribute];
        }

        return element.graphicItem.attribute?.[attribute];
      };
    };

    const attrs = [
      'size',
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
