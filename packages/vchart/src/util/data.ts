import type { DataView } from '@visactor/vdataset';
import type { StatisticOperations } from '../data/transforms/dimension-statistics';
import type { IFieldsMeta } from '../typings/spec/common';

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

export function findFields(
  list: {
    key: string;
    operations: StatisticOperations;
  }[],
  fieldKey: string
) {
  return list.find(i => i.key === fieldKey);
}

export function getFieldAlias(dataView: DataView, field: string) {
  if (!dataView) {
    return null;
  }
  const fields = dataView.getFields();
  if (!fields) {
    return null;
  }
  if (!fields[field]) {
    return null;
  }
  return fields[field].alias;
}

export function getFieldFormat(dataView: DataView, key: string) {
  if (!dataView) {
    return null;
  }
  const fields = dataView.getFields() as Record<string, IFieldsMeta>;
  if (!fields) {
    return null;
  }
  if (!fields[key]) {
    return null;
  }
  // @ts-ignore
  return fields[key].format;
}
