import { isValid } from '@visactor/vutils';
import type { SankeyLayoutResult } from '@visactor/vlayouts';
import type { ISeries } from '../../../../series/interface';
import { SeriesTypeEnum } from '../../../../series/interface/type';
import type { IDiscreteLegendData, IDiscreteLegendDataMakeOption, IDiscreteLegendFilterOption } from './interface';
import { DEFAULT_DATA_SERIES_FIELD } from '../../../../constant/data';

export const discreteLegendDataMake = (data: Array<ISeries>, op: IDiscreteLegendDataMakeOption) => {
  const result: IDiscreteLegendData[] = [];
  const tempKey: { [key in string]: boolean } = {};
  const { series, seriesField } = op;
  series().forEach(s => {
    const field = seriesField(s);
    let infoList;
    if (field === s.getSeriesField()) {
      infoList = s.getSeriesInfoList();
    } else {
      infoList = s.getSeriesInfoInField(field);
    }
    infoList.forEach(info => {
      if (tempKey[info.key]) {
        return;
      }
      tempKey[info.key] = true;
      result.push(info);
    });
  });
  return result;
};

export const discreteLegendFilter = (data: Array<any>, op: IDiscreteLegendFilterOption) => {
  const { series, selected, field, data: legendData, customFilter } = op;
  const selectedData = selected();
  const legendKeys = legendData(); // 全量的图例项
  if (selectedData.length === 0 && legendKeys.length) {
    return [];
  }

  if (selectedData.length === legendKeys.length) {
    return data;
  }

  const selectedFilter: Record<string, true> = Object.create(null);
  selectedData.forEach(s => {
    selectedFilter[s] = true;
  });

  const datumField = field() ?? DEFAULT_DATA_SERIES_FIELD;

  if (customFilter) {
    return customFilter(data, selectedData, datumField);
  } else if (series.type === SeriesTypeEnum.sankey && data[0]?.nodes) {
    const layout: SankeyLayoutResult[number] = data[0];
    const visibleNodeKeys: Record<string, true> = Object.create(null);
    // 图例值来自原始节点字段，连线端点使用布局节点的 key。
    layout.nodes = layout.nodes.filter(({ datum, key }) => {
      const legendValue = datum ? series.getSeriesFieldValue(datum, datumField) : key;
      if (selectedFilter[legendValue] !== true) {
        return false;
      }
      visibleNodeKeys[key] = true;
      return true;
    });
    layout.links = layout.links.filter(({ source, target }) => visibleNodeKeys[source] && visibleNodeKeys[target]);
  } else {
    if (isValid(datumField)) {
      data = data.filter(d => selectedFilter[series.getSeriesFieldValue(d, datumField)] === true);
    }
  }

  return data;
};
