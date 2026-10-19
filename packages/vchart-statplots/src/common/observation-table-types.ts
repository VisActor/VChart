/** JSON 原始单元格；null 是唯一缺失标记。 */
export type ObservationValue = number | string | boolean | null;
export interface TableObservation {
  id: string;
  values: { [variable: string]: ObservationValue };
}
export interface NumericObservation {
  id: string;
  values: { [variable: string]: number | null };
}
