import { isArray, isValid, last } from '@visactor/vutils';
import { array, isNil } from '../../util';
import type { DataView } from '@visactor/vdataset';
import { objFlat } from '../../data/transforms/obj-flat';
import type { IBandLikeScale, IBaseScale } from '@visactor/vscale';
import { isContinuous, ScaleEnum } from '@visactor/vscale';
import type { CartesianAxis, ICartesianBandAxisSpec } from '../axis/cartesian';
export interface IDataFilterWithNewDomainOption {
  getNewDomain: () => any[];
  isContinuous: () => boolean;
  field: () => string;
}

export const lockStatisticsFilter = (
  statisticsData: any,
  op: IDataFilterWithNewDomainOption & {
    originalFields: () => Record<string, any>;
  }
) => {
  const { getNewDomain, isContinuous, field, originalFields } = op;

  const datumField = field();
  const newDomain = getNewDomain();
  if (isNil(newDomain) || isNil(datumField)) {
    return statisticsData;
  }
  const fields = originalFields();
  const realField = isArray(datumField) ? datumField[0] : datumField;

  if (
    statisticsData[realField] &&
    fields &&
    fields[realField] &&
    fields[realField].lockStatisticsByDomain &&
    !isContinuous()
  ) {
    statisticsData[realField].values = newDomain;
  }

  return statisticsData;
};

/**
 * 保证数据筛选的结果全都在坐标轴的新domain范围中，防止出现point数据因为超出domain范围而绘制在原点的情况
 */
export const dataFilterWithNewDomain = (data: Array<any>, op: IDataFilterWithNewDomainOption) => {
  const { getNewDomain, isContinuous, field } = op;
  const datumField = field();
  const newDomain = getNewDomain();
  if (isNil(newDomain) || isNil(datumField)) {
    return data;
  }
  if (newDomain.length === 0) {
    return [];
  }

  // 使用map代替indexOf查找，提升性能
  const domainMap = {};
  newDomain.forEach(d => {
    if (!domainMap[d]) {
      domainMap[d] = 1;
    }
  });

  let filter = null;
  if (isContinuous()) {
    filter = (d: any) => {
      let flag = false;
      array(datumField).every(field => {
        if (d[field] >= newDomain[0] && d[field] <= last(newDomain)) {
          flag = true;
        }
        return;
      });
      return flag;
    };
  } else {
    filter = (d: any) => {
      let flag = false;
      array(datumField).every(field => {
        // 这里d[f] + ''的原因是：数据是number类型的，但轴声明为band轴，domain会强制将number => string，所以filter的时候要将data中的number => string
        if (domainMap[d[field] + ''] || domainMap[d[field]]) {
          flag = true;
        }
        return;
      });
      return flag;
    };
  }

  return data.filter(filter);
};

export interface IDataFilterComputeDomainOption {
  input: {
    dataCollection: any[];
    stateFields: string[];
    valueFields: string[];
    isCategoryState?: boolean;
    seriesCollection: any[];
    method: 'sum'; // todo: 也许可以提供多种数据统计方法 @chensiji
  };
  output: {
    stateField: string;
    valueField: string;
  };
}

export const dataFilterComputeDomain = (data: Array<any>, op: IDataFilterComputeDomainOption) => {
  const { stateFields, valueFields, dataCollection, isCategoryState, seriesCollection } = op.input;
  const { stateField, valueField } = op.output;
  const resultObj: any = {};
  const resultKeys: any[] = [];
  const resultData: any[] = [];
  const stateValues: any[] = [];
  let hasLockDomain = false;
  let isAllLinearValue = false;
  dataCollection.forEach((dv: DataView, i) => {
    if (isNil(stateFields[i])) {
      return;
    }
    const series = seriesCollection[i];
    // 关联轴已确定分类或连续类型；仅无关联轴时通过系列统计推断，避免额外统计和分类重排。
    if (series && isCategoryState === undefined) {
      const statistics = series.getRawDataStatisticsByField(stateFields[i]);
      if (isValid(statistics?.max) && isValid(statistics?.min)) {
        isAllLinearValue = true;
      }
    }
    // 按照用户指定的domain进行排序(这里不通过getRawDataStatistics来取是因为时机不对，此时getRawDataStatistics还没有正确结果)
    const stateFieldInfo = dv.getFields()?.[stateFields[i]];
    if (stateFieldInfo && stateFieldInfo.lockStatisticsByDomain) {
      hasLockDomain = true;
      stateFieldInfo.domain.forEach((d: any) => {
        if (isNil(resultObj[d])) {
          stateValues.push(d);
          resultObj[d] = 0;
          resultKeys.push(d);
        }
      });
    }
    const seriesData = series?.type === 'dot' ? objFlat(dv.latestData, 'dots') : dv.latestData;
    seriesData.forEach((d: any) => {
      // 针对rangeColumn等xField为数组形式的图表，需要将xField的所有value都记录下来
      array(stateFields[i]).forEach(state => {
        if (!isNil(d[state])) {
          if (isNil(resultObj[d[state]])) {
            stateValues.push(d[state]);
            resultObj[d[state]] = 0;
            resultKeys.push(d[state]);
          }
          if (!isNil(valueFields[i])) {
            // 传进来的d[yFields[i]]可能是stringnumber
            // 传进来的d[yFields[i]]可能是普通的字符串，这时计数按1计算（其实相当于计算数据条数）
            resultObj[d[state]] += isNaN(parseFloat(d[valueFields[i]])) ? 1 : parseFloat(d[valueFields[i]]);
          }
        }
      });
    });
  });

  const sortedStateValues = hasLockDomain
    ? stateValues
    : isCategoryState === false || isAllLinearValue
    ? stateValues.sort((a, b) => a - b)
    : resultKeys;

  sortedStateValues.forEach(state => {
    const res = { [stateField]: state };

    if (valueField) {
      res[valueField] = resultObj[state];
    }

    resultData.push(res);
  });

  return resultData;
};

/** 按比例尺的反向映射解析窗口位置，仅保留两端线性映射的精确快路径。 */
export const statePointToData = (state: number, scale: IBaseScale, reverse: boolean) => {
  const range = scale.range();
  if (scale.type === ScaleEnum.Linear && range.length === 2) {
    const domain = scale.domain();
    if (domain.length === 2) {
      // 两端线性映射保留直接计算，避免像素往返误差将边界值排除在筛选区间外。
      return domain[0] + (domain[1] - domain[0]) * (reverse ? 1 - state : state);
    }
  }
  const start = reverse ? last(range) : range[0];
  const end = reverse ? range[0] : last(range);
  const value = scale.invert(start + (end - start) * state);
  // 连续窗口使用数值锚点，时间比例尺的 Date 统一转换为时间戳。
  return isContinuous(scale.type) ? +value : value;
};

export const dataToStatePoint = (data: number | string, scale: IBaseScale, reverse: boolean) => {
  const range = scale.range();
  const percent = (scale.scale(data) - range[0]) / (last(range) - range[0]);
  return reverse ? 1 - percent : percent;
};

export const isReverse = (axisComponent: CartesianAxis<any>, isHorizontal: boolean) => {
  const axis = axisComponent;
  if (!axis) {
    return false;
  }
  const axisScale = axis.getScale() as IBandLikeScale;
  return axisScale.range()[0] > axisScale.range()[1] && (!axis.getInverse() || isHorizontal);
};

export const getAxisBandSize = (axisSpec?: ICartesianBandAxisSpec) => {
  const bandSize = axisSpec?.bandSize;
  const maxBandSize = axisSpec?.maxBandSize;
  const minBandSize = axisSpec?.minBandSize;
  if (bandSize || minBandSize || maxBandSize) {
    return { bandSize, maxBandSize, minBandSize };
  }
  return undefined;
};

export const parseDomainFromState = (startValue: number | string, endValue: number | string, scale: IBaseScale) => {
  if (isContinuous(scale.type)) {
    return [Math.min(endValue as number, startValue as number), Math.max(endValue as number, startValue as number)];
  }
  const allDomain = scale.domain();
  const startIndex = allDomain.indexOf(startValue);
  const endIndex = allDomain.indexOf(endValue);
  // 值窗口的分类尚未回填时，没有可确定的分类区间。
  if (startIndex < 0 || endIndex < 0) {
    return [];
  }
  return allDomain.slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1);
};
