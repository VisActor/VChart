import type { IAxisCommonTheme } from '../../../../../component/axis';
import { THEME_CONSTANTS } from '../../constants';

export const commonAxis: IAxisCommonTheme = {
  domainLine: {
    visible: true,
    style: {
      lineWidth: 1,
      stroke: { type: 'palette', key: 'axisDomainColor' },
      strokeOpacity: 1
    }
  },
  grid: {
    visible: true,
    style: {
      lineWidth: 1,
      stroke: { type: 'palette', key: 'axisGridColor' },
      strokeOpacity: 1,
      lineDash: []
    }
  },
  subGrid: {
    visible: false,
    style: {
      lineWidth: 1,
      stroke: { type: 'palette', key: 'axisGridColor' },
      strokeOpacity: 1,
      lineDash: [4, 4]
    }
  },
  tick: {
    visible: true,
    tickSize: THEME_CONSTANTS.axisTickSize,
    style: {
      lineWidth: 1,
      stroke: { type: 'palette', key: 'axisDomainColor' },
      strokeOpacity: 1
    }
  },
  subTick: {
    visible: false,
    tickSize: THEME_CONSTANTS.axisTickSize / 2,
    style: {
      lineWidth: 1,
      stroke: { type: 'palette', key: 'axisDomainColor' },
      strokeOpacity: 1
    }
  },
  label: {
    visible: true,
    space: 10,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      // lineHeight: THEME_CONSTANTS.l5LineHeight,
      fill: { type: 'palette', key: 'axisFontColor' },
      fontWeight: 'normal',
      fillOpacity: 1
    }
  },
  title: {
    space: 10,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,

      fill: { type: 'palette', key: 'secondaryFontColor' },
      fontWeight: 'normal',
      fillOpacity: 1
    }
  }
};
