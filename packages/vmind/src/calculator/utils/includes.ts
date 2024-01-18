/**
 * The `includes` method that includes type conversion for comparing `numbers`/`strings`.
 */
export const includes = (array: (string | number)[], value: string | number) => (
  array.some(item => item == value)
)
