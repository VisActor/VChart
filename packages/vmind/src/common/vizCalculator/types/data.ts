/**
 * 整个查询计算过程入参，一维对象数组表示数据
 * 每项对象为行，对象每个 key 为列名
 */
export type TableData = Row[];
export type Row = { [column: ColumnName]: Value };
export type ColumnName = string;
/**
 * 数据值类型只支持 string | number | null 格式
 *
 * - 内部不会校验值格式和合法性
 * - 不支持 boolean 值
 * - 日期类型转为 ISO 8601 基本格式 string `YYYY-MM-DD` 等同 string 做计算
 * - 使用目标为大屏静态数据 / HTTP API / JavaScript 生成数据，
 *   因此不支持无限高精度数字类型、不支持高精度数字以 string 存储做计算
 * - 根据 SQL 等价格式，值不能有 `undefined`，即不能有缺失字段值，
 *   空缺字段应该被填充为 `null`
 */
export type Value = string | number | null;
