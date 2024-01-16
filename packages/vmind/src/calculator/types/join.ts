/**
 * direction of `join` operation
 * - The `Full` type is not currently used in the current scenario, so it is not implemented yet.
 */
export enum JoinType {
  Left = 'Left',
  Right = 'Right',
  Inner = 'Inner',
  Cross = 'Cross',
  // Full = 'Full'
}
