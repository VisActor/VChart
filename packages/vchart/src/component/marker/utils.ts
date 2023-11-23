import type { ICartesianSeries } from '../../series/interface';
import type { DataView } from '@visactor/vdataset';
import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValid, isNumber, array, isArray } from '@visactor/vutils';
import type { StringOrNumber } from '../../typings';
import { isPercent } from '../../util';
import type { OffsetPoint } from './interface';

export function xLayout(
  data: DataView,
  startRelativeSeries: ICartesianSeries,
  endRelativeSeries: ICartesianSeries,
  relativeSeries: ICartesianSeries,
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

  const lines: [IPointLike, IPointLike][] = [];
  const dataPoints = data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  const xDomain = relativeSeries.getXAxisHelper().getScale(0).domain();
  dataPoints.forEach((datum: IPointLike) => {
    if (isValid(datum.x)) {
      isNumber(datum.x) &&
        isNeedExtendDomain(xDomain, datum.x, autoRange) &&
        relativeSeries?.getXAxisHelper().setExtendDomain?.('marker_xAxis_extend', datum.x);

      let x: number;
      if (isArray(datum.x) && datum.x.length === 1 && isPercent(datum.x[0])) {
        const percent = datum.x[0] + '';
        x = (Number(percent.substring(0, percent.length - 1)) * regionWidth) / 100 + regionStartLayoutStartPoint.x;
      } else {
        x = relativeSeries.getXAxisHelper().dataToPosition([datum.x]) + regionStartLayoutStartPoint.x;
      }

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
    }
  });

  return lines;
}

export function yLayout(
  data: DataView,
  startRelativeSeries: ICartesianSeries,
  endRelativeSeries: ICartesianSeries,
  relativeSeries: ICartesianSeries,
  autoRange: boolean
) {
  const regionStart = startRelativeSeries.getRegion();
  const regionStartLayoutStartPoint = regionStart.getLayoutStartPoint();
  const regionEnd = endRelativeSeries.getRegion();
  const regionEndLayoutStartPoint = regionEnd.getLayoutStartPoint();

  const regionHeight = Math.abs(
    Math.min(regionStartLayoutStartPoint.y, regionEndLayoutStartPoint.y) -
      Math.max(
        regionStartLayoutStartPoint.y + regionStart.getLayoutRect().height,
        regionEndLayoutStartPoint.y + regionEnd.getLayoutRect().height
      )
  );

  const lines: [IPointLike, IPointLike][] = [];
  const dataPoints = data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  const yDomain = relativeSeries.getYAxisHelper().getScale(0).domain();
  dataPoints.forEach((datum: IPointLike) => {
    if (isValid(datum.y)) {
      isNumber(datum.y) &&
        isNeedExtendDomain(yDomain, datum.y, autoRange) &&
        relativeSeries.getYAxisHelper()?.setExtendDomain?.('marker_yAxis_extend', datum.y);
      const x = Math.min(regionStartLayoutStartPoint.x, regionEndLayoutStartPoint.x);

      let y: number;
      if (isArray(datum.y) && datum.y.length === 1 && isPercent(datum.y[0])) {
        const percent = datum.y[0] + '';
        y = (Number(percent.substring(0, percent.length - 1)) * regionHeight) / 100 + regionStartLayoutStartPoint.y;
      } else {
        y = relativeSeries.getYAxisHelper().dataToPosition([datum.y]) + regionStartLayoutStartPoint.y;
      }

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

export function coordinateLayout(
  data: DataView,
  relativeSeries: ICartesianSeries,
  autoRange: boolean,
  coordinatesOffset: OffsetPoint[] | OffsetPoint
) {
  const points: IPointLike[] = [];
  const dataPoints = data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
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
      const refRelativeSeries = datum?.getRefRelativeSeries ? datum.getRefRelativeSeries() : relativeSeries;
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

function isNeedExtendDomain(domain: number[], datum: number, autoRange: boolean) {
  if (!autoRange) {
    return false;
  }
  const min = Math.min(...domain);
  const max = Math.max(...domain);
  if (datum < min || datum > max) {
    return true;
  }
  return false;
}
