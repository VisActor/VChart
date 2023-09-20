import {
  IconBarChart,
  IconBarLineChart,
  IconGroupBarChart,
  IconLineChart,
  IconPercentageBarChart,
  IconStackBarChart
} from '../svg/chart';
import type { Fill, Stroke, TextColor } from '../typings/editor-bar';

export const defaultEditorBarComponentConfig = {
  chart: {
    default: 'bar',
    chartList: [
      {
        type: 'bar',
        icon: <IconBarChart />,
        label: '基础柱状图'
      },
      {
        type: 'groupBar',
        icon: <IconGroupBarChart />,
        label: '分组柱状图'
      },
      {
        type: 'stackBar',
        icon: <IconStackBarChart />,
        label: '堆叠柱状图'
      },
      {
        type: 'percentageBar',
        icon: <IconPercentageBarChart />,
        label: '百分比堆叠图'
      },
      {
        type: 'line',
        icon: <IconLineChart />,
        label: '折线图'
      },
      {
        type: 'combine',
        icon: <IconBarLineChart />,
        label: '柱线组合图'
      }
    ]
  },
  palette: {
    default: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00', '#4F44CF', '#5AC8FA', '#003A8C', '#B08AE2'],
    paletteList: [
      ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00', '#4F44CF', '#5AC8FA', '#003A8C', '#B08AE2'],
      ['#4BC7A2', '#2E75D2', '#34B6FD', '#F5C040', '#98DD62', '#7272E1', '#87DBDD', '#FF8406']
    ]
  },
  fontSize: {
    default: 14,
    fontSizeList: [14, 16, 20, 24, 32, 36, 40]
  },
  fill: {
    default: { color: 'disable', opacity: 1 } as Fill,
    colorList: [
      ['disable', '#FFFFFF', '#EFF0F1', '#EFE6FE', '#E0E9FF', '#D0F5CE', '#FFFCA3', '#FEE7CD', '#FEE3E2'],
      ['#000000', '#646A73', '#BBBFC4', '#9F6FF1', '#5083FB', '#32A645', '#FFE928', '#ED6D0C', '#F54A45']
    ]
  },
  stroke: {
    default: { color: '#000000', opacity: 1, lineWidth: 1, style: 'disable' } as Stroke,
    colorList: [
      ['#000000', '#646A73', '#BBBFC4', '#DEE0E3', '#EFF0F1', '#FFFFFF'],
      ['#9F6FF1', '#5083FB', '#32A645', '#FFE928', '#ED6D0C', '#F54A45']
    ]
  },
  textColor: {
    default: { color: '#1F2329', backgroundColor: 'disable' } as TextColor,
    colorList: [['#1F2329', '#8F959E', '#FFFFFF', '#7A35F0', '#1456F0', '#2EA121', '#865B03', '#A44904', '#C02A26']],
    backgroundColorList: [
      ['disable', '#FFFFFF', '#EFF0F1', '#EFE6FE', '#E0E9FF', '#D0F5CE', '#FFFCA3', '#FEE7CD', '#FEE3E2'],
      ['#000000', '#646A73', '#BBBFC4', '#9F6FF1', '#5083FB', '#32A645', '#FFE928', '#ED6D0C', '#F54A45']
    ]
  },
  bold: {
    default: false
  }
};
