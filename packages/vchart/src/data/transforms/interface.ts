export type StatisticOperations = Array<'max' | 'min' | 'values' | 'array-max' | 'array-min' | 'allValid'>;

export interface IStatisticsOption {
  fields: {
    key: string;
    operations: StatisticOperations;
    filter?: (fv: any) => boolean;
    customize?: { max: number; min: number } | any[];
  }[];
  // operations: Array<'max' | 'min' | 'values'>;
  target?: 'parser' | 'latest';
}
