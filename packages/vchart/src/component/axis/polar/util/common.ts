import { ComponentTypeEnum } from '../../../interface';
import type { IPolarAxisCommonSpec } from '../interface';

export const getPolarAxisInfo = (spec: IPolarAxisCommonSpec) => {
  // TODO: 基于数据处理 axis 类型
  const axisType = spec.type ?? (spec.orient === 'angle' ? 'band' : 'linear');
  const componentName = `${ComponentTypeEnum.polarAxis}-${axisType}`;
  return { axisType, componentName };
};
