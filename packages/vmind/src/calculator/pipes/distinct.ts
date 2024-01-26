import type {
  TableData,
  Value,
  Select,
} from '../types'
import { getSelectColumnName } from './select'


export type DistinctPipe = (param: { select: Select }) => (
  (tableData: TableData) => TableData
)

/**
 * Determines whether to remove duplicates from the select result.
 * `SELECT DISTINCT`
 *
 * The process of removing duplicates is similar to the group by process.
 */
export const distinct: DistinctPipe = ({ select }) => {
  if (!select.distinct) return (tableData) => tableData

  return (tableData) => {
    const columns = select.columns.map(getSelectColumnName)
    const distinctRows: TableData = []
    const distinctMap: DistinctMap = new Map()

    tableData.forEach(row => {
      let currentMap = distinctMap

      columns.forEach((column, index) => {
        const value = row[column]
        if (index === columns.length - 1) {
          if (!currentMap.has(value)) {
            currentMap.set(value, new Set())
          }
          const values = currentMap.get(value) as Set<Value>
          if (!values.has(value)) {
            values.add(value)
            distinctRows.push(row)
          }

        } else {
          if (!currentMap.has(value)) {
            currentMap.set(value, new Map())
          }

          currentMap = currentMap.get(value) as DistinctMap
        }
      })
    })


    return distinctRows
  }
}

/**
 * The execution of distinct is similar to the group by process.
 * - Each layer of the map corresponds to the order of select columns.
 * - The key of each layer of the map is the value of the column.
 * - The innermost layer is a set composed of the values of the last column.
 */
type DistinctMap = Map<Value, DistinctMap | Set<Value>>
