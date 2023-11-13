import { minMaxPositionEnum, type IRangeColumnSeriesTheme } from '../../../../series/range-column/interface';

export const rangeColumn: IRangeColumnSeriesTheme = {
  label: {
    visible: false,
    offset: 5,
    position: 'inside',
    style: {
      // TODO: 类型问题
      // @ts-ignore
      fill: { type: 'palette', key: 'labelReverseFontColor' }
    },
    minLabel: {
      position: minMaxPositionEnum.end
    },
    maxLabel: {
      position: minMaxPositionEnum.start
    }
  }
};
