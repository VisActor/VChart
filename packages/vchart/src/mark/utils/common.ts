import { MarkTypeEnum } from '../interface/type';
import { Direction } from '../../typings';

export const MultiDatumMark = [MarkTypeEnum.line, MarkTypeEnum.area, 'trail'];

export function isMultiDatumMark(type: MarkTypeEnum) {
  return MultiDatumMark.includes(type);
}

export function curveTypeTransform(type: string, direction: string) {
  if (type === 'monotone') {
    return direction === Direction.horizontal ? 'monotoneY' : 'monotoneX';
  }
  return type;
}

export function is3DMark(type: MarkTypeEnum) {
  return [MarkTypeEnum.arc3d, MarkTypeEnum.rect3d, MarkTypeEnum.pyramid3d].includes(type);
}
