import type { IScrollBarTheme } from '../../../../component/data-zoom';

export const scrollBar: IScrollBarTheme = {
  horizontal: {
    height: 10,
    slider: {
      style: {
        fill: { type: 'palette', key: 'scrollBarSliderColor' }
      }
    }
  },
  vertical: {
    width: 10,
    slider: {
      style: {
        fill: { type: 'palette', key: 'scrollBarSliderColor' }
      }
    }
  }
};
