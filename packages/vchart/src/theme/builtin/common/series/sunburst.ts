import { POLAR_END_ANGLE, POLAR_START_ANGLE } from '../../../../constant';
import type { ISunburstSeriesTheme } from '../../../../series/sunburst/interface';

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
      fontSize: { type: 'token', key: 'l5FontSize' },
      lineHeight: { type: 'token', key: 'l5LineHeight' }
    }
  }
};
