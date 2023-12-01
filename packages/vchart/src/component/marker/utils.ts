import type { ICartesianSeries, ISeries } from '../../series/interface';
import type { DataView } from '@visactor/vdataset';
import { isValid, isNumber, array, minInArray, maxInArray, isFunction } from '@visactor/vutils';
import type { Datum, IPoint, StringOrNumber } from '../../typings';
import { isPercent } from '../../util';
import type { IDataPointCallback, IDataPos, IDataPosCallback, MarkerPositionPoint } from './interface';
import { AGGR_TYPE } from '../../constant/marker';

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
  refSeries: { [key: string]: ICartesianSeries },
  regionWidth: number,
  regionStartLayoutStartPoint: IPoint
) {
  const { relativeSeries, startRelativeSeries, endRelativeSeries } = refSeries;
  isNumber(datum.x) &&
    isNeedExtendDomain(xDomain, datum.x, autoRange) &&
    relativeSeries?.getXAxisHelper().setExtendDomain?.('marker_xAxis_extend', datum.x);
  let x: number;
  if (isPercent(datum.x)) {
    x = convertPercentToValue(datum.x, regionWidth) + regionStartLayoutStartPoint.x;
  } else {
    x = datum.x;
    if (isFunction(datum.x)) {
      const relativeSeriesData = relativeSeries.getData().getLatestData();
      const startRelativeSeriesData = startRelativeSeries.getData().getLatestData();
      const endRelativeSeriesData = endRelativeSeries.getData().getLatestData();
      x = datum.x(
        relativeSeriesData,
        startRelativeSeriesData,
        endRelativeSeriesData,
        relativeSeries,
        startRelativeSeries,
        endRelativeSeries
      );
    }
    x = relativeSeries.getXAxisHelper().dataToPosition([x]) + regionStartLayoutStartPoint.x;
  }

  return x;
}

function getYValue(
  datum: Datum,
  yDomain: number[],
  autoRange: boolean,
  refSeries: { [key: string]: ICartesianSeries },
  regionHeight: number,
  regionStartLayoutStartPoint: IPoint
) {
  const { relativeSeries, startRelativeSeries, endRelativeSeries } = refSeries;
  isNumber(datum.y) &&
    isNeedExtendDomain(yDomain, datum.y, autoRange) &&
    relativeSeries.getYAxisHelper()?.setExtendDomain?.('marker_yAxis_extend', datum.y);

  let y: number;
  if (isPercent(datum.y)) {
    y = convertPercentToValue(datum.y, regionHeight) + regionStartLayoutStartPoint.y;
  } else {
    y = datum.y;
    if (isFunction(datum.y)) {
      const relativeSeriesData = relativeSeries.getData().getLatestData();
      const startRelativeSeriesData = startRelativeSeries.getData().getLatestData();
      const endRelativeSeriesData = endRelativeSeries.getData().getLatestData();
      y = datum.y(
        relativeSeriesData,
        startRelativeSeriesData,
        endRelativeSeriesData,
        relativeSeries,
        startRelativeSeries,
        endRelativeSeries
      );
    }
    y = relativeSeries.getYAxisHelper().dataToPosition([y]) + regionStartLayoutStartPoint.y;
  }

  return y;
}

function convertPercentToValue(percent: string, relativeLength: number) {
  return (Number(percent.substring(0, percent.length - 1)) * relativeLength) / 100;
}

export function isAggrSpec(spec: IDataPos | IDataPosCallback) {
  return AGGR_TYPE.includes(spec as any);
}

export function xyLayout(
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
  const dataPoints = data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  const xDomain = relativeSeries.getXAxisHelper().getScale(0).domain();
  const yDomain = relativeSeries.getYAxisHelper().getScale(0).domain();
  dataPoints.forEach((datum: IPoint) => {
    const isValidX = isValid(datum.x);
    const isValidY = isValid(datum.y);
    if (isValidX && isValidY) {
      const x = getXValue(datum, xDomain, autoRange, refSeries, regionWidth, regionStartLayoutStartPoint);
      const y = getYValue(datum, yDomain, autoRange, refSeries, regionHeight, regionStartLayoutStartPoint);
      lines.push([{ x, y }]);
    } else if (isValid(datum.x)) {
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
    } else if (isValid(datum.y)) {
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

export function coordinateLayout(data: DataView, relativeSeries: ICartesianSeries, autoRange: boolean) {
  const points: IPoint[] = [];
  const dataPoints = data.latestData[0].latestData ? data.latestData[0].latestData : data.latestData;
  dataPoints.forEach(
    (datum: {
      x: StringOrNumber[] | StringOrNumber | IDataPointCallback | null;
      y: StringOrNumber[] | StringOrNumber | IDataPointCallback | null;
      getRefRelativeSeries?: () => ICartesianSeries;
    }) => {
      const refRelativeSeries = datum?.getRefRelativeSeries ? datum.getRefRelativeSeries() : relativeSeries;
      const regionStart = refRelativeSeries.getRegion();
      const regionStartLayoutStartPoint = regionStart.getLayoutStartPoint();
      const xDomain = refRelativeSeries.getXAxisHelper().getScale(0).domain();
      const yDomain = refRelativeSeries.getYAxisHelper().getScale(0).domain();
      const refRelativeSeriesData = refRelativeSeries.getData().getLatestData();
      const xValue = array(datum.x).map(x => {
        if (isFunction(x)) {
          return x(refRelativeSeriesData, refRelativeSeries);
        }
        return x;
      });
      const yValue = array(datum.y).map(y => {
        if (isFunction(y)) {
          return y(refRelativeSeriesData, refRelativeSeries);
        }
        return y;
      });

      xValue.length === 1 &&
        isNumber(xValue[0]) &&
        isNeedExtendDomain(xDomain, xValue[0], autoRange) &&
        refRelativeSeries.getXAxisHelper()?.setExtendDomain?.('marker_xAxis_extend', xValue[0] as number);

      yValue.length === 1 &&
        isNumber(yValue[0]) &&
        isNeedExtendDomain(yDomain, yValue[0], autoRange) &&
        refRelativeSeries.getYAxisHelper()?.setExtendDomain?.('marker_yAxis_extend', yValue[0] as number);
      points.push({
        x: refRelativeSeries.getXAxisHelper().dataToPosition(xValue) + regionStartLayoutStartPoint.x,
        y: refRelativeSeries.getYAxisHelper().dataToPosition(yValue) + regionStartLayoutStartPoint.y
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

  const { width: canvasWidth, height: canvasHeight } = series.getOption().getChart().getCanvasRect();
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
