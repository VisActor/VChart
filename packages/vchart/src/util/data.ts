import type { DataView } from '@visactor/vdataset';
import type { StatisticOperations } from '../data/transforms/dimension-statistics';
import {
  STACK_FIELD_END,
  STACK_FIELD_START_PERCENT,
  STACK_FIELD_END_PERCENT,
  STACK_FIELD_END_OffsetSilhouette,
  STACK_FIELD_START_OffsetSilhouette,
  STACK_FIELD_TOTAL,
  STACK_FIELD_TOTAL_PERCENT,
  STACK_FIELD_TOTAL_TOP,
  STACK_FIELD_START
} from '../constant';
import { toValidNumber } from './type';
import { max, sum } from './math';
import type { ISeries, ISeriesStackDataMeta } from '../series/interface';

export function mergeFields(
  targetFields: {
    key: string;
    operations: StatisticOperations;
  }[],
  mergeFields: {
    key: string;
    operations: StatisticOperations;
  }[]
): {
  key: string;
  operations: StatisticOperations;
}[] {
  for (let i = 0; i < mergeFields.length; i++) {
    const element = mergeFields[i];
    const _target = findFields(targetFields, element.key);
    if (!_target) {
      targetFields.push(element);
    } else {
      _target.operations = [...new Set(_target.operations.concat(element.operations))];
    }
  }
  return targetFields;
}

function findFields(
  list: {
    key: string;
    operations: StatisticOperations;
  }[],
  fieldKey: string
) {
  return list.find(i => i.key === fieldKey);
}

// 如果不存在别名就返回 field
export function getFieldAlias(dataView: DataView, field: string) {
  if (!dataView) {
    return field ?? null;
  }
  const fields = dataView.getFields();
  if (!fields) {
    return field ?? null;
  }
  if (!fields[field]) {
    return field ?? null;
  }
  return fields[field].alias ?? field;
}

export interface IStackCacheNode {
  values: any[];
  series: {
    s: ISeries;
    values: any[];
  }[];
  nodes: {
    [key: string]: IStackCacheNode;
  };
}
export interface IStackCacheRoot {
  nodes: {
    [key: string]: IStackCacheNode;
  };
}

export function getRegionStackGroup(
  region: { getSeries: () => any[] },
  setInitialValue: boolean,
  filter?: (s: any) => boolean
) {
  const stackValueGroup: { [key: string]: IStackCacheRoot } = {};
  // 分组
  region.getSeries().forEach(s => {
    const stackData = s.getStackData();
    const stackValue = s.getStackValue();
    const stackValueField = s.getStackValueField();
    const filterEnable = filter ? filter(s) : true;
    if (stackData && stackValueField && filterEnable) {
      stackValueGroup[stackValue] = stackValueGroup[stackValue] ?? {
        nodes: {}
      };
      stackGroup(s, stackData, stackValueGroup[stackValue] as IStackCacheNode, stackValueField, setInitialValue);
    }
  });
  return stackValueGroup;
}

export function stackTotal(stackData: IStackCacheNode, valueField: string) {
  if ('values' in stackData && stackData.values.length) {
    const total = sum(stackData.values, valueField);
    const percent = max(stackData.values, STACK_FIELD_END_PERCENT);
    stackData.values.forEach(v => {
      v[STACK_FIELD_TOTAL] = total;
      v[STACK_FIELD_TOTAL_PERCENT] = percent;
      delete v[STACK_FIELD_TOTAL_TOP];
    });
    const maxNode = stackData.values.reduce((max, current) => {
      return current[STACK_FIELD_END] > max[STACK_FIELD_END] ? current : max;
    });
    maxNode[STACK_FIELD_TOTAL_TOP] = true;
    return;
  }
  for (const key in stackData.nodes) {
    stackTotal(stackData.nodes[key], valueField);
  }
}

export function stackOffsetSilhouette(stackCache: IStackCacheNode) {
  if (!stackCache.values.length) {
    return;
  }
  const centerValue = stackCache.values[stackCache.values.length - 1][STACK_FIELD_END] / 2;
  for (let j = 0; j < stackCache.values.length; j++) {
    stackCache.values[j][STACK_FIELD_START_OffsetSilhouette] = stackCache.values[j][STACK_FIELD_START] - centerValue;
    stackCache.values[j][STACK_FIELD_END_OffsetSilhouette] = stackCache.values[j][STACK_FIELD_END] - centerValue;
  }
}

export function stack(stackCache: IStackCacheNode, stackInverse: boolean, hasPercent?: boolean) {
  if (stackCache.values.length > 0) {
    // 设置一个小数以保证 log 计算不会报错
    let positiveStart = 0;
    let negativeStart = 0;
    // temp
    let sign = 1;
    let value = 0;

    // stack
    const maxLength = stackCache.values.length;
    for (let index = 0; index < maxLength; index++) {
      const v = stackCache.values[stackInverse ? maxLength - 1 - index : index];
      value = v[STACK_FIELD_END];
      if (value >= 0) {
        v[STACK_FIELD_START] = positiveStart;
        positiveStart += v[STACK_FIELD_END];
        v[STACK_FIELD_END] = positiveStart;
      } else {
        v[STACK_FIELD_START] = negativeStart;
        negativeStart += v[STACK_FIELD_END];
        v[STACK_FIELD_END] = negativeStart;
      }
    }
    if (hasPercent) {
      // normalize
      for (let index = 0; index < maxLength; index++) {
        const v = stackCache.values[stackInverse ? maxLength - 1 - index : index];
        value = v[STACK_FIELD_END];
        const denominator = value >= 0 ? positiveStart : negativeStart;
        sign = value >= 0 ? 1 : -1;
        v[STACK_FIELD_START_PERCENT] = denominator === 0 ? 0 : Math.min(1, v[STACK_FIELD_START] / denominator) * sign;
        v[STACK_FIELD_END_PERCENT] = denominator === 0 ? 0 : Math.min(1, v[STACK_FIELD_END] / denominator) * sign;
      }
    }
  }

  for (const key in stackCache.nodes) {
    stack(stackCache.nodes[key], stackInverse, hasPercent);
  }
}

export function stackGroup(
  s: ISeries,
  stackData: ISeriesStackDataMeta,
  stackCache: IStackCacheNode,
  valueField: string,
  setInitialValue: boolean
) {
  if ('values' in stackData) {
    // 初值
    setInitialValue && stackData.values.forEach(v => (v[STACK_FIELD_END] = toValidNumber(v[valueField])));
    stackCache.values.push(...stackData.values);
    stackCache.series.push({ s: s, values: stackData.values });
    return;
  }
  for (const key in stackData.nodes) {
    !stackCache.nodes[key] &&
      (stackCache.nodes[key] = {
        values: [],
        series: [],
        nodes: {}
      });
    stackGroup(s, stackData.nodes[key], stackCache.nodes[key], valueField, setInitialValue);
  }
}
