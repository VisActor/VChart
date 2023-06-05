import type { IPolarAxisTheme } from '../../../../component/axis/polar/interface';
import { DEFAULT_AXIS_TICK_SIZE } from '../../config';

export const polarAxis: IPolarAxisTheme = {
  common: {
    domainLine: {
      visible: true,
      style: {
        lineWidth: 1,
        stroke: '#dfdfdf',
        strokeOpacity: 1
      }
    },
    grid: {
      smooth: true,
      visible: true,
      style: {
        lineWidth: 1,
        stroke: '#dfdfdf',
        strokeOpacity: 1,
        lineDash: [4, 4]
      }
    },
    subGrid: {
      smooth: true,
      visible: false,
      style: {
        lineWidth: 1,
        stroke: '#dfdfdf',
        strokeOpacity: 1,
        lineDash: [4, 4]
      }
    },
    tick: {
      visible: true,
      tickSize: DEFAULT_AXIS_TICK_SIZE,
      style: {
        lineWidth: 1,
        stroke: '#D8DCE3',
        strokeOpacity: 1
      }
    },
    subTick: {
      visible: false,
      tickSize: DEFAULT_AXIS_TICK_SIZE / 2,
      style: {
        lineWidth: 1,
        stroke: '#D8DCE3',
        strokeOpacity: 1
      }
    },
    label: {
      visible: true,
      space: 4,
      style: {
        fontSize: 12,
        fill: '#6F6F6F',
        fontWeight: 'normal',
        fillOpacity: 1
      }
    },
    title: {
      // visible: true,
      space: 4,
      style: {
        fontSize: 12,
        fill: '#333333',
        fontWeight: 'normal',
        fillOpacity: 1
      }
    }
    /*
     background: {
       style: {
         fill: '#141414',
         fillOpacity: 0
       },
       hover: {
         fillOpacity: 0
       }
     }
     */
  }
};
