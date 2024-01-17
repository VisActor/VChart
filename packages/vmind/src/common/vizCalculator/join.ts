import { type TableData, JoinType, type ColumnName, type GroupMap, type Row } from './types';
import { buildGroupsMap } from './pipes';

export const join = ({
  type,
  left,
  right,
  using
}: {
  type: JoinType;
  left: TableData;
  right: TableData;
  /** join 条件同名列 */
  using: ColumnName[];
}): TableData => {
  const joinMethods = {
    [JoinType.Left]: leftJoin,
    [JoinType.Right]: rightJoin,
    [JoinType.Inner]: innerJoin,
    [JoinType.Cross]: crossJoin
  };

  return joinMethods[type]({ left, right, using });
};

/**
 * Left Join 两个表
 * - 使用 using 指定的列作为 join 条件，作为简化的 on 条件 (即 on 同名列)
 * - SQL 引擎中通常使用笛卡尔积虚拟表再做筛选，此处实现仅用索引查找构建做插值
 * - [简化] 同 SQL 一样支持一对多数据，
 *    但每条结果的其他无关字段中，右表覆盖左表，无法单独取出左表或右表数据
 */
export const leftJoin = ({
  left,
  right,
  using
}: {
  left: TableData;
  right: TableData;
  /** join 条件同名列 */
  using: ColumnName[];
}): TableData => {
  const result: TableData = [];

  const rightIndex = buildGroupsMap({
    tableData: right,
    groupBy: using
  });

  left.forEach(leftRow => {
    const values = using.map(column => leftRow[column]);

    const rightRows = values.reduce(
      (groupMapOrRows: GroupMap | Row[], value) => (groupMapOrRows as GroupMap).get(value)!,
      rightIndex
    ) as Row[] | undefined;

    if (!rightRows?.length) {
      result.push(leftRow);
      return;
    }

    rightRows.forEach(rightRow => {
      result.push({
        ...leftRow,
        ...rightRow
      });
    });
  });

  return result;
};

export const rightJoin = ({
  left,
  right,
  using
}: {
  left: TableData;
  right: TableData;
  using: ColumnName[];
}): TableData => {
  return leftJoin({
    left: right,
    right: left,
    using
  });
};

export const innerJoin = ({
  left,
  right,
  using
}: {
  left: TableData;
  right: TableData;
  /** join 条件同名列 */
  using?: ColumnName[];
}): TableData => {
  const result: TableData = [];

  left.forEach(leftRow => {
    right.forEach(rightRow => {
      if (!using?.length || using.every(column => leftRow[column] === rightRow[column])) {
        result.push({
          ...leftRow,
          ...rightRow
        });
      }
    });
  });

  return result;
};

/**
 * Cross Join 笛卡尔积
 */
export const crossJoin = ({ left, right }: { left: TableData; right: TableData }): TableData => {
  return innerJoin({
    left,
    right
  });
};
