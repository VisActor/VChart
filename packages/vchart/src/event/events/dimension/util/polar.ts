import type { IChart } from '../../../../chart/interface';
import type { IDimensionInfo } from '../interface';
import { isDiscrete } from '@visactor/vscale';
import { getDimensionData, isInRegionBound } from './common';
import type { IPolarSeries } from '../../../../series/interface';
import { isNil } from '@visactor/vutils';
import type { PolarAxis } from '../../../../component/axis/polar';
import { distance, vectorAngle } from '../../../../util/math';
import type { AxisComponent } from '../../../../component/axis/base-axis';
import type { ILayoutPoint } from '../../../../typings/layout';

const getAxis = (chart: IChart, type: 'radius' | 'angle', pos: ILayoutPoint): PolarAxis[] | null => {
  const axesComponents = chart
    .getAllComponents()
    .filter(
      c =>
        c.specKey === 'axes' &&
        (c as AxisComponent).getOrient() === type &&
        isInRegionBound(chart, c as AxisComponent, pos)
    ) as PolarAxis[];
  if (!axesComponents.length) {
    return null;
  }
  return axesComponents;
};

const getFirstSeries = (chart: IChart) => {
  const regions = chart.getRegionsInIndex();
  for (let i = 0; i < regions.length; i++) {
    const r = regions[i];
    const series = r.getSeries();
    for (let j = 0; j < series.length; j++) {
      const s = series[j];
      if (s.coordinate === 'polar') {
        return s as IPolarSeries;
      }
    }
  }
  return null;
};

/** 将角度标准化为 range 范围内的角度 */
const angleStandardize = (angle: number, range: [number, number]) => {
  const unit = Math.PI * 2;
  const min = Math.min(...range);
  const max = Math.max(...range);
  if (angle < min) {
    angle += Math.ceil((min - angle) / unit) * unit;
  } else if (angle > max) {
    angle -= Math.ceil((angle - max) / unit) * unit;
  }
  return angle;
};

export const getPolarDimensionInfo = (chart: IChart | undefined, pos: ILayoutPoint): IDimensionInfo[] | null => {
  if (!chart) {
    return null;
  }
  const series = getFirstSeries(chart);
  if (!series) {
    return null;
  }

  const { x, y } = pos;
  const angleAxisList = getAxis(chart, 'angle', pos);
  const radiusAxisList = getAxis(chart, 'radius', pos);
  const targetAxisInfo: IDimensionInfo[] = [];

  const getDimensionField = (series: IPolarSeries) => series.getDimensionField()[0];

  if (angleAxisList) {
    angleAxisList.forEach(axis => {
      const angleScale = axis.getScale();
      const angleDomain = angleScale?.domain();
      const angleRange = angleScale?.range();

      // 限定为离散轴
      if (angleScale && isDiscrete(angleScale.type)) {
        const center = axis.getCenter();
        const vector = {
          x: x - axis.getLayoutStartPoint().x - center.x,
          y: y - axis.getLayoutStartPoint().y - center.y
        };

        // 计算顺时针角度
        let angle = vectorAngle({ x: 1, y: 0 }, vector);
        angle = angleStandardize(angle, angleRange);

        // 计算半径
        const radius = distance(vector);
        const radiusScale = radiusAxisList[0]?.getScale(); // FIXME: 想办法获取到和当前角度轴对应的径向轴，而不是取第一个
        const radiusRange = radiusScale?.range();

        // 判断是否在 range 范围内
        if (
          (angle - angleRange?.[0]) * (angle - angleRange?.[1]) > 0 ||
          (radius - radiusRange?.[0]) * (radius - radiusRange?.[1]) > 0
        ) {
          return;
        }

        const value = axis.invert(angle);
        if (isNil(value)) {
          return;
        }
        let index: number | undefined = angleDomain.findIndex((v: any) => v?.toString() === value.toString());
        if (index < 0) {
          index = undefined;
        }

        const data = getDimensionData(value, axis, 'polar', getDimensionField);
        targetAxisInfo.push({ index, value, axis, data });
      }
    });
  }
  if (radiusAxisList) {
    radiusAxisList.forEach(axis => {
      const radiusScale = axis.getScale();
      const radiusRange = radiusScale?.range();

      // 限定为离散轴
      if (radiusScale && isDiscrete(radiusScale.type)) {
        const center = axis.getCenter();
        const vector = {
          x: x - axis.getLayoutStartPoint().x - center.x,
          y: y - axis.getLayoutStartPoint().y - center.y
        };

        // 计算顺时针角度
        let angle = vectorAngle({ x: 1, y: 0 }, vector);
        if (angle < -Math.PI / 2) {
          angle = Math.PI * 2 + angle;
        }

        // 计算半径
        const radius = distance(vector);
        const angleScale = angleAxisList[0]?.getScale(); // FIXME: 想办法获取到和当前径向轴对应的角度轴，而不是取第一个
        const angleRange = angleScale?.range();

        // 判断是否在 range 范围内
        if (
          (angle - angleRange?.[0]) * (angle - angleRange?.[1]) > 0 ||
          (radius - radiusRange?.[0]) * (radius - radiusRange?.[1]) > 0
        ) {
          return;
        }

        const value = radiusScale.invert(radius);
        if (isNil(value)) {
          return;
        }
        const domain = radiusScale.domain();
        let index: number | undefined = domain.findIndex((v: any) => v?.toString() === value.toString());
        if (index < 0) {
          index = undefined;
        }

        const data = getDimensionData(value, axis, 'polar', getDimensionField);
        targetAxisInfo.push({ index, value, axis, data });
      }
    });
  }
  if (!targetAxisInfo.length) {
    return null;
  }
  return targetAxisInfo;
};
