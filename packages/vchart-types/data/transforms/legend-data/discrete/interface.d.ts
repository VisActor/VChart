import type { ISeries } from '../../../../series/interface';
import type { StringOrNumber } from '../../../../typings';
export interface IDiscreteLegendData {
  key: string;
  style: (attribute: string) => any;
}
export interface IDiscreteLegendDataMakeOption {
  series: () => ISeries[];
  seriesField: (s: ISeries) => string;
}
export interface IDiscreteLegendFilterOption {
  selected: () => StringOrNumber[];
  field: () => string;
  data: () => StringOrNumber[];
}
