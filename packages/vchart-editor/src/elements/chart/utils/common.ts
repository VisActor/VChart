import { filter } from '@visactor/vdataset';
import { DEFAULT_DATA_KEY, type ICartesianSeries, type ISeries, type VChart } from '@visactor/vchart';
import { MarkerTypeEnum, type IChartModel } from '../interface';
import { getChartModelWithModelInfo } from './layout';
import type { IRect } from '@visactor/vrender-core';
import type { Datum } from '../data/interface';
import { isNumber, isString } from '@visactor/vutils';

export function refreshModelInVChart(model: IChartModel, vchart: VChart) {
  // @ts-ignore
  if (model.getOption()?.getChart() === vchart.getChart()) {
    return model;
  }
  const modelInfo = {
    id: model.userId,
    specKey: model.specKey,
    specIndex: model.getSpecIndex() ?? 0
  };
  if (isRegionModel(model.type)) {
    // region 作为特殊元素，永远可以刷新到一个
    delete modelInfo.id;
  }
  return getChartModelWithModelInfo(vchart, modelInfo);
}

export function isRegionRelativeModel(type: string) {
  return type && type.startsWith('cartesianAxis');
}

export function isRegionModel(type: string) {
  return type && type.includes('region');
}

export function getBarGraphicByDataKey(series: ICartesianSeries, dataKey: string) {
  const barMark = series.getMarkInName('bar');
  const elements = barMark.getProduct().getAllElements();

  const element = elements.find(element => {
    return element.data[0][DEFAULT_DATA_KEY] === dataKey;
  });

  return element.getGraphicItem() as IRect;
}

export function couldBeValidNumber(v: any) {
  if (v === null || v === undefined || v === '') {
    return false;
  }
  if (isNumber(v)) {
    return true;
  }
  // eslint-disable-next-line no-self-compare
  return +v === +v;
}

export function isPercent(v: any) {
  if (!isString(v)) {
    return false;
  }
  if (!v.endsWith('%')) {
    return false;
  }
  return couldBeValidNumber(v.substring(0, v.length - 1));
}

// 数据变化场景：数据更新
export function updateMarkersWhenUpdateData(spec: any, series: ICartesianSeries) {
  const hValueLines = spec.markLine.filter((markLine: any) => markLine.name === MarkerTypeEnum.horizontalLine);

  const vValueLines = spec.markLine.filter((markLine: any) => markLine.name === MarkerTypeEnum.verticalLine);

  const hAreas = spec.markArea.filter((markArea: any) => markArea.name === MarkerTypeEnum.horizontalArea);
  const vAreas = spec.markArea.filter((markArea: any) => markArea.name === MarkerTypeEnum.verticalArea);

  const growthLines = spec.markLine.filter((s: any) => s.name === MarkerTypeEnum.growthLine);
  const totalDiffLines = spec.markLine.filter((s: any) => s.name === MarkerTypeEnum.totalDiffLine);
  const hireDiff = spec.markLine.filter((s: any) => s.name === MarkerTypeEnum.hierarchyDiffLine);

  const seriesData = series.getViewData().latestData;
  const region = series.getRegion();
  const { height: regionHeight, width: regionWidth } = region.getLayoutRect();
  // 值线和 area 需要判断属性值是否为百分比字符串，是则只更新 label.text，不是则采用默认的逻辑
  hValueLines.forEach((markLine: any) => {
    if (isPercent(markLine.y)) {
      const position = (Number(markLine.y.substring(0, markLine.y.length - 1)) / 100) * regionHeight;
      markLine._originValue_ = series.valueToPosition(position);
    } else {
      // markLine._originValue_ =
    }
  });

  // 其他增长型标注则根据 dataKey 查找对应的数据，更新 coordinates 和 label.text
}
