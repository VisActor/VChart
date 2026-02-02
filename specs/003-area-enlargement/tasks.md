# Implementation Tasks: Area Enlargement Line Chart

**Feature**: Area Enlargement Line Chart
**Branch**: `003-area-enlargement`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Implementation Strategy

We will revert the custom scale implementation and instead implement logic in `LinearAxisMixin` and `CartesianLinearAxis` to construct piecewise domain and range arrays for the standard `LinearScale`.

## Dependencies

- US1 (Single Interval) -> US2 (Multiple Intervals)

## Phase 1: Cleanup & Setup

- [ ] T001 Revert `LinearIntervalScale` related changes (delete file, unregister).
- [ ] T002 Ensure `IIntervalRatio` is defined in `packages/vchart/src/typings/scale.ts` and `customDistribution` in `packages/vchart/src/component/axis/interface/spec.ts`.

## Phase 2: Foundational (Axis Logic)

- [ ] T003 Implement `computeLinearDomain` update in `packages/vchart/src/component/axis/mixin/linear-axis-mixin.ts` to handle `customDistribution` (construct piecewise domain).
- [ ] T004 Implement `getNewScaleRange` update in `packages/vchart/src/component/axis/cartesian/linear-axis.ts` to handle `customDistribution` (construct piecewise range based on ratios).

## Phase 3: Verification (P1 & P2)

**Goal**: Verify area enlargement works.

- [ ] T005 Verify `computeLinearDomain` logic via unit test in `packages/vchart/src/component/axis/mixin/__tests__/linear-axis-mixin.test.ts` (create/update test).
- [ ] T006 Verify `getNewScaleRange` logic (or end-to-end axis behavior) via demo or integration test.

## Phase 4: Polish

- [ ] T007 [Polish] Add documentation/comments for `customDistribution`.
