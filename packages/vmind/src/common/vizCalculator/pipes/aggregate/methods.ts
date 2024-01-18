import type { Value, AggregateMethod } from '../../types';

export const count: AggregateMethod = ({ values }) => {
  return values.length;
};

/**
 * 求和 只限于数值计算，对非数字求和当作 0 值
 * 空行数据没有计算结果，直接为空(null)
 */
export const sum: AggregateMethod = ({ values }) => {
  if (!values.length) {
    return null;
  }

  return values.reduce(
    (total: number, current) => total + (typeof current === 'number' && isFinite(current) ? current : 0),
    0
  );
};

/**
 * 求平均 行为表现同 sum 求和
 */
export const avg: AggregateMethod = ({ column, values }) => {
  if (!values.length) {
    return null;
  }

  const total = sum({ column, values }) as number;
  return total / values.length;
};

export const max: AggregateMethod = ({ values }) => {
  if (!values.length) {
    return null;
  }

  let maximum: Value = null;
  values.forEach(value => {
    if (maximum === null || (value !== null && value > maximum)) {
      maximum = value;
    }
  });

  return maximum;
};

export const min: AggregateMethod = ({ values }) => {
  if (!values.length) {
    return null;
  }

  let minimum: Value = null;
  values.forEach(value => {
    if (minimum === null || (value !== null && value < minimum)) {
      minimum = value;
    }
  });

  return minimum;
};
