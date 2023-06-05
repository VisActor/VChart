import { MarkTypeEnum } from '../interface';

export const MultiDatumMark = [MarkTypeEnum.line, MarkTypeEnum.area, 'trail'];

export function isMultiDatumMark(type: MarkTypeEnum) {
  return MultiDatumMark.includes(type);
}

export const DUPLICATED_ATTRS = {
  interpolate: 'curveType',
  strokeWidth: 'lineWidth',
  font: 'fontFamily',
  baseline: 'textBaseline',
  align: 'textAlign',
  strokeCap: 'lineCap',
  strokeDash: 'lineDash',
  strokeDashOffset: 'lineDashOffset',
  strokeJoin: 'lineJoin',
  strokeMiterLimit: 'miterLimit'
};
