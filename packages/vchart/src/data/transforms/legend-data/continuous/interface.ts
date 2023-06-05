import type { IBaseScale } from '@visactor/vgrammar-scale';
import type { ISeries } from '../../../../series/interface';
import type { StringOrNumber } from '../../../../typings';

export interface IContinuousLegendDataMakeOption {
  series: () => ISeries[];
  field: () => string | undefined;
  scale?: () => IBaseScale;
}

export interface IContinuousLegendFilterOption {
  selected: () => StringOrNumber[];
  field: () => string | undefined;
  data: () => StringOrNumber[];
}
