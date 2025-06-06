import { isArray, last } from '@visactor/vutils';
import { array, isNil } from '../../util';
import type { DataView } from '@visactor/vdataset';

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
    method: 'sum'; // todo: 也许可以提供多种数据统计方法 @chensiji
  };
  output: {
    stateField: string;
    valueField: string;
  };
}

export const dataFilterComputeDomain = (data: Array<any>, op: IDataFilterComputeDomainOption) => {
  const { stateFields, valueFields, dataCollection, isCategoryState } = op.input;
  const { stateField, valueField } = op.output;
  const resultObj: any = {};
  const resultData: any[] = [];
  const stateValues: any[] = [];
  let hasLockDomain = false;

  dataCollection.forEach((dv: DataView, i) => {
    if (isNil(stateFields[i])) {
      return;
    }
    // 按照用户指定的domain进行排序(这里不通过getRawDataStatistics来取是因为时机不对，此时getRawDataStatistics还没有正确结果)
    const stateFieldInfo = dv.getFields()?.[stateFields[i]];
    if (stateFieldInfo && stateFieldInfo.lockStatisticsByDomain) {
      hasLockDomain = true;
      stateFieldInfo.domain.forEach((d: any) => {
        if (isNil(resultObj[d])) {
          stateValues.push(d);
          resultObj[d] = 0;
        }
      });
    }
    dv.latestData.forEach((d: any) => {
      // 针对rangeColumn等xField为数组形式的图表，需要将xField的所有value都记录下来
      array(stateFields[i]).forEach(state => {
        if (!isNil(d[state])) {
          if (isNil(resultObj[d[state]])) {
            stateValues.push(d[state]);
            resultObj[d[state]] = 0;
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
    : isCategoryState === false
    ? stateValues.sort((a, b) => a - b)
    : Object.keys(resultObj);

  sortedStateValues.forEach(state => {
    const res = { [stateField]: state };

    if (valueField) {
      res[valueField] = resultObj[state];
    }

    resultData.push(res);
  });

  return resultData;
};
