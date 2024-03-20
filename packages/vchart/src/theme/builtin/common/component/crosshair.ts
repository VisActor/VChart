import type {
  ICrosshairLineSpec,
  ICrosshairRectSpec,
  ICrosshairValueFieldSpec,
  ICrosshairCategoryFieldSpec,
  ICrosshairLabelSpec,
  ICrosshairTheme
} from '../../../../component/crosshair/interface';

const getLabelSpec = (): ICrosshairLabelSpec => ({
  visible: false,
  style: {
    fontWeight: 'normal',
    fill: { type: 'palette', key: 'axisMarkerFontColor' },
    fontSize: { type: 'token', key: 'l5FontSize' }
    //lineHeight: { type: 'token', key: 'l5LineHeight' },
  },
  labelBackground: {
    padding: {
      bottom: 0,
      top: 0,
      left: 2,
      right: 2
    },
    style: {
      fill: { type: 'palette', key: 'axisMarkerBackgroundColor' },
      cornerRadius: 1
    }
  }
});

const getBandField = (): ICrosshairCategoryFieldSpec => ({
  visible: false,
  line: {
    type: 'rect',
    visible: true,
    style: {
      lineWidth: 0,
      stroke: { type: 'palette', key: 'markLineStrokeColor' },
      strokeOpacity: 0.7,
      fill: { type: 'palette', key: 'axisGridColor' },
      fillOpacity: 0.7,
      lineDash: [2, 3]
    }
  } as ICrosshairRectSpec,
  label: getLabelSpec()
});

const getLinearField = (): ICrosshairValueFieldSpec => ({
  visible: false,
  line: {
    type: 'line',
    visible: true,
    style: {
      stroke: { type: 'palette', key: 'markLineStrokeColor' },
      strokeOpacity: 0.7,
      fill: { type: 'palette', key: 'axisGridColor' },
      fillOpacity: 0.7,
      lineDash: [2, 3]
    }
  } as ICrosshairLineSpec,
  label: getLabelSpec()
});

export const crosshair: ICrosshairTheme = {
  trigger: 'hover',
  bandField: getBandField(),
  linearField: getLinearField()
};
