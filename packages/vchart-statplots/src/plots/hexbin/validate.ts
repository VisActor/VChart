import type { HexbinPlotSpec } from './types';
import { issue } from '../../common/validation';
import { hexbinSpace, isHexbinSpaceRepresentable } from './binning';

export function validateHexbin(spec: HexbinPlotSpec) {
  return isHexbinSpaceRepresentable(hexbinSpace(spec.data), spec.binning?.xBins ?? 30)
    ? []
    : [issue('INVALID_RANGE', '/data', '数据范围无法用有限数值表示六边形顶点；请先转换单位或平移坐标')];
}
