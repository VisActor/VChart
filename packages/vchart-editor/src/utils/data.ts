import { isValidNumber } from '@visactor/vutils';
import type { IFields } from '@visactor/vdataset';

export function getStandardDataFields(values: {}[]) {
  const fields: IFields = {};
  values.forEach(v => {
    for (const key in v) {
      if (Object.prototype.hasOwnProperty.call(v, key)) {
        if (!fields[key]) {
          fields[key] = { type: v[key] === undefined || isValidNumber(+v[key]) ? 'linear' : 'ordinal' };
        } else if (fields[key].type === 'linear' && !isValidNumber(+v[key])) {
          fields[key] = { type: 'ordinal' };
        }
      }
    }
  });
  return fields;
}

export function validNumber(value: any) {
  return isValidNumber(value) ? value : null;
}
