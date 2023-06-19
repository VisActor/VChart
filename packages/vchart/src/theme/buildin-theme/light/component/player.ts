import type { IPlayerTheme } from '../../../../component/player';

export const player: IPlayerTheme = {
  visible: true,
  position: 'start',
  padding: {
    top: 20,
    bottom: 20
  },
  slider: {
    space: 10,
    trackStyle: {
      fill: '#3073F2'
    },
    railStyle: {
      fill: '#D1D5DA'
    },
    handlerStyle: {
      size: 15,
      stroke: '#FFFFFF',
      lineWidth: 2,
      fill: '#0564FE'
    }
  },
  controller: {
    start: {
      order: 0,
      space: 0,
      style: {
        size: 25,
        fill: '#3073F2'
      }
    },
    pause: {
      order: 0,
      space: 0,
      style: {
        size: 25,
        fill: '#3073F2'
      }
    },
    backward: {
      order: 0,
      space: 10,
      position: 'start',
      style: {
        size: 12,
        fill: '#3073F2'
      }
    },
    forward: {
      order: 0,
      space: 10,
      position: 'end',
      style: {
        size: 12,
        fill: '#3073F2'
      }
    }
  }
};
