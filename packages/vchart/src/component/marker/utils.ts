import type { ICartesianSeries, IGeoSeries, IPolarSeries, ISeries } from '../../series/interface';
import type { DataView } from '@visactor/vdataset';
import {
  isValid,
  isNumber,
  array,
  minInArray,
  maxInArray,
  isArray,
  normalizePadding,
  isFunction,
  type IPointLike
} from '@visactor/vutils';
import type { Datum, IPoint, StringOrNumber } from '../../typings';
import { isPercent, transformToGraphic } from '../../util';
import type {
  IDataPos,
  IMarkerLabelSpec,
  IMarkerState,
  IMarkerSupportSeries,
  IPolarPoint,
  MarkerPositionPoint,
  MarkerStateValue
} from './interface';
import { AGGR_TYPE } from '../../constant/marker';
import type { IRegion } from '../../region/interface';
// eslint-disable-next-line no-duplicate-imports
import type { OffsetPoint } from './interface';

function isNeedExtendDomain(domain: number[], datum: number, autoRange: boolean) {
  if (!autoRange) {
    return false;
  }
  const domainNum = domain.map((n: any) => n * 1);
  const min = minInArray(domainNum);
  const max = maxInArray(domainNum);
  if (datum < min || datum > max) {
    return true;
  }
  return false;
}

function getXValue(
  datum: Datum,
  xDomain: number[],
  autoRange: boolean,
  refSeries: { [key: string]: IMarkerSupportSeries },
  regionWidth: number,
  regionStartLayoutStartPoint: IPoint
) {
  const { relativeSeries } = refSeries;
  isNumber(datum.x) &&
    isNeedExtendDomain(xDomain, datum.x, autoRange) &&
    (relativeSeries as ICartesianSeries)?.getXAxisHelper().setExtendDomain?.('marker_xAxis_extend', datum.x);
  let x: number;
  if (isPercent(datum.x)) {
    x = convertPercentToValue(datum.x, regionWidth) + regionStartLayoutStartPoint.x;
  } else {
    x = (relativeSeries as ICartesianSeries).getXAxisHelper().dataToPosition([datum.x]) + regionStartLayoutStartPoint.x;
  }

  return x;
}

function getYValue(
  datum: Datum,
  yDomain: number[],
  autoRange: boolean,
  refSeries: { [key: string]: IMarkerSupportSeries },
  regionHeight: number,
  regionStartLayoutStartPoint: IPoint
) {
  const { relativeSeries } = refSeries;
  isNumber(datum.y) &&
    isNeedExtendDomain(yDomain, datum.y, autoRange) &&
    (relativeSeries as ICartesianSeries).getYAxisHelper()?.setExtendDomain?.('marker_yAxis_extend', datum.y);

  let y: number;
  if (isPercent(datum.y)) {
    y = convertPercentToValue(datum.y, regionHeight) + regionStartLayoutStartPoint.y;
  } else {
    y = (relativeSeries as ICartesianSeries).getYAxisHelper().dataToPosition([datum.y]) + regionStartLayoutStartPoint.y;
  }

  return y;
}

function getAngleValue(
  datum: Datum,
  angleDomain: number[],
  autoRange: boolean,
  refSeries: { [key: string]: IMarkerSupportSeries }
) {
  const { relativeSeries } = refSeries;
  isNumber(datum.angle) &&
    isNeedExtendDomain(angleDomain, datum.angle, autoRange) &&
    (relativeSeries as IPolarSeries).angleAxisHelper?.setExtendDomain?.('marker_angleAxis_extend', datum.angle);

  return (relativeSeries as IPolarSeries).angleAxisHelper.dataToPosition([datum.angle]);
}

function getRadiusValue(
  datum: Datum,
  radiusDomain: number[],
  autoRange: boolean,
  refSeries: { [key: string]: IMarkerSupportSeries }
) {
  const { relativeSeries } = refSeries;
  isNumber(datum.radius) &&
    isNeedExtendDomain(radiusDomain, datum.radius, autoRange) &&
    (relativeSeries as IPolarSeries).radiusAxisHelper?.setExtendDomain?.('marker_radiusAxis_extend', datum.radius);

  return (relativeSeries as IPolarSeries).radiusAxisHelper.dataToPosition([datum.radius]);
}

function convertPercentToValue(percent: string, relativeLength: number) {
  return (Number(percent.substring(0, percent.length - 1)) * relativeLength) / 100;
}

export function isAggrSpec(spec: IDataPos) {
  return AGGR_TYPE.includes(spec as any);
}

export function xyLayout(
  data: DataView,
  startRelativeSeries: IMarkerSupportSeries,
  endRelativeSeries: IMarkerSupportSeries,
  relativeSeries: IMarkerSupportSeries,
  autoRange: boolean
) {
  const regionStart = startRelativeSeries.getRegion();
  const regionStartLayoutStartPoint = regionStart.getLayoutStartPoint();
  const regionEnd = endRelativeSeries.getRegion();
  const regionEndLayoutStartPoint = regionEnd.getLayoutStartPoint();

  const regionWidth = Math.abs(
    Math.min(regionStartLayoutStartPoint.x, regionEndLayoutStartPoint.x) -
      Math.max(
        regionStartLayoutStartPoint.x + regionStart.getLayoutRect().width,
        regionEndLayoutStartPoint.x + regionEnd.getLayoutRect().width
      )
  );
  const regionHeight = Math.abs(
    Math.min(regionStartLayoutStartPoint.y, regionEndLayoutStartPoint.y) -
      Math.max(
        regionStartLayoutStartPoint.y + regionStart.getLayoutRect().height,
        regionEndLayoutStartPoint.y + regionEnd.getLayoutRect().height
      )
  );

  const refSeries = {
    relativeSeries,
    startRelativeSeries,
    endRelativeSeries
  };

  const lines: IPoint[][] = [];
  const dataPoints =
    data.latestData[0] && data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  const xDomain = (relativeSeries as ICartesianSeries).getXAxisHelper().getScale(0).domain();
  const yDomain = (relativeSeries as ICartesianSeries).getYAxisHelper().getScale(0).domain();
  dataPoints.forEach((datum: IPoint) => {
    const isValidX = isValid(datum.x);
    const isValidY = isValid(datum.y);
    if (isValidX && isValidY) {
      const x = getXValue(datum, xDomain, autoRange, refSeries, regionWidth, regionStartLayoutStartPoint);
      const y = getYValue(datum, yDomain, autoRange, refSeries, regionHeight, regionStartLayoutStartPoint);
      lines.push([{ x, y }]);
    } else if (isValidX) {
      const x = getXValue(datum, xDomain, autoRange, refSeries, regionWidth, regionStartLayoutStartPoint);
      const y = Math.max(
        regionStartLayoutStartPoint.y + regionStart.getLayoutRect().height,
        regionEndLayoutStartPoint.y + regionEnd.getLayoutRect().height
      );
      const y1 = Math.min(regionStartLayoutStartPoint.y, regionEndLayoutStartPoint.y);
      lines.push([
        {
          x: x,
          y: y
        },
        {
          x: x,
          y: y1
        }
      ]);
    } else if (isValidY) {
      const x = Math.min(regionStartLayoutStartPoint.x, regionEndLayoutStartPoint.x);
      const y = getYValue(datum, yDomain, autoRange, refSeries, regionHeight, regionStartLayoutStartPoint);
      const x1 = Math.max(
        regionStartLayoutStartPoint.x + regionStart.getLayoutRect().width,
        regionEndLayoutStartPoint.x + regionEnd.getLayoutRect().width
      );
      lines.push([
        {
          x: x,
          y: y
        },
        {
          x: x1,
          y: y
        }
      ]);
    }
  });

  return lines;
}

export function polarLayout(
  data: DataView,
  startRelativeSeries: IMarkerSupportSeries,
  endRelativeSeries: IMarkerSupportSeries,
  relativeSeries: IMarkerSupportSeries,
  autoRange: boolean
) {
  const refSeries = {
    relativeSeries,
    startRelativeSeries,
    endRelativeSeries
  };
  const lines: IPolarPoint[][] = [];
  const dataPoints =
    data.latestData[0] && data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;

  const angleDomain = (relativeSeries as IPolarSeries).angleAxisHelper.getScale(0).domain();
  const radiusDomain = (relativeSeries as IPolarSeries).radiusAxisHelper.getScale(0).domain();
  const regionRadius = Math.min(
    relativeSeries.getRegion().getLayoutRect().width / 2,
    relativeSeries.getRegion().getLayoutRect().height / 2
  );
  dataPoints.forEach((datum: IPolarPoint) => {
    const isValidAngle = isValid(datum.angle);
    const isValidRadius = isValid(datum.radius);
    if (isValidAngle && isValidRadius) {
      const angle = getAngleValue(datum, angleDomain, autoRange, refSeries);
      const radius = getRadiusValue(datum, radiusDomain, autoRange, refSeries);
      lines.push([{ angle, radius }]);
    } else if (isValidAngle) {
      const angle = getAngleValue(datum, angleDomain, autoRange, refSeries);
      lines.push([
        {
          angle,
          radius: -regionRadius
        },
        {
          angle,
          radius: regionRadius
        }
      ]);
    } else if (isValidRadius) {
      const radius = getRadiusValue(datum, radiusDomain, autoRange, refSeries);
      lines.push([
        {
          radius,
          angle: 0
        },
        {
          radius,
          angle: Math.PI * 2
        }
      ]);
    }
  });

  return lines;
}

export function geoLayout(data: DataView, relativeSeries: IMarkerSupportSeries) {
  const lines: IPoint[][] = [];
  const dataPoints =
    data.latestData[0] && data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  dataPoints.forEach((datum: any) => {
    const isValidName = isValid(datum.areaName);
    if (isValidName) {
      lines.push([
        {
          x:
            (relativeSeries as IGeoSeries).nameValueToPosition(datum.areaName).x +
            relativeSeries.getRegion().getLayoutStartPoint().x,
          y:
            (relativeSeries as IGeoSeries).nameValueToPosition(datum.areaName).y +
            relativeSeries.getRegion().getLayoutStartPoint().y
        }
      ]);
    }
  });

  return lines;
}

export function cartesianCoordinateLayout(
  data: DataView,
  relativeSeries: IMarkerSupportSeries,
  autoRange: boolean,
  coordinatesOffset: OffsetPoint[] | OffsetPoint
) {
  const points: IPoint[] = [];
  const dataPoints =
    data.latestData[0] && data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  const isArrayCoordinatesOffset = isArray(coordinatesOffset);
  dataPoints.forEach(
    (
      datum: {
        x: StringOrNumber[] | StringOrNumber | null;
        y: StringOrNumber[] | StringOrNumber | null;
        getRefRelativeSeries?: () => ICartesianSeries;
      },
      index: number
    ) => {
      const refRelativeSeries = (
        datum?.getRefRelativeSeries ? datum.getRefRelativeSeries() : relativeSeries
      ) as ICartesianSeries;
      const regionStart = refRelativeSeries.getRegion();
      const regionStartLayoutStartPoint = regionStart.getLayoutStartPoint();

      const { width: regionWidth, height: regionHeight } = regionStart.getLayoutRect();

      let offsetX = 0;
      let offsetY = 0;
      if (coordinatesOffset) {
        const currentCoordinatesOffset = isArrayCoordinatesOffset ? coordinatesOffset[index] : coordinatesOffset;
        const x = currentCoordinatesOffset.x;
        const y = currentCoordinatesOffset.y;
        if (x) {
          offsetX = isPercent(x) ? (Number(x.substring(0, x.length - 1)) * regionWidth) / 100 : (x as number);
        }
        if (y) {
          offsetY = isPercent(y) ? (Number(y.substring(0, y.length - 1)) * regionHeight) / 100 : (y as number);
        }
      }

      const xDomain = refRelativeSeries.getXAxisHelper().getScale(0).domain();
      const yDomain = refRelativeSeries.getYAxisHelper().getScale(0).domain();
      const xValue = array(datum.x);
      const yValue = array(datum.y);

      xValue.length === 1 &&
        isNumber(xValue[0]) &&
        isNeedExtendDomain(xDomain, xValue[0], autoRange) &&
        refRelativeSeries.getXAxisHelper()?.setExtendDomain?.('marker_xAxis_extend', xValue[0] as number);

      yValue.length === 1 &&
        isNumber(yValue[0]) &&
        isNeedExtendDomain(yDomain, yValue[0], autoRange) &&
        refRelativeSeries.getYAxisHelper()?.setExtendDomain?.('marker_yAxis_extend', yValue[0] as number);
      points.push({
        x: refRelativeSeries.getXAxisHelper().dataToPosition(xValue) + regionStartLayoutStartPoint.x + offsetX,
        y: refRelativeSeries.getYAxisHelper().dataToPosition(yValue) + regionStartLayoutStartPoint.y + offsetY
      });
    }
  );
  return points;
}

export function polarCoordinateLayout(data: DataView, relativeSeries: IMarkerSupportSeries, autoRange: boolean) {
  const points: IPolarPoint[] = [];
  const dataPoints =
    data.latestData[0] && data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  dataPoints.forEach(
    (datum: {
      angle: StringOrNumber[] | StringOrNumber | null;
      radius: StringOrNumber[] | StringOrNumber | null;
      getRefRelativeSeries?: () => ICartesianSeries;
    }) => {
      const refRelativeSeries = (
        datum?.getRefRelativeSeries ? datum.getRefRelativeSeries() : relativeSeries
      ) as IPolarSeries;

      const angleDomain = refRelativeSeries.angleAxisHelper.getScale(0).domain();
      const radiusDomain = refRelativeSeries.radiusAxisHelper.getScale(0).domain();
      const angleValue = array(datum.angle);
      const radiusValue = array(datum.radius);

      angleValue.length === 1 &&
        isNumber(angleValue[0]) &&
        isNeedExtendDomain(angleDomain, angleValue[0], autoRange) &&
        refRelativeSeries.angleAxisHelper?.setExtendDomain?.('marker_xAxis_extend', angleValue[0] as number);

      radiusValue.length === 1 &&
        isNumber(radiusValue[0]) &&
        isNeedExtendDomain(radiusDomain, radiusValue[0], autoRange) &&
        refRelativeSeries.radiusAxisHelper?.setExtendDomain?.('marker_yAxis_extend', radiusValue[0] as number);
      points.push({
        angle: refRelativeSeries.angleAxisHelper.dataToPosition(angleValue),
        radius: refRelativeSeries.radiusAxisHelper.dataToPosition(radiusValue)
      });
    }
  );
  return points;
}

export function positionLayout(positions: MarkerPositionPoint[], series: ISeries, regionRelative: boolean): IPoint[] {
  if (regionRelative) {
    const region = series.getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();
    const { width: regionWidth, height: regionHeight } = region.getLayoutRect();
    return positions.map(position => {
      let { x, y } = position;
      if (isPercent(x)) {
        x = convertPercentToValue(x, regionWidth);
      }
      x = (x as number) + regionStartX;
      if (isPercent(y)) {
        y = convertPercentToValue(y, regionHeight);
      }
      y = (y as number) + regionStartY;

      return {
        x,
        y
      };
    });
  }

  const { width: canvasWidth, height: canvasHeight } = series.getOption().getChart().getViewRect();
  return positions.map(position => {
    let { x, y } = position;
    if (isPercent(x)) {
      x = convertPercentToValue(x, canvasWidth);
    }
    if (isPercent(y)) {
      y = convertPercentToValue(y, canvasHeight);
    }
    return {
      x: x as number,
      y: y as number
    };
  });
}

export function computeClipRange(regions: IRegion[]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  regions.forEach((region: IRegion) => {
    const regionPos = region.getLayoutStartPoint();
    const regionRect = region.getLayoutRect();
    if (regionPos.x < minX) {
      minX = regionPos.x;
    }
    if (regionPos.x + regionRect.width > maxX) {
      maxX = regionPos.x + regionRect.width;
    }
    if (regionPos.y < minY) {
      minY = regionPos.y;
    }
    if (regionPos.y + regionRect.height > maxY) {
      maxY = regionPos.y + regionRect.height;
    }
  });
  return { minX, maxX, minY, maxY };
}

export function transformLabelAttributes(label: IMarkerLabelSpec, markerData: any) {
  const { labelBackground = {}, style, shape, ...restLabel } = label;

  if (label.visible !== false) {
    const labelAttrs = restLabel as any;

    if (shape?.visible) {
      labelAttrs.shape = {
        visible: true,
        ...transformToGraphic(shape.style)
      };
    } else {
      labelAttrs.shape = {
        visible: false
      };
    }

    if (labelBackground.visible !== false) {
      labelAttrs.panel = {
        visible: true,
        customShape: labelBackground.customShape,
        ...transformStyle(transformToGraphic(labelBackground.style), markerData)
      };
      if (isValid(labelBackground.padding)) {
        labelAttrs.padding = normalizePadding(labelBackground.padding);
      }
    } else {
      labelAttrs.panel = {
        visible: false
      };
      labelAttrs.padding = 0;
    }

    if (style) {
      labelAttrs.textStyle = transformStyle(transformToGraphic(style), markerData);
    }
    return labelAttrs;
  }
  return {
    visible: false
  };
}

export function transformState(state: {} | Record<MarkerStateValue, any | IMarkerState<any>>, markerData: DataView) {
  for (const stateKey in state) {
    if (isFunction(state[stateKey])) {
      state[stateKey] = state[stateKey](markerData);
    }
  }
  return state;
}

export function transformStyle(style: any, markerData: DataView) {
  if (isFunction(style)) {
    return style(markerData);
  }
  return style;
}

export function transformOffset(offset: string | number | Function, region: IRegion) {
  if (isFunction(offset)) {
    return offset(region);
  }
  return offset;
}

export function computeOffsetFromRegion(point: IPointLike, offset: string | number, region: IRegion): number {
  if (!isValid(point)) {
    return offset as number;
  }
  if (offset === 'regionLeft') {
    return region.getLayoutStartPoint().x - point.x;
  } else if (offset === 'regionRight') {
    return region.getLayoutStartPoint().x + region.getLayoutRect().width - point.x;
  } else if (offset === 'regionTop') {
    return region.getLayoutStartPoint().y - point.y;
  } else if (offset === 'regionBottom') {
    return region.getLayoutStartPoint().y + region.getLayoutRect().height - point.y;
  }
  return offset as number;
}

export function getMarkLineProcessInfo(spec: any) {
  const isXProcess = 'x' in spec;
  const isYProcess = 'y' in spec;
  const isX1Process = 'x1' in spec;
  const isY1Process = 'y1' in spec;
  const isAngleProcess = 'angle' in spec;
  const isRadiusProcess = 'radius' in spec;
  const isAngle1Process = 'angle1' in spec;
  const isRadius1Process = 'radius1' in spec;
  const isCoordinatesProcess = 'coordinates' in spec;
  const isValidProcess = 'process' in spec;

  return {
    doXProcess: isXProcess && !isYProcess && !isY1Process,
    doXYY1Process: isXProcess && isYProcess && isY1Process,
    doYProcess: isYProcess && !isXProcess && !isX1Process,
    doYXX1Process: isYProcess && isXProcess && isX1Process,
    doXYProcess: isXProcess && isYProcess && isX1Process && isY1Process,
    doAngleProcess: isAngleProcess && !isAngle1Process && !isRadiusProcess && !isRadius1Process,
    doRadiusProcess: isRadiusProcess && !isRadius1Process && !isAngleProcess && !isAngle1Process,
    doAngRadRad1Process: isAngleProcess && !isAngle1Process && isRadiusProcess && isRadius1Process,
    doRadAngAng1Process: isRadiusProcess && isAngleProcess && isAngle1Process && !isRadius1Process,
    doRadAngProcess: isAngleProcess && isRadiusProcess && isAngle1Process && isRadius1Process,
    doCoordinatesProcess: isCoordinatesProcess && (!isValidProcess || ('process' in spec && 'xy' in spec.process))
  };
}

export function getMarkAreaProcessInfo(spec: any) {
  const isXProcess = 'x' in spec;
  const isX1Process = 'x1' in spec;
  const isYProcess = 'y' in spec;
  const isY1Process = 'y1' in spec;
  const isAngleProcess = 'angle' in spec;
  const isRadiusProcess = 'radius' in spec;
  const isAngle1Process = 'angle1' in spec;
  const isRadius1Process = 'radius1' in spec;
  const isCoordinatesProcess = 'coordinates' in spec;
  return {
    doXProcess: isXProcess && isX1Process && !isYProcess && !isY1Process,
    doYProcess: isYProcess && isY1Process && !isXProcess && !isX1Process,
    doXYProcess: isXProcess && isX1Process && isYProcess && isY1Process,
    doAngleProcess: isAngleProcess && isAngle1Process && !isRadiusProcess && !isRadius1Process,
    doRadiusProcess: isRadiusProcess && isRadius1Process && !isAngleProcess && !isAngle1Process,
    doRadAngProcess: isAngleProcess && isRadiusProcess && isAngle1Process && isRadius1Process,
    doCoordinatesProcess: isCoordinatesProcess
  };
}

export function getMarkPointProcessInfo(spec: any) {
  const isXYProcess = isValid(spec.x) && isValid(spec.y);
  const isPolarProcess = isValid(spec.angle) && isValid(spec.radius);
  const isGeoProcess = isValid(spec.areaName);
  return {
    doXYProcess: isXYProcess,
    doPolarProcess: isPolarProcess,
    doGeoProcess: isGeoProcess
  };
}
