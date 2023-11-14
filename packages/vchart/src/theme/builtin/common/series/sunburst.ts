import { POLAR_END_ANGLE, POLAR_START_ANGLE } from '../../../../constant';
import type { ISunburstSeriesTheme } from '../../../../series/sunburst/interface';
import { THEME_CONSTANTS } from '../constants';

export const sunburst: ISunburstSeriesTheme = {
  innerRadius: 0,
  outerRadius: 1,
  startAngle: POLAR_START_ANGLE,
  endAngle: POLAR_END_ANGLE,
  gap: 0,
  labelLayout: {
    align: 'center',
    offset: 0,
    rotate: 'radial'
  },
  sunburst: {
    style: {
      stroke: { type: 'palette', key: 'backgroundColor' },
      fillOpacity: 1,
      cursor: 'pointer'
    }
  },
  label: {
    visible: true,
    style: {
      cursor: 'pointer',
      fill: { type: 'palette', key: 'primaryFontColor' },
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    }
  }
};
