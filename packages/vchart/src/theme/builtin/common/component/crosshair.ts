import type {
  ICrosshairLineSpec,
  ICrosshairRectSpec,
  ICrosshairTheme,
  ICrosshairValueFieldSpec,
  ICrosshairCategoryFieldSpec
} from '../../../../component/crosshair/interface';
import { THEME_CONSTANTS } from '../constants';

const getBandField = (): ICrosshairCategoryFieldSpec => ({
  visible: false,
  line: {
    type: 'rect',
    visible: true,
    style: {
      fill: { type: 'palette', key: 'axisGridColor' },
      opacity: 0.7,
      lineDash: []
    }
  } as ICrosshairRectSpec,
  label: {
    visible: false,
    style: {
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'labelReverseFontColor' },
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily
    },
    labelBackground: {
      padding: {
        bottom: 4,
        top: 0,
        left: 5,
        right: 5
      },
      style: {
        fill: { type: 'palette', key: 'primaryFontColor' },
        cornerRadius: 3
      }
    }
  }
});

const getLinearField = (): ICrosshairValueFieldSpec => ({
  visible: false,
  line: {
    type: 'line',
    visible: true,
    style: {
      stroke: { type: 'palette', key: 'secondaryFontColor' },
      opacity: 0.7,
      lineDash: [2, 3]
    }
  } as ICrosshairLineSpec,
  label: {
    visible: false,
    style: {
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'labelReverseFontColor' },
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily
    },
    labelBackground: {
      padding: {
        bottom: 4,
        top: 0,
        left: 5,
        right: 5
      },
      style: {
        fill: { type: 'palette', key: 'primaryFontColor' },
        cornerRadius: 3
      }
    }
  }
});

export const crosshair: ICrosshairTheme = {
  trigger: 'hover',
  bandField: getBandField(),
  linearField: getLinearField()
};
