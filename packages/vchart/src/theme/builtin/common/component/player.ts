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
      fill: { type: 'palette', key: 'sliderTrackColor' },
      fillOpacity: 0.8
    },
    railStyle: {
      fill: { type: 'palette', key: 'sliderRailColor' }
    },
    handlerStyle: {
      size: 15,
      stroke: { type: 'palette', key: 'backgroundColor' },
      lineWidth: 2,
      fill: { type: 'palette', key: 'playerControllerColor' }
    }
  },
  controller: {
    start: {
      order: 0,
      space: 0,
      style: {
        size: 25,
        fill: { type: 'palette', key: 'playerControllerColor' },
        fillOpacity: 0.8
      }
    },
    pause: {
      order: 0,
      space: 0,
      style: {
        size: 25,
        fill: { type: 'palette', key: 'playerControllerColor' },
        fillOpacity: 0.8
      }
    },
    backward: {
      order: 0,
      space: 10,
      position: 'start',
      style: {
        size: 12,
        fill: { type: 'palette', key: 'playerControllerColor' },
        fillOpacity: 0.8
      }
    },
    forward: {
      order: 0,
      space: 10,
      position: 'end',
      style: {
        size: 12,
        fill: { type: 'palette', key: 'playerControllerColor' },
        fillOpacity: 0.8
      }
    }
  }
};
