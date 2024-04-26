// chart data parser default field
export const ChartDimensionField = `_editor_dimension_field`;
export const ChartValueField = `_editor_value_field`;
export const ChartTypeField = `_editor_type_field`;
export const DataPercentageField = `_editor_percentage_field`;

export enum Direction {
  vertical = 'vertical',
  horizontal = 'horizontal'
}

export type DirectionType = keyof typeof Direction;
