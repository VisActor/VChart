import type { ICartesianSeries } from '../../series/interface';
import type { DataView } from '@visactor/vdataset';
import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValid, isNumber } from '@visactor/vutils';

export function xLayout(
  data: DataView,
  startRelativeSeries: ICartesianSeries,
  endRelativeSeries: ICartesianSeries,
  relativeSeries: ICartesianSeries
) {
  const regionStart = startRelativeSeries.getRegion();
  const regionStartLayoutStartPoint = regionStart.getLayoutStartPoint();
  const regionEnd = endRelativeSeries.getRegion();
  const regionEndLayoutStartPoint = regionEnd.getLayoutStartPoint();

  const lines: [IPointLike, IPointLike][] = [];
  const dataPoints = data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  const xDomain = relativeSeries.getXAxisHelper().getScale(0).domain();
  dataPoints.forEach((datum: IPointLike) => {
    if (isValid(datum.x)) {
      isNumber(datum.x) &&
        isNeedExtendDomain(xDomain, datum.x) &&
        relativeSeries?.getXAxisHelper().setExtendDomain?.('marker_xAxis_extend', datum.x);
      const x = relativeSeries.getXAxisHelper().dataToPosition([datum.x]) + regionStartLayoutStartPoint.x;
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
  relativeSeries: ICartesianSeries
) {
  const regionStart = startRelativeSeries.getRegion();
  const regionStartLayoutStartPoint = regionStart.getLayoutStartPoint();
  const regionEnd = endRelativeSeries.getRegion();
  const regionEndLayoutStartPoint = regionEnd.getLayoutStartPoint();

  const lines: [IPointLike, IPointLike][] = [];
  const dataPoints = data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  const yDomain = relativeSeries.getYAxisHelper().getScale(0).domain();
  dataPoints.forEach((datum: IPointLike) => {
    if (isValid(datum.y)) {
      isNumber(datum.y) &&
        isNeedExtendDomain(yDomain, datum.y) &&
        relativeSeries.getYAxisHelper()?.setExtendDomain?.('marker_yAxis_extend', datum.y);
      const x = Math.min(regionStartLayoutStartPoint.x, regionEndLayoutStartPoint.x);
      const y = relativeSeries.getYAxisHelper().dataToPosition([datum.y]) + regionStartLayoutStartPoint.y;
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

export function coordinateLayout(data: DataView, relativeSeries: ICartesianSeries) {
  const points: IPointLike[] = [];
  const dataPoints = data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  dataPoints.forEach(
    (datum: {
      x: string | number | null;
      y: string | number | null;
      getRefRelativeSeries?: () => ICartesianSeries;
    }) => {
      const refRelativeSeries = datum?.getRefRelativeSeries ? datum.getRefRelativeSeries() : relativeSeries;
      const regionStart = refRelativeSeries.getRegion();
      const regionStartLayoutStartPoint = regionStart.getLayoutStartPoint();
      const xDomain = refRelativeSeries.getXAxisHelper().getScale(0).domain();
      const yDomain = refRelativeSeries.getYAxisHelper().getScale(0).domain();
      isNumber(datum.x) &&
        isNeedExtendDomain(xDomain, datum.x) &&
        refRelativeSeries.getXAxisHelper()?.setExtendDomain?.('marker_xAxis_extend', datum.x as number);

      isNumber(datum.y) &&
        isNeedExtendDomain(yDomain, datum.y) &&
        refRelativeSeries.getYAxisHelper()?.setExtendDomain?.('marker_yAxis_extend', datum.y as number);
      points.push({
        x: refRelativeSeries.getXAxisHelper().dataToPosition([datum.x]) + regionStartLayoutStartPoint.x,
        y: refRelativeSeries.getYAxisHelper().dataToPosition([datum.y]) + regionStartLayoutStartPoint.y
      });
    }
  );
  return points;
}

function isNeedExtendDomain(domain: number[], datum: number) {
  const min = Math.min(...domain);
  const max = Math.max(...domain);
  if (datum < min || datum > max) {
    return true;
  }
  return false;
}
