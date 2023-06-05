import type { Datum, IInvalidType, StringOrNumber } from '../../typings';
import { couldBeValidNumber } from '../../util';

export interface ITravelOpt {
  config: () => {
    invalidType: IInvalidType;
    checkField: StringOrNumber;
  };
}

export const invalidTravel = (data: Array<any>, op: ITravelOpt) => {
  const { config } = op;
  if (!config) {
    return data;
  }
  const { invalidType, checkField } = config();
  if (invalidType === 'link') {
    data = data.filter((datum: Datum) => couldBeValidNumber(datum[checkField]));
  } else if (invalidType === 'zero') {
    data.forEach((datum: Datum) => {
      if (!couldBeValidNumber(datum[checkField])) {
        datum[checkField] = 0;
      }
    });
    return data;
  }
  return data;
};
