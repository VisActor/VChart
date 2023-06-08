import type { IAxisCommonTheme } from '../../../../component/axis';
import { DEFAULT_AXIS_TICK_SIZE } from '../../config';

export const commonAxis: IAxisCommonTheme = {
  domainLine: {
    visible: true,
    style: {
      lineWidth: 1,
      stroke: '#dfdfdf',
      strokeOpacity: 1
    }
  },
  grid: {
    visible: true,
    style: {
      lineWidth: 1,
      stroke: '#dfdfdf',
      strokeOpacity: 1,
      lineDash: [4, 4]
    }
  },
  subGrid: {
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
    space: 4,
    style: {
      fontSize: 12,
      fill: '#333333',
      fontWeight: 'normal',
      fillOpacity: 1
    }
  }
};
