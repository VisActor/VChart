import { isValid } from '@visactor/vutils';
import { POLAR_DEFAULT_RADIUS, POLAR_END_ANGLE, POLAR_START_ANGLE } from '../../../../constant';
import { ComponentTypeEnum } from '../../../interface';
import type { IPolarAxisCommonSpec } from '../interface';

export const getPolarAxisInfo = (spec: IPolarAxisCommonSpec, chartSpec: any) => {
  // TODO: 基于数据处理 axis 类型
  const axisType = spec.type ?? (spec.orient === 'angle' ? 'band' : 'linear');
  const componentName = `${ComponentTypeEnum.polarAxis}-${axisType}`;

  const startAngleFromSpec = spec.startAngle ?? chartSpec.startAngle;
  const endAngleFromSpec = spec.endAngle ?? chartSpec.endAngle;
  return {
    axisType,
    componentName,
    startAngle: startAngleFromSpec ?? POLAR_START_ANGLE,
    endAngle: endAngleFromSpec ?? (isValid(startAngleFromSpec) ? startAngleFromSpec + 360 : POLAR_END_ANGLE),
    center: isValid(chartSpec.center)
      ? chartSpec.center
      : isValid(chartSpec?.centerX) || isValid(chartSpec?.centerY)
      ? {
          x: chartSpec?.centerX,
          y: chartSpec?.centerY
        }
      : undefined,
    // 优先使用 outerRadius, 但要兼容 radius
    outerRadius: spec.radius ?? chartSpec.outerRadius ?? chartSpec.radius ?? POLAR_DEFAULT_RADIUS,
    layoutRadius: chartSpec.layoutRadius
  };
};
