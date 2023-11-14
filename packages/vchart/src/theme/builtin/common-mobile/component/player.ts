import type { IPlayerTheme } from '../../../../component/player';

export const player: IPlayerTheme = {
  visible: true,
  position: 'start',
  padding: {
    top: 12,
    bottom: 12
  },
  slider: {
    space: 10,
    handlerStyle: {
      size: 15
    }
  },
  controller: {
    start: {
      order: 0,
      space: 0,
      style: {
        size: 25
      }
    },
    pause: {
      order: 0,
      space: 0,
      style: {
        size: 25
      }
    },
    backward: {
      order: 0,
      space: 10,
      position: 'start',
      style: {
        size: 12
      }
    },
    forward: {
      order: 0,
      space: 10,
      position: 'end',
      style: {
        size: 12
      }
    }
  }
};
