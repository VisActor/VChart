import type { IGlobalMarkThemeByName, IGlobalMarkThemeByType } from '../../interface';
import { THEME_CONSTANTS } from './constants';

export const markByType: IGlobalMarkThemeByType = {
  text: {
    style: {
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE,
      fontWeight: 'normal',
      fillOpacity: 1
    }
  }
};

export const markByName: IGlobalMarkThemeByName = {
  label: {
    style: {
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE,
      fontWeight: 'normal',
      fillOpacity: 1
    }
  },
  area: {
    style: {
      fillOpacity: 0.2
    }
  },
  line: {
    style: {
      lineWidth: 2,
      lineCap: 'round'
    }
  },
  point: {
    style: {
      size: 8,
      stroke: { type: 'palette', key: 'backgroundColor' },
      lineWidth: 1,
      fillOpacity: 1
    }
  },
  word: {
    style: {
      fontSize: null
    }
  },
  fillingWord: {
    style: {
      fontSize: null
    }
  },
  sunburst: {
    style: {
      lineWidth: 1,
      stroke: { type: 'palette', key: 'backgroundColor' }
    }
  },
  circlePacking: {
    style: {
      lineWidth: 1,
      stroke: { type: 'palette', key: 'backgroundColor' }
    }
  },
  funnel3d: {
    style: {
      stroke: false
    }
  }
};
