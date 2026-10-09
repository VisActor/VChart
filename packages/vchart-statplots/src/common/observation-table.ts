import type { TableObservation } from './observation-table-types';
import { checkUnique, issue } from './validation';
export function validateObservationTable(variables: readonly string[], observations: readonly TableObservation[]) {
  const errors = checkUnique(observations, row => row.id, '/data/observations');
  const names = new Set(variables);
  if (!variables.length || names.size !== variables.length || variables.some(name => !name.length)) {
    errors.push(issue('INVALID_RANGE', '/variables', 'variables 须为非空且不重复的变量名称'));
  }
  observations.forEach((row, i) => {
    if (!row.id.length) {
      errors.push(issue('INVALID_RANGE', `/data/observations/${i}/id`, '观测 id 不能为空'));
    }
    const keys = Object.keys(row.values);
    if (keys.length !== names.size || keys.some(key => !names.has(key))) {
      errors.push(
        issue('INVALID_RANGE', `/data/observations/${i}/values`, 'values 须恰好包含 variables 中的键，缺失显式为 null')
      );
    }
  });
  return errors;
}
