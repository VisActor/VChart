import type { BandScale } from '@visactor/vscale';
import type { IPolarSeries } from '../../../series';
import type { IHair, IHairRadius } from '../base';
import type { AxisCurrentValueMap, IPolarCrosshairInfo } from '../interface';
import { getAxisLabelOffset } from '../../axis/util';
import { PointService, clamp, getAngleByPoint, getIntersectPoint, isValid, polarToCartesian } from '@visactor/vutils';
import type { IPolarAxis } from '../../axis';
import { getFormatFunction } from '../../util';
import { mergeSpec } from '@visactor/vutils-extension';
import { toFixedCrosshairLabelValue } from './common';

export const layoutByValue = (
  series: IPolarSeries,
  currValueAngle: AxisCurrentValueMap,
  currValueRadius: AxisCurrentValueMap,
  angleHair: IHair,
  radiusHair: IHair,
  enableRemain: boolean = false,
  cacheAngleCrossHairInfo?: IPolarCrosshairInfo,
  cacheRadiusCrossHairInfo?: IPolarCrosshairInfo
) => {
  let angleCrossHairInfo = {
    x: 0,
    y: 0,
    center: { x: 0, y: 0 },
    radius: 0,
    distance: 0,
    startAngle: 0,
    endAngle: 0,
    innerRadius: 0,
    visible: false,
    label: { visible: false, text: '', offset: 0 }
  } as IPolarCrosshairInfo;
  let radiusCrossHairInfo = {
    x: 0,
    y: 0,
    center: { x: 0, y: 0 },
    radius: 0,
    distance: 0,
    startAngle: 0,
    endAngle: 0,
    innerRadius: 0,
    visible: false,
    sides: (series.angleAxisHelper.getScale(0) as BandScale).domain().length,
    label: { visible: false, text: '', offset: 0 }
  } as IPolarCrosshairInfo;

  // 计算x轴和y轴的数据，只允许最多一对x和一对y
  if (angleHair) {
    angleCrossHairInfo.visible = !!currValueAngle.size;
    const bandWidth = series.angleAxisHelper.getBandwidth(0);
    currValueAngle.forEach(({ axis, value, coord, ...rest }) => {
      value = value ?? '';
      mergeSpec(angleCrossHairInfo, rest);
      const angle = series.angleAxisHelper.dataToPosition([value]);
      angleCrossHairInfo.angle = angle;
      if (angleHair.label?.visible) {
        angleCrossHairInfo.label.visible = true;
        angleCrossHairInfo.label.value = value;
        angleCrossHairInfo.label.text = toFixedCrosshairLabelValue(axis, value);
        angleCrossHairInfo.label.offset = getAxisLabelOffset(axis.getSpec());
      }

      angleCrossHairInfo.startAngle = angle - bandWidth / 2;
      angleCrossHairInfo.endAngle = angle + bandWidth / 2;
    });
  }

  if (radiusHair) {
    radiusCrossHairInfo.visible = !!currValueRadius.size;
    currValueRadius.forEach(({ axis, value, coord, ...rest }) => {
      value = value ?? '';
      if (radiusHair.label?.visible) {
        radiusCrossHairInfo.label.visible = true;
        radiusCrossHairInfo.label.value = value;
        radiusCrossHairInfo.label.text = toFixedCrosshairLabelValue(axis, value);
        radiusCrossHairInfo.label.offset = getAxisLabelOffset(axis.getSpec());
      }
      radiusCrossHairInfo.angle = coord.angle;
      radiusCrossHairInfo.axis = axis as IPolarAxis;
      mergeSpec(radiusCrossHairInfo, rest);
    });
  }

  if (enableRemain && !angleCrossHairInfo.visible && isValid(cacheAngleCrossHairInfo)) {
    angleCrossHairInfo = cacheAngleCrossHairInfo;
  } else {
    if (angleCrossHairInfo.label.visible) {
      if (angleHair && angleHair.label) {
        const { label } = angleCrossHairInfo;
        const { formatMethod, formatter } = angleHair.label;
        const { formatFunc, args } = getFormatFunction(formatMethod, formatter, label.text, {
          label: label.text,
          value: label.value,
          orient: 'angle'
        });
        if (formatFunc) {
          label.text = formatFunc(...args);
        }
      }
    }
  }

  if (enableRemain && !radiusCrossHairInfo.visible && isValid(cacheRadiusCrossHairInfo)) {
    radiusCrossHairInfo = cacheRadiusCrossHairInfo;
  } else {
    if (radiusCrossHairInfo.label.visible) {
      if (radiusHair && radiusHair.label) {
        const { label } = radiusCrossHairInfo;
        const { formatMethod, formatter } = radiusHair.label;
        const { formatFunc, args } = getFormatFunction(formatMethod, formatter, label.text, {
          label: label.text,
          value: label.value,
          orient: 'radius'
        });
        if (formatFunc) {
          label.text = formatFunc(...args);
        }
      }
    }
  }

  return {
    angle: angleCrossHairInfo,
    radius: radiusCrossHairInfo
  };
};

export const layoutAngleCrosshair = (angleHair: IHair, crosshairInfo: IPolarCrosshairInfo) => {
  const { angle, innerRadius, radius, startAngle, endAngle, center } = crosshairInfo;

  const crosshairType = angleHair.type === 'rect' ? 'sector' : 'line';
  let positionAttrs;
  if (crosshairType === 'sector') {
    positionAttrs = {
      center,
      innerRadius,
      radius,
      startAngle: startAngle,
      endAngle: endAngle
    };
  } else {
    positionAttrs = {
      start: polarToCartesian(center, innerRadius, angle),
      end: polarToCartesian(center, radius, angle)
    };
  }

  return positionAttrs;
};

export const layoutRadiusCrosshair = (radiusHair: IHairRadius, crosshairInfo: IPolarCrosshairInfo) => {
  const { center, startAngle, endAngle, distance, sides, axis, point, radius, innerRadius } = crosshairInfo;

  const crosshairType = radiusHair.smooth ? 'circle' : 'polygon';

  let polygonRadius = distance;
  if (crosshairType === 'polygon') {
    const axisCenter = axis.getCenter();
    // 需要计算半径
    // 获取当前点的角度
    const curAngle = getAngleByPoint(axisCenter, point);
    const stepAngle = (endAngle - startAngle) / sides;
    const index = Math.floor((curAngle - startAngle) / stepAngle);
    const preAngle = index * stepAngle + startAngle;
    const nextAngle = Math.min((index + 1) * stepAngle + startAngle, endAngle);

    const prePoint = polarToCartesian(axisCenter, distance, preAngle);
    const nextPoint = polarToCartesian(axisCenter, distance, nextAngle);
    // 求交点
    const insertPoint = getIntersectPoint(
      [nextPoint.x, nextPoint.y],
      [prePoint.x, prePoint.y],
      [axisCenter.x, axisCenter.y],
      [point.x, point.y]
    );
    if (insertPoint) {
      polygonRadius = clamp(
        PointService.distancePN(point, insertPoint[0], insertPoint[1]) + distance,
        innerRadius,
        radius
      );
    }
  }
  const positionAttrs = {
    center,
    startAngle: startAngle,
    endAngle: endAngle,
    radius: polygonRadius,
    sides
  };

  return positionAttrs;
};
