// import type { IAreaChartSpec } from "@visactor/vchart";
import type { IChartInfo } from './interface';

const style1 = {
  panel: {
    padding: {
      top: 5,
      bottom: 10,
      left: 10,
      right: 10
    },
    backgroundColor: '#d0021b',
    border: {
      color: '#CFCFCF',
      width: 0,
      radius: 2
    },
    shadow: {
      x: 0,
      y: 4,
      blur: 12,
      spread: 0,
      color: 'rgba(0, 0, 0, 0.2)'
    }
  },
  titleLabel: {
    fontSize: 14,
    fontColor: '#FFF',
    fontWeight: 'bold',
    fontFamily: 'D-DIN',
    align: 'left',
    lineHeight: 18
  },
  keyLabel: {
    fontSize: 12,
    fontColor: 'rgba(255,255,255,0.65)',
    fontWeight: 'normal',
    fontFamily: 'SourceHanSansCN-Normal',
    align: 'left',
    lineHeight: 18
  },
  valueLabel: {
    fontSize: 12,
    fontColor: '#FFF',
    fontWeight: 'normal',
    fontFamily: 'D-DIN',
    align: 'right',
    lineHeight: 18
  },
  shape: {
    size: 10,
    spacing: 10
  },
  spaceRow: 10
};
export default {
  title: 'Area Chart',
  spec: {
    type: 'area',
    data: {
      values: [
        { type: 'Nail polish', country: 'Africa', value: 4229 },
        { type: 'Nail polish', country: 'EU', value: 4376 },
        { type: 'Nail polish', country: 'China', value: 3054 },
        { type: 'Nail polish', country: 'USA', value: 12814 },
        { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
        { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
        { type: 'Eyebrow pencil', country: 'China', value: 5067 },
        { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
        { type: 'Rouge', country: 'Africa', value: 5221 },
        { type: 'Rouge', country: 'EU', value: 3574 },
        { type: 'Rouge', country: 'China', value: 7004 },
        { type: 'Rouge', country: 'USA', value: 11624 },
        { type: 'Lipstick', country: 'Africa', value: 9256 },
        { type: 'Lipstick', country: 'EU', value: 4376 },
        { type: 'Lipstick', country: 'China', value: 9054 },
        { type: 'Lipstick', country: 'USA', value: 8814 },
        { type: 'Eyeshadows', country: 'Africa', value: 3308 },
        { type: 'Eyeshadows', country: 'EU', value: 4572 },
        { type: 'Eyeshadows', country: 'China', value: 12043 },
        { type: 'Eyeshadows', country: 'USA', value: 12998 },
        { type: 'Eyeliner', country: 'Africa', value: 5432 },
        { type: 'Eyeliner', country: 'EU', value: 3417 },
        { type: 'Eyeliner', country: 'China', value: 15067 },
        { type: 'Eyeliner', country: 'USA', value: 12321 },
        { type: 'Foundation', country: 'Africa', value: 13701 },
        { type: 'Foundation', country: 'EU', value: 5231 },
        { type: 'Foundation', country: 'China', value: 10119 },
        { type: 'Foundation', country: 'USA', value: 10342 },
        { type: 'Lip gloss', country: 'Africa', value: 4008 },
        { type: 'Lip gloss', country: 'EU', value: 4572 },
        { type: 'Lip gloss', country: 'China', value: 12043 },
        { type: 'Lip gloss', country: 'USA', value: 22998 },
        { type: 'Mascara', country: 'Africa', value: 18712 },
        { type: 'Mascara', country: 'EU', value: 6134 },
        { type: 'Mascara', country: 'China', value: 10419 },
        { type: 'Mascara', country: 'USA', value: 11261 }
      ]
    },
    title: {
      visible: true,
      text: 'Stacked area chart of cosmetic products sales',
      subtext: 'Stacked area chart of cosmetic products sales'
    },
    // stack: true,
    xField: 'type',
    yField: 'value',
    seriesField: 'country',
    legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
    crosshair: {
      xField: { visible: true, label: { visible: true } },
      yField: { visible: true, label: { visible: true } }
    },
    axes: [
      { type: 'band', orient: 'bottom', title: { visible: true } },
      { type: 'linear', orient: 'left', title: { visible: true } }
    ],
    tooltip: {
      renderMode: 'canvas',
      style: style1
    }
  }
} as IChartInfo;
