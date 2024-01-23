import type { IAxisCommonTheme } from '../../../../../component/axis';
import { THEME_CONSTANTS } from '../../constants';

export const commonAxis: IAxisCommonTheme = {
  domainLine: {
    visible: true,
    style: {
      lineWidth: 10,
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
    inside: false,
    tickSize: THEME_CONSTANTS.axisTickSize,
    alignWithLabel: true,
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
    inside: false,
    space: 10,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      fill: { type: 'palette', key: 'axisLabelFontColor' },
      fontWeight: 'normal',
      fillOpacity: 1
    }
  },
  title: {
    space: 10,
    padding: 0,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      fill: { type: 'palette', key: 'secondaryFontColor' },
      fontWeight: 'normal',
      fillOpacity: 1
    }
  }
};
