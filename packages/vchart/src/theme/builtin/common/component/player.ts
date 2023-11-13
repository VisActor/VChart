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
      // TODO: 类型问题
      // @ts-ignore
      fill: { type: 'palette', key: 'dataZoomSelectedColor' },
      fillOpacity: 0.8
    },
    railStyle: {
      // TODO: 类型问题
      // @ts-ignore
      fill: { type: 'palette', key: 'dataZoomBackgroundColor' }
    },
    handlerStyle: {
      size: 15,
      // TODO: 类型问题
      // @ts-ignore
      stroke: { type: 'palette', key: 'backgroundColor' },
      lineWidth: 2,
      // TODO: 类型问题
      // @ts-ignore
      fill: { type: 'palette', key: 'dataZoomSelectedColor' }
    }
  },
  controller: {
    start: {
      order: 0,
      space: 0,
      style: {
        size: 25,
        // TODO: 类型问题
        // @ts-ignore
        fill: { type: 'palette', key: 'dataZoomSelectedColor' },
        fillOpacity: 0.8
      }
    },
    pause: {
      order: 0,
      space: 0,
      style: {
        size: 25,
        // TODO: 类型问题
        // @ts-ignore
        fill: { type: 'palette', key: 'dataZoomSelectedColor' },
        fillOpacity: 0.8
      }
    },
    backward: {
      order: 0,
      space: 10,
      position: 'start',
      style: {
        size: 12,
        // TODO: 类型问题
        // @ts-ignore
        fill: { type: 'palette', key: 'dataZoomSelectedColor' },
        fillOpacity: 0.8
      }
    },
    forward: {
      order: 0,
      space: 10,
      position: 'end',
      style: {
        size: 12,
        // TODO: 类型问题
        // @ts-ignore
        fill: { type: 'palette', key: 'dataZoomSelectedColor' },
        fillOpacity: 0.8
      }
    }
  }
};
