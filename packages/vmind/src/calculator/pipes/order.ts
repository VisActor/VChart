import {
  type TableData,
  type ColumnName,
  type ColumnEvaluate,
  type AggregateEvaluate,
  type GroupedData,
  type GroupChunk,
  type Value,
  type Row,
  type OrderColumn,
  OrderType,
} from '../types'
import {
  evaluateRowColumnValue,
  evaluateGroupColumnValue,
  getColumnIdentity,
} from './select'


export type OrderPipe = (param: {
  orderBy?: OrderColumn[];
  source: TableData;
}) => (
  (tableData: TableData) => TableData
)

export type OrderGroupPipe = (param: {
  orderBy?: OrderColumn[];
  source: TableData;
}) => (
  (grouped: GroupedData) => GroupedData
)

/**
 * Sort rows of non-aggregated data.
 * There should be no aggregate calculations in the sorting fields of non-aggregated results (guaranteed by the user).
 *
 * Null values in ascending or descending order follow the default rules of ClickHouse (NULLS LAST).
 */
export const order: OrderPipe = ({ orderBy, source }: {
  orderBy?: OrderColumn[];
  source: TableData;
}): ((tableData: TableData) => TableData) => {
  return (tableData) => {
    if (!orderBy?.length) return tableData

    // Make a copy of the original data object that may be the entire query from input parameter
    const rows = [...tableData]

    // Map for manual sorting {value -> order}
    const manualListMaps: ManualListMaps = getManualListMaps(orderBy)

    const compare: CompareFn<Row> = definedCompare<Row>({
      orderBy,
      manualListMaps,
      getValue: (row, order) => evaluateRowColumnValue({
        row,
        source: rows,
        column: order as OrderColumn & { aggregate: undefined },
      }),
    })

    return rows.sort(compare)
  }
}

/**
 * Sort groups of aggregated data.
 * The sorting fields may contain aggregate calculations.
 * When not using aggregate calculations, the first data of the group represents the entire group.
 *
 * Null values in ascending or descending order follow the default rules of ClickHouse (NULLS LAST).
 */
export const orderGroup: OrderGroupPipe = ({ orderBy, source }: {
  orderBy?: OrderColumn[];
  source: TableData;
}): ((grouped: GroupedData) => GroupedData) => {
  return (grouped) => {
    if (!orderBy?.length) return grouped

    // Map for manual sorting {value -> order}
    const manualListMaps: ManualListMaps = getManualListMaps(orderBy)

    const compare: CompareFn<GroupChunk> = definedCompare<GroupChunk>({
      orderBy,
      manualListMaps,
      getValue: (group, order) => {
        return evaluateGroupColumnValue({
          group,
          source,
          column: order,
        })
      },
    })

    return grouped.sort(compare)
  }
}


type Index = number
/** Map of {value -> order} constructed from "manual sorting items" */
type ManualListMap = Map<Value, Index>
type ManualListMaps = Map<ColumnName | ColumnEvaluate | AggregateEvaluate, ManualListMap>

/**
 * Build a map of {value -> order} for manual sorting
 */
const getManualListMaps = (orderBy: OrderColumn[]): ManualListMaps => {
  const manualListMaps: ManualListMaps = new Map()
  orderBy.forEach(order => {
    if (order.type == OrderType.Manual) {
      manualListMaps.set(
        getColumnIdentity(order),
        new Map(order.manualList.map((value, index) => [value, index])),
      )
    }
  })
  return manualListMaps
}



/**
 * If return < 0, item1 comes before item2 in ascending order.
 * If return > 0, item1 comes after item2 in descending order.
 * If return = 0, the relative position of item1 and item2 remains unchanged.
 */
type CompareFn<T> = (item1: T, item2: T) => -1 | 0 | 1

const definedCompare = <T>(params: {
  orderBy: OrderColumn[];
  manualListMaps: ManualListMaps;
  getValue: (item: T, order: OrderColumn) => Value;
}): CompareFn<T> => {
  const {
    orderBy,
    getValue,
    manualListMaps,
  } = params

  return (item1: T, item2: T) => {
    for (const order of orderBy) {
      let compareResult: -1 | 0 | 1 = 0

      if (!order.type || order.type === OrderType.Asc) {
        compareResult = compareValue(
          getValue(item1, order),
          getValue(item2, order),
        )

      } else if (order.type === OrderType.Desc) {
        compareResult = compareValue(
          getValue(item2, order),
          getValue(item1, order),
        )

      } else {
        // Only manual sorting remains, comparing using the {manual value -> order} map
        const manualMap = manualListMaps.get(getColumnIdentity(order))!
        compareResult = compareInManualList(
          manualMap,
          getValue(item1, order),
          getValue(item2, order),
        )
      }

      // If the current field comparison is equal, compare the next orderBy field
      if (compareResult !== 0) return compareResult
    }

    return 0
  }
}


/**
 * value1 < value2  => -1
 * value1 > value2  => 1
 * value1 = value2  => 0
 * Handles null values, follows the default rules of ClickHouse (NULLS LAST)
 */
const compareValue: CompareFn<Value> = (value1, value2): -1 | 0 | 1 => {
  if (value1 === null || value2 === null) {
    if (value1 === null && value2 !== null) return 1
    if (value1 !== null && value2 === null) return -1
    // value1 = value2 = null
    return 0
  }
  if (value1 < value2) return -1
  if (value1 > value2) return 1
  // value1 = value2
  return 0
}

/**
 * Compares the order of the current value in the "manual sorting list" using the manualMap,
 * and then directly compares the order.
 */
const compareInManualList = (
  manualMap: ManualListMap,
  value1: Value,
  value2: Value,
):  -1 | 0 | 1 => {
  if (value1 === value2) return 0
  if (manualMap.has(value1) && !manualMap.has(value2)) return -1
  if (!manualMap.has(value1) && manualMap.has(value2)) return 1
  if (!manualMap.has(value1) && !manualMap.has(value2)) return 0

  const diff = manualMap.get(value1)! - manualMap.get(value2)!
  return diff > 0 ? 1 : -1
}
