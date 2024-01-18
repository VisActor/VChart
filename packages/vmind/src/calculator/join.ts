import {
  type TableData,
  JoinType,
  type ColumnName,
  type GroupMap,
  type Row,
} from './types'
import { buildGroupsMap } from './pipes'


export const join = ({ type, left, right, using }: {
  type: JoinType;
  left: TableData;
  right: TableData;
  /** Columns with the same name as the `join` condition */
  using: ColumnName[];
}): TableData => {
  const joinMethods = {
    [JoinType.Left]: leftJoin,
    [JoinType.Right]: rightJoin,
    [JoinType.Inner]: innerJoin,
    [JoinType.Cross]: crossJoin,
  }

  return joinMethods[type]({ left, right, using })
}

/**
 * Left Join two tables
 * - Use the columns specified in 'using' as the `join` condition, as a simplified 'on' condition (i.e., on columns with the same name)
 * - In SQL engines, a Cartesian product virtual table is usually used for filtering. This implementation uses index lookup for interpolation.
 * - [Simplified] Supports one-to-many data like SQL, but in each result, the right table overrides the left table in unrelated fields, and it is not possible to retrieve only the left or right table data separately.
 */
export const leftJoin = ({ left, right, using }: {
  left: TableData;
  right: TableData;
  /** Columns with the same name as the `join` condition */
  using: ColumnName[];
}): TableData => {
  const result: TableData = []

  const rightIndex = buildGroupsMap({
    tableData: right,
    groupBy: using,
  })

  left.forEach(leftRow => {
    const values = using.map(column => leftRow[column])

    const rightRows = values.reduce(
      (groupMapOrRows: GroupMap | Row[], value) => (groupMapOrRows as GroupMap).get(value)!,
      rightIndex,
    ) as Row[] | undefined

    if (!rightRows?.length) {
      result.push(leftRow)
      return
    }

    rightRows.forEach(rightRow => {
      result.push({
        ...leftRow,
        ...rightRow,
      })
    })
  })

  return result
}


export const rightJoin = ({ left, right, using }: {
  left: TableData;
  right: TableData;
  using: ColumnName[];
}): TableData => {
  return leftJoin({
    left: right,
    right: left,
    using,
  })
}

export const innerJoin = ({ left, right, using }: {
  left: TableData;
  right: TableData;
  /** Columns with the same name as the `join` condition */
  using?: ColumnName[];
}): TableData => {
  const result: TableData = []

  left.forEach(leftRow => {
    right.forEach(rightRow => {

      if (
        !using?.length
        || using.every(column => leftRow[column] === rightRow[column])
      ) {
        result.push({
          ...leftRow,
          ...rightRow,
        })
      }
    })
  })

  return result
}

/**
 * Cross Join Cartesian Product
 */
export const crossJoin = ({ left, right }: {
  left: TableData;
  right: TableData;
}): TableData => {
  return innerJoin({
    left,
    right,
  })
}
