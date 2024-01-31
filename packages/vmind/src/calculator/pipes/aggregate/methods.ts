import type {
  Value,
  AggregateMethod,
} from '../../types'


export const count: AggregateMethod = ({ values }) => {
  return values.length
}

/**
 * Summation, limited to numerical calculations. Non-numeric values are treated as 0.
 * Empty data rows have no calculation result and are returned as null.
 */
export const sum: AggregateMethod = ({ values }) => {
  if (!values.length) {
    return null
  }

  return values.reduce(
    (total: number, current) => total + (
      (typeof current === 'number' && isFinite(current))
        ? current
        : 0
    ),
    0,
  )
}

/**
 * Average calculation, behaves the same as sum.
 */
export const avg: AggregateMethod = ({ column, values }) => {
  if (!values.length) {
    return null
  }

  const total = sum({ column, values }) as number
  return total / values.length
}

export const max: AggregateMethod =  ({ values }) => {
  if (!values.length) {
    return null
  }

  let maximum: Value = null
  values.forEach(value => {
    if (
      maximum === null
      || (value !== null && value > maximum)
    ) {
      maximum = value
    }
  })

  return maximum
}


export const min: AggregateMethod =  ({ values }) => {
  if (!values.length) {
    return null
  }

  let minimum: Value = null
  values.forEach(value => {
    if (
      minimum === null
      || (value !== null && value < minimum)
    ) {
      minimum = value
    }
  })

  return minimum
}
