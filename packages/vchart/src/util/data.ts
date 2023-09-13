import type { DataView } from '@visactor/vdataset';
import type { StatisticOperations } from '../data/transforms/dimension-statistics';

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
