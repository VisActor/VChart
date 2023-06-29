import { MarkTypeEnum } from '../interface';

export const MultiDatumMark = [MarkTypeEnum.line, MarkTypeEnum.area, 'trail'];

export function isMultiDatumMark(type: MarkTypeEnum) {
  return MultiDatumMark.includes(type);
}
