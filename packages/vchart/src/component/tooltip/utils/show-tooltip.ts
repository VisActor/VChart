import type { Datum, IPoint, IShowTooltipOption, ITooltipHandler, TooltipActiveType } from '../../../typings';
import type { IComponentOption } from '../../interface';
import type { ISeries } from '../../../series/interface';
import { SeriesTypeEnum } from '../../../series/interface/type';
import type { CartesianSeries } from '../../../series/cartesian/cartesian';
import type { PolarSeries } from '../../../series/polar/polar';
import type { GeoSeries } from '../../../series/geo/geo';
import type { PieSeries } from '../../../series/pie/pie';
import type { TooltipHandlerParams } from '../interface';
import { Event_Source_Type } from '../../../constant';
import { getElementAbsolutePosition, isArray, isValid, isNil } from '@visactor/vutils';
import type { IDimensionInfo } from '../../../event/events/dimension/interface';
import { VChart } from '../../../core/vchart';

const getDataArrayFromFieldArray = (fields: string[], datum?: Datum) =>
  isValid(datum) ? fields.map(f => datum[f]) : undefined;

const datumContainsArray = (fields: string[], data?: Datum[]) => (datum: Datum) =>
  fields.every((key, i) => datum[key] === data?.[i]);

const hasData = (data?: any[] | Datum) => {
  if (isNil(data)) {
    return false;
  }
  if (isArray(data)) {
    return data.length > 0 && data.every(isValid);
  }
  return Object.keys(data).length > 0;
};

type MarkInfo = {
  pos: IPoint;
  data: {
    dimensionFields: string[];
    measureFields: string[];
    dimensionData?: any[];
    measureData?: any[];
    hasMeasureData?: boolean;
    groupField?: string;
    groupData?: any;
  };
  series: ISeries;
};

export function showTooltip(
  datum: Datum,
  options: IShowTooltipOption,
  tooltipHandler: ITooltipHandler,
  componentOptions: IComponentOption
): TooltipActiveType | 'none' {
  const opt: IShowTooltipOption = {
    regionIndex: 0,
    ...options
  };
  // 确认region
  const region = componentOptions.getRegionsInUserIdOrIndex(
    isValid(opt.regionId) ? [opt.regionId] : undefined,
    isValid(opt.regionIndex) ? [opt.regionIndex] : undefined
  )[0];
  if (!region) {
    return 'none';
  }
  // 查询图元信息
  const seriesList = region.getSeries();
  const markInfoList: MarkInfo[] = [];
  seriesList.forEach(series => {
    /** 维度field */
    const dimensionFields = series.getDimensionField();
    /** 指标原始field（用于显示tooltip） */
    const measureFields = series.getMeasureField();

    const groupField = series.getSeriesField();
    const groupData = isValid(groupField) ? datum[groupField] : undefined;
    const groupDomain = isValid(groupField)
      ? series.getViewDataStatistics?.()?.latestData[groupField]?.values ?? []
      : [];

    const dimensionData = getDataArrayFromFieldArray(dimensionFields, datum);
    let measureData = getDataArrayFromFieldArray(measureFields, datum);
    const hasMeasureData = hasData(measureData);

    const isMultiGroups = !hasMeasureData && isValid(groupField) && isNil(groupData) && groupDomain.length > 0; // 是否需要考虑多个数据组

    if (series.coordinate === 'cartesian') {
      const cartesianSeries = series as CartesianSeries;

      // 补全维度轴数据
      const invalidDimensionFields = dimensionFields
        .map((field, i) => [field, i] as [string, number])
        .filter(([, i]) => isNil(dimensionData?.[i]));
      let dimensionDataList: any[][] = [dimensionData ?? []];
      if (invalidDimensionFields.length > 0) {
        invalidDimensionFields.forEach(([field, i]) => {
          const domain = series.getViewDataStatistics?.()?.latestData[field]?.values ?? [];
          const nextList: any[][] = [];
          dimensionDataList.forEach(dimensionData => {
            domain.forEach((value: any) => {
              const newData = [...(dimensionData ?? [])];
              newData[i] = value;
              nextList.push(newData);
            });
          });
          dimensionDataList = nextList;
        });
      }
      dimensionDataList.forEach(dimensionData => {
        if (isMultiGroups) {
          const measureDataList = cartesianSeries
            .getViewData()
            ?.latestData.filter(datumContainsArray(dimensionFields, dimensionData));
          groupDomain.forEach((groupData: any) => {
            const originDatum = measureDataList.find((d: Datum) => d[groupField] === groupData);
            // 补全指标轴数据
            measureData = getDataArrayFromFieldArray(measureFields, originDatum);
            if (!hasData(measureData)) {
              return;
            }

            const pos = cartesianSeries.dataToPosition(originDatum);
            if (isNil(pos) || isNaN(pos.x) || isNaN(pos.y)) {
              return;
            }

            markInfoList.push({
              pos,
              data: {
                dimensionFields,
                dimensionData,
                measureFields,
                measureData,
                hasMeasureData,
                groupField,
                groupData
              },
              series
            });
          });
        } else {
          const originDatum = cartesianSeries
            .getViewData()
            ?.latestData.find(datumContainsArray(dimensionFields, dimensionData));
          if (!hasMeasureData) {
            // 如果只有单个数据组且用户没有给y轴数据，则补全y轴数据
            measureData = getDataArrayFromFieldArray(measureFields, originDatum);
            if (!hasData(measureData)) {
              return;
            }
          }

          const pos = cartesianSeries.dataToPosition(originDatum);
          if (isNil(pos) || isNaN(pos.x) || isNaN(pos.y)) {
            return;
          }

          markInfoList.push({
            pos,
            data: {
              dimensionFields,
              dimensionData,
              measureFields,
              measureData,
              hasMeasureData,
              groupField,
              groupData
            },
            series
          });
        }
      });
    } else if (series.coordinate === 'polar') {
      if (series.type === SeriesTypeEnum.pie) {
        // 处理饼图
        const pieSeries = series as PieSeries;

        const originDatum = pieSeries
          .getViewData()
          ?.latestData.find(datumContainsArray(dimensionFields, dimensionData));
        if (!hasMeasureData) {
          // 如果只有单个数据组且用户没有给y轴数据，则补全y轴数据
          measureData = getDataArrayFromFieldArray(measureFields, originDatum);
          if (!hasData(measureData)) {
            return;
          }
        }

        const pos = pieSeries.dataToCentralPosition(originDatum);
        if (isNil(pos) || isNaN(pos.x) || isNaN(pos.y)) {
          return;
        }

        markInfoList.push({
          pos,
          data: {
            dimensionFields,
            dimensionData,
            measureFields,
            measureData,
            hasMeasureData,
            groupField,
            groupData
          },
          series
        });
      } else {
        // 处理玫瑰图、雷达图
        const polarSeries = series as PolarSeries;

        if (isMultiGroups) {
          const measureDataList = polarSeries
            .getViewData()
            ?.latestData.filter(datumContainsArray(dimensionFields, dimensionData));
          const originDatum = measureDataList.find((d: Datum) => d[groupField] === groupData);
          groupDomain.forEach((groupData: any) => {
            // 补全指标轴数据
            measureData = getDataArrayFromFieldArray(measureFields, originDatum);
            if (!hasData(measureData)) {
              return;
            }

            const pos = polarSeries.dataToPosition(originDatum);
            if (isNil(pos) || isNaN(pos.x) || isNaN(pos.y)) {
              return;
            }

            markInfoList.push({
              pos,
              data: {
                dimensionFields,
                dimensionData,
                measureFields,
                measureData,
                hasMeasureData,
                groupField,
                groupData
              },
              series
            });
          });
        } else {
          const originDatum = polarSeries
            .getViewData()
            ?.latestData.find(datumContainsArray(dimensionFields, dimensionData));
          if (!hasMeasureData) {
            // 如果只有单个数据组且用户没有给y轴数据，则补全y轴数据
            measureData = getDataArrayFromFieldArray(measureFields, originDatum);
            if (!hasData(measureData)) {
              return;
            }
          }

          const pos = polarSeries.dataToPosition(originDatum);
          if (isNil(pos) || isNaN(pos.x) || isNaN(pos.y)) {
            return;
          }

          markInfoList.push({
            pos,
            data: {
              dimensionFields,
              dimensionData,
              measureFields,
              measureData,
              hasMeasureData,
              groupField,
              groupData
            },
            series
          });
        }
      }
    } else if (series.coordinate === 'geo') {
      const gs = series as GeoSeries;

      const originDatum = gs.getViewData()?.latestData.find(datumContainsArray(dimensionFields, dimensionData));
      if (!hasMeasureData) {
        // 如果只有单个数据组且用户没有给y轴数据，则补全y轴数据
        measureData = getDataArrayFromFieldArray(measureFields, originDatum);
        if (!hasData(measureData)) {
          return;
        }
      }

      const pos = gs.dataToPosition(originDatum);
      if (isNil(pos) || isNaN(pos.x) || isNaN(pos.y)) {
        return;
      }

      markInfoList.push({
        pos,
        data: {
          dimensionFields,
          dimensionData,
          measureFields,
          measureData,
          hasMeasureData,
          groupField,
          groupData
        },
        series
      });
    }
  });

  // 组织数据
  const activeType = opt.activeType ?? (markInfoList.length > 1 ? 'dimension' : 'mark');
  const regionPos = region.getLayoutStartPoint();
  const regionRect = region.getLayoutRect();
  const container = componentOptions.globalInstance.getContainer();
  const containerPos = {
    x: 0,
    y: 0,
    ...(container ? getElementAbsolutePosition(container) : {})
  };
  const bound = (pos: IPoint): IPoint => ({
    x: Math.min(Math.max(pos.x, 0), regionRect.width),
    y: Math.min(Math.max(pos.y, 0), regionRect.height)
  });
  const getOriginDatum = (info: MarkInfo) => {
    const { dimensionFields, dimensionData, measureFields, measureData, groupField, groupData } = info.data;
    const originDatum = info.series.getViewData()?.latestData.find((datum: any) => {
      return (
        datumContainsArray(dimensionFields, dimensionData)(datum) &&
        datumContainsArray(measureFields, measureData)(datum) &&
        (isNil(groupField) || datumContainsArray([groupField], [groupData])(datum))
      );
    });
    return originDatum;
  };
  const getMockEvent = (originPos: IPoint): any => {
    const pos = bound(originPos);
    const canvasX = opt.x ?? regionPos.x + pos.x;
    const canvasY = opt.y ?? regionPos.y + pos.y;
    return {
      canvasX,
      canvasY,
      clientX: containerPos.x + canvasX,
      clientY: containerPos.y + canvasY
    };
  };

  // 显示tooltip
  if (activeType === 'dimension') {
    const firstInfo = markInfoList[0];
    if (!firstInfo) {
      return 'none';
    }

    // 将markInfoList按系列分组
    const markInfoSeriesMap = new Map<ISeries, MarkInfo[]>();
    markInfoList.forEach(info => {
      if (!markInfoSeriesMap.has(info.series)) {
        markInfoSeriesMap.set(info.series, []);
      }
      markInfoSeriesMap.get(info.series)?.push(info);
    });
    const mockDimensionInfo: IDimensionInfo[] = [
      {
        value: datum[firstInfo.data.dimensionFields[0]],
        data: [...markInfoSeriesMap.keys()].map(series => {
          return {
            series,
            datum: markInfoSeriesMap.get(series)?.map(info => getOriginDatum(info)) ?? []
          };
        })
      }
    ];
    const mockParams: TooltipHandlerParams = {
      changePositionOnly: false,
      dimensionInfo: mockDimensionInfo,
      chart: componentOptions.globalInstance.getChart() ?? undefined,
      datum: undefined,
      model: undefined,
      source: Event_Source_Type.chart,
      event: getMockEvent({
        x: markInfoList.reduce((sum, info) => sum + info.pos.x, 0) / markInfoList.length,
        y: markInfoList.reduce((sum, info) => sum + info.pos.y, 0) / markInfoList.length // 位置求平均
      }),
      item: undefined,
      itemMap: new Map<string, any>()
    };
    tooltipHandler?.showTooltip?.(activeType, mockDimensionInfo, mockParams);
    // 全局唯一 tooltip
    const vchart = componentOptions.globalInstance;
    if (VChart.globalConfig.uniqueTooltip) {
      VChart.hideTooltip(vchart.id);
    }
    return activeType;
  } else if (activeType === 'mark') {
    const info = markInfoList[0];
    if (!info) {
      return 'none';
    }
    const mockDatum = {
      ...getOriginDatum(info),
      ...datum
    };
    const mockParams: TooltipHandlerParams = {
      changePositionOnly: false,
      chart: componentOptions.globalInstance.getChart() ?? undefined,
      datum: mockDatum,
      model: info.series,
      source: Event_Source_Type.chart,
      event: getMockEvent(info.pos),
      item: undefined,
      itemMap: new Map<string, any>()
    };
    tooltipHandler?.showTooltip?.(
      activeType,
      [
        {
          datum: [mockDatum],
          series: info.series
        }
      ],
      mockParams
    );
    // 全局唯一 tooltip
    const vchart = componentOptions.globalInstance;
    if (VChart.globalConfig.uniqueTooltip) {
      VChart.hideTooltip(vchart.id);
    }
    return activeType;
  }
  return 'none';
}
