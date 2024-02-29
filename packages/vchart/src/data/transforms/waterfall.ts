import { isNil, precisionAdd, precisionSub } from '@visactor/vutils';

import type { DataView } from '@visactor/vdataset';
import type {
  IWaterfallSeriesSpec,
  IWaterfallTotalCustom,
  IWaterfallTotalField
} from '../../series/waterfall/interface';
import type { Datum } from '../../typings';
import { WaterfallDefaultSeriesField } from '../../constant/waterfall';
import { warn } from '../../util/debug';

type TotalInfo = {
  start: number;
  end: number;
  lastIndex: string;
  lastEnd: number;
  index: string;
  isTotal: boolean;
};

export interface IWaterfallOpt {
  indexField: string;
  valueField: string;
  seriesField?: string;
  startAs: string;
  endAs: string;
  total: IWaterfallSeriesSpec['total'];
  seriesFieldName: {
    total: string;
    increase: string;
    decrease: string;
  };
  groupData: () => DataView;
}

export const waterfall = (lastData: Array<Datum>, op: IWaterfallOpt) => {
  if (!lastData || lastData.length === 0) {
    return lastData;
  }
  const { indexField, total: totalSpec, groupData } = op;
  const totalData: {
    start: number;
    end: number;
    lastIndex: string;
    lastEnd: number;
    index: string;
    isTotal: boolean;
  }[] = [];
  const { dimensionValues, dimensionData } = groupData().latestData as {
    dimensionValues: { [key in string]: Set<string> };
    dimensionData: { [key in string]: Datum[] };
  };
  const indexValues = Array.from(dimensionValues[indexField]);
  // 上一次的计算结果
  let temp: { start: number; end: number; lastIndex: string } = { start: 0, end: 0, lastIndex: null };
  indexValues.forEach((key, index) => {
    const total = {
      start: temp.end,
      end: temp.end,
      lastIndex: temp.lastIndex,
      lastEnd: temp.end,
      index: key,
      isTotal: false
    };

    const indexData = dimensionData[key];
    // 1.9.5 新增能力
    // 当前 key 对应的数据中有一个总计数据，并且还有其他的分组数据时。总计的计算逻辑需要将总计值拆分
    if (indexData.length > 1) {
      const isTotalCheck = (d: Datum) => {
        if (!totalSpec || totalSpec.type === 'end') {
          if (index === indexValues.length - 1) {
            return true;
          }
        } else if (totalSpec.type === 'field' || totalSpec.type === 'custom') {
          const tag = d[totalSpec.tagField];
          return !!tag;
        }
        return false;
      };
      const isTotalTag = indexData.some(d => isTotalCheck(d));
      if (isTotalTag) {
        temp = computeTotalWithMultipleData(
          indexData,
          key,
          total,
          totalData,
          temp,
          indexValues,
          index,
          op,
          isTotalCheck
        );
        totalData.push(total);
        return;
      }
    }
    temp = computeNormalData(indexData, key, total, totalData, temp, indexValues, index, op);
    totalData.push(total);
  });
  return totalData;
};

function computeTotalWithMultipleData(
  indexData: Datum[],
  key: string,
  total: TotalInfo,
  totalData: TotalInfo[],
  temp: { start: number; end: number; lastIndex: string },
  indexValues: string[],
  index: number,
  op: IWaterfallOpt,
  isTotalCheck: (d: Datum) => boolean
) {
  total.isTotal = true;
  const { valueField, startAs, endAs, total: totalSpec } = op;
  // 先将数据分为总计数据与常规数据
  const _normalTemp: Datum[] = [];
  const _totalTemp: Datum[] = [];
  indexData.forEach(d => {
    if (isTotalCheck(d)) {
      _totalTemp.push(d);
    } else {
      _normalTemp.push(d);
    }
  });
  // 1. 不可能全都不是总计数据
  // 2. 如果全都是总计数据，让它们都是同一个值
  if (_totalTemp.length === indexData.length) {
    const result = computeNormalData([indexData[0]], key, total, totalData, temp, indexValues, index, op);
    _totalTemp.forEach(d => {
      d[startAs] = indexData[0][startAs];
      d[endAs] = indexData[0][endAs];
      d[valueField] = indexData[0][valueField];
    });
    return result;
  }

  // 3. 其他常规情况
  // 先获取当前的起始值/结束值应当是多少
  // 按照第一个总计数据的配置来决定
  const totalConfigData = _totalTemp[0];
  // eslint-disable-next-line prefer-const
  let { start, end } = getTotalStartEnd(totalConfigData, total, totalData, temp, totalSpec);
  total.start = start;
  total.end = end;
  // 当前剩余的总计值
  let valueTemp = end - start;
  // 将非总计数据进行堆叠
  _normalTemp.forEach(d => {
    d[startAs] = +start;
    d[endAs] = precisionAdd(d[startAs], +d[valueField]);
    start = d[endAs];
    valueTemp = precisionSub(valueTemp, +d[valueField]);
  });
  // 先在的start end 就是 total 的
  _totalTemp.forEach(d => {
    d[startAs] = +start;
    d[endAs] = precisionAdd(d[startAs], valueTemp);
    d[valueField] = valueTemp;
  });
  return { ...total, lastIndex: key };
}

function computeNormalData(
  indexData: Datum[],
  key: string,
  total: TotalInfo,
  totalData: TotalInfo[],
  temp: { start: number; end: number; lastIndex: string },
  indexValues: string[],
  index: number,
  op: IWaterfallOpt
) {
  const { valueField, startAs, endAs, total: totalSpec, seriesField, seriesFieldName } = op;
  indexData.forEach(d => {
    let isTotalTag = false;
    if (!totalSpec || totalSpec.type === 'end') {
      if (index === indexValues.length - 1) {
        total.start = 0;
        d[startAs] = total.start;
        d[endAs] = total.end;
        isTotalTag = true;
      }
    } else if (totalSpec.type === 'field' || totalSpec.type === 'custom') {
      const tag = d[totalSpec.tagField];
      if (tag) {
        isTotalTag = true;
        const { start, end } = getTotalStartEnd(d, total, totalData, temp, totalSpec);
        d[startAs] = start;
        d[endAs] = end;
        d[valueField] = end - start;
        total.start = start;
        total.end = end;
      }
    }
    if (!isTotalTag) {
      d[startAs] = +total.end;
      d[endAs] = precisionAdd(d[startAs], +d[valueField]);
      total.end = d[endAs];
    }
    total.isTotal = isTotalTag;

    if (isNil(seriesField) || seriesField === WaterfallDefaultSeriesField) {
      if (isTotalTag) {
        d[WaterfallDefaultSeriesField] = seriesFieldName.total;
      } else {
        d[WaterfallDefaultSeriesField] = +d[valueField] >= 0 ? seriesFieldName.increase : seriesFieldName.decrease;
      }
    }
  });
  return { ...total, lastIndex: key };
}

function getTotalStartEnd(
  d: Datum,
  total: TotalInfo,
  totalData: TotalInfo[],
  temp: { start: number; end: number; lastIndex: string },
  totalSpec: IWaterfallOpt['total']
) {
  if (!totalSpec || totalSpec.type === 'end') {
    return getTotalInEndType(total);
  } else if (totalSpec.type === 'field' || totalSpec.type === 'custom') {
    if (totalSpec.type === 'custom') {
      return getTotalInCustomType(d, temp, totalSpec);
    }
    // 如果有设置count， valueField 和 startField 无效
    if (totalSpec.collectCountField && !isNil(d[totalSpec.collectCountField])) {
      return getTotalInCollectField(d, totalData, total, totalSpec);
    }
    return getTotalInField(d, total, totalSpec);
  }
  return { start: 0, end: 0 };
}

function getTotalInEndType(total: TotalInfo) {
  return { start: 0, end: total.end };
}

function getTotalInCustomType(
  d: Datum,
  temp: { start: number; end: number; lastIndex: string },
  totalSpec: IWaterfallOpt['total']
) {
  return (<IWaterfallTotalCustom>totalSpec).product(d, temp);
}

function getTotalInCollectField(d: Datum, totalData: TotalInfo[], total: TotalInfo, totalSpec: IWaterfallTotalField) {
  let start = 0;
  let end = total.end;
  const startIndex = totalData.length - +d[totalSpec.collectCountField];
  const endIndex = totalData.length - 1;
  if (startIndex < 0) {
    warn('total.collectCountField error');
  } else {
    start = totalData[startIndex].start;
  }
  if (endIndex < 0) {
    warn('total.collectCountField error');
  } else {
    end = totalData[endIndex].end;
  }
  return { start, end };
}

function getTotalInField(d: Datum, total: TotalInfo, totalSpec: IWaterfallTotalField) {
  let start = 0;
  let end = total.end;
  if (totalSpec.startField && !isNil(d[totalSpec.startField])) {
    start = +d[totalSpec.startField];
  }
  if (totalSpec.valueField && !isNil(d[totalSpec.valueField])) {
    end = precisionAdd(start, +d[totalSpec.valueField]);
  }
  return { start, end };
}

export interface IWaterfallFillEndOpt {
  indexField: string;
  valueField: string;
  seriesField?: string;
  total: IWaterfallSeriesSpec['total'];
}

export const waterfallFillTotal = (data: Array<Datum>, op: IWaterfallFillEndOpt) => {
  if (!data) {
    return data;
  }
  const { indexField, valueField, total, seriesField } = op;
  const totalData = {
    [indexField]: total?.text || 'total',
    [valueField]: data.reduce((pre, cur) => precisionAdd(pre, +cur[valueField]), 0)
  };
  if (seriesField) {
    totalData[seriesField] = 'total';
  }
  data.push(totalData);
  return data;
};
