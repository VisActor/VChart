import type { IPlayerTheme } from '../../../../component/player';

export const player: IPlayerTheme = {
  visible: true,
  position: 'start',
  slider: {
    space: 10,
    trackStyle: {
      fill: '#63B5FC'
    },
    railStyle: {},
    handlerStyle: {
      stroke: '#63B5FC'
    }
  },
  controller: {
    start: {
      order: 0,
      space: 0,
      style: {
        size: 20,
        fill: '#63B5FC'
      }
    },
    pause: {
      order: 0,
      space: 0,
      style: {
        size: 20,
        fill: '#63B5FC'
      }
    },
    backward: {
      order: 0,
      space: 10,
      position: 'start',
      style: {
        size: 20,
        fill: '#63B5FC'
      }
    },
    forward: {
      order: 0,
      space: 10,
      position: 'end',
      style: {
        size: 20,
        fill: '#63B5FC'
      }
    }
  }
};
