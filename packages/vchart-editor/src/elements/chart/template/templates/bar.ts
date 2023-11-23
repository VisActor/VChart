import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './baseTemp';
import { getCartesianCommonSpec, getCartesianSpec, getDimensions } from './common';

export function spec() {
  const _spec = getCartesianCommonSpec('vertical');
  _spec.series.push({
    id: 'bar-0',
    type: 'bar',
    stack: true,
    bar: {
      state: {
        hover: {
          stroke: '#000',
          lineWidth: 1
        }
      }
    },
    label: {
      visible: true,
      position: 'inside'
    }
  });
  return _spec;
}

export class BarTemp extends BaseTemp {
  type = 'bar';
  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    const { ordinalFields, linearFields } = getDimensions(info);
    if (ordinalFields.length === 0 || linearFields.length === 0) {
      return false;
    }
    return true;
  }
  getSpec(data: StandardData, info: DataInfo, opt?: any) {
    const lastSpec = getCartesianSpec(spec(), 'vertical', data, info, 1);

    lastSpec.markLine = {
      id: '62ac726c-eea4-436f-9b4b-b16f34e5a07e',
      interactive: true,
      name: 'total-diff-line',
      type: 'type-step',
      coordinates: [
        {
          State: 'WY',
          Age: '14 to 17 Years',
          Population: 36839,
          __VCHART_DEFAULT_DATA_INDEX: 2,
          __VCHART_DEFAULT_DATA_KEY: 2,
          __VCHART_STACK_END: 36839,
          __VCHART_STACK_START: 27525,
          VGRAMMAR_DATA_ID_KEY_33: 2,
          __VCHART_STACK_TOTAL: 36839,
          __VCHART_STACK_TOTAL_TOP: true
        },
        {
          State: 'DC',
          Age: '14 to 17 Years',
          Population: 61016,
          __VCHART_DEFAULT_DATA_INDEX: 5,
          __VCHART_DEFAULT_DATA_KEY: 5,
          __VCHART_STACK_END: 61016,
          __VCHART_STACK_START: 50791,
          VGRAMMAR_DATA_ID_KEY_33: 5,
          __VCHART_STACK_TOTAL: 61016,
          __VCHART_STACK_TOTAL_TOP: true
        }
      ],
      connectDirection: 'top',
      expandDistance: '13.761467889908257%',
      line: {
        style: {
          lineDash: [0],
          lineWidth: 2,
          stroke: '#000',
          cornerRadius: 4
        }
      },
      label: {
        position: 'middle',
        text: '66%',
        labelBackground: {
          padding: {
            left: 4,
            right: 4,
            top: 4,
            bottom: 4
          },
          style: {
            fill: '#fff',
            fillOpacity: 1,
            stroke: '#000',
            lineWidth: 1,
            cornerRadius: 4
          }
        },
        style: {
          fill: '#000'
        }
      },
      endSymbol: {
        size: 12,
        refX: -4
      },
      _originValue_: [36839, 61016]
    };
    return lastSpec;
  }
}
