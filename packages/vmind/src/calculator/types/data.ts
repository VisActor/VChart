/**
 * Input for the entire query calculation process, represented as a one-dimensional array of objects.
 * Each object represents a row, with each key representing a column name.
 */
export type TableData = Row[]
export type Row = { [column: ColumnName]: Value }
export type ColumnName = string
/**
 * The data value type only supports the format `string | number | null`.
 *
 * - The value format and validity will not be validated internally.
 * - `boolean` values are not supported.
 * - Date types are converted to the ISO 8601 basic format string `YYYY-MM-DD`, which is equivalent to string calculations.
 * - It is intended for static data / HTTP API / JavaScript-generated data,
 *   therefore it does not support infinite precision number types, and does not support high-precision numbers stored as `string` for calculations.
 * - According to the SQL equivalent format, values cannot be `undefined`, i.e., there should be no missing field values,
 *   and empty fields should be filled with `null`.
 */
export type Value = string | number | null
