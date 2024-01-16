import type {
  ColumnName,
  ColumnConfig,
  ColumnEvaluate,
  Row,
  TableData,
  GroupMap,
  GroupedData,
} from '../types'
import { OrderedMap } from '../utils'
import {
  evaluateRowColumnValue,
  getColumnIdentityName,
} from './select'


export type GroupPipe = (params: {
  groupBy?: (ColumnName | ColumnEvaluate)[];
  source: TableData;
}) => (
  (tableData: TableData) => GroupedData
)

/**
 * Perform grouping when there is a groupBy configuration or when there are aggregate functions in the select.
 *
 * The difference is that when "groupBy is empty and there are only aggregate functions in the select", it is equivalent to aggregating the entire table into a single group.
 * This is ensured by the external pipe process when "there are only aggregate functions in the select".
 */
export const group: GroupPipe = ({ groupBy, source }: {
  groupBy?: (ColumnName | ColumnEvaluate)[];
  source: TableData;
}): ((tableData: TableData) => GroupedData) => {
  return (tableData) => {
    /**
     * If the groupBy configuration is not present in the group logic,
     * it means that "there are only aggregate functions in the select" determined in the outer pipe process,
     * and the entire table is aggregated into a single group.
     */
    if (!groupBy?.length) {
      return [{
        by: {},
        rows: tableData,
      }]
    }

    const groupMap: GroupMap = buildGroupsMap({
      tableData,
      groupBy,
      source,
    })

    // Convert multi-level pivot structure to grouped detail table structure
    const grouped = traverseToGrouped({
      groupMapOrRows: groupMap,
      groupBy,
    })

    return grouped
  }
}

/**
 * Build a map for group execution during the group by phase.
 * - Each map layer corresponds to the order of group-by columns.
 * - Each map key represents the column value, and the keys are arranged in the order of insertion (row order).
 * - The innermost layer is the original data row chunk.
 */
export const buildGroupsMap = ({ tableData, groupBy, source = tableData }: {
  tableData: TableData;
  groupBy: (ColumnName | ColumnEvaluate)[];
  source?: TableData;
}): GroupMap => {
  const groupMap: GroupMap = new OrderedMap()
  tableData.forEach(row => {
    let currentMap = groupMap

    groupBy.forEach((column, index) => {
      const value = evaluateRowColumnValue({
        row,
        source,
        column: { column },
      })
      if (index === groupBy.length - 1) {
        if (!currentMap.has(value)) {
          currentMap.set(value, [])
        }
        const rows = currentMap.get(value) as Row[]
        rows.push(row)

      } else {
        if (!currentMap.has(value)) {
          currentMap.set(value, new OrderedMap())
        }
        currentMap = currentMap.get(value) as GroupMap
      }
    })
  })

  return groupMap
}

/**
 * Depth-first traverse
 * transform GroupMap to GroupData
 */
const traverseToGrouped = (params: {
  groupMapOrRows: GroupMap | Row[];
  groupBy: (ColumnName | ColumnEvaluate)[];
  /**
   * from 0 to `groupBy.length`
   * @default 0
   */
  depth?: number;
  by?: Partial<Row>;
  /** Accumulated grouping results during traversal */
  grouped?: GroupedData;
}): GroupedData => {
  const {
    groupMapOrRows,
    groupBy,
    grouped = [],
    depth = 0,
    by = {},
  } = params

  if (depth === groupBy.length) {
    const rows = groupMapOrRows as Row[]
    grouped.push({
      by,
      rows,
    })
    return grouped
  }

  const column = groupBy[depth]
  const groupMap = groupMapOrRows as GroupMap

  // OrderedMap
  groupMap.forEach((mapOrList, value) => {
    const columnConfig = { column } as ColumnConfig
    by[getColumnIdentityName(columnConfig)] = value

    traverseToGrouped({
      groupMapOrRows: mapOrList,
      groupBy,
      depth: depth + 1,
      by: { ...by },
      grouped,
    })
  })

  return grouped
}
