# Tasks: Legend Item MaxWidth Fix

**Feature**: Legend Item MaxWidth Fix
**Branch**: 002-legend-item-maxwidth
**Created**: 2026-01-26

## Implementation Strategy

**MVP First**: Implement User Story 1 (Legend Layout with Pager) - this is the only user story and the complete feature scope.

**Incremental Delivery**:
1. Modify the percentage resolution logic in `util.ts`
2. Verify that `vrender-components` handles percentage strings
3. Add unit tests to validate the behavior

## Dependencies

```
US1 (Legend Layout with Pager)
└── No dependencies (independent user story)
```

## Parallel Execution Opportunities

- **Phase 3 (US1)**: All tasks are sequential due to the single-file modification nature

## Phases

### Phase 1: Setup

**Goal**: Prepare the development environment for the feature

**Independent Test Criteria**: Development environment is ready and tests can be run

**Tasks**:
- [x] T001 Switch to feature branch `002-legend-item-maxwidth`
- [ ] T002 Ensure dependencies are installed by running `rush update` in the repository root
- [ ] T003 Verify the project builds successfully by running `rush build -t @visactor/vchart`

---

### Phase 2: Foundational

**Goal**: Understand the current implementation and verify `vrender-components` support

**Independent Test Criteria**: Confirmed that `vrender-components` can handle percentage strings for `item.maxWidth`

**Tasks**:
- [x] T004 Review the current `getLegendAttributes` implementation in `packages/vchart/src/component/legend/discrete/util.ts`
- [ ] T005 Verify that `@visactor/vrender-components` supports percentage strings for `item.maxWidth` by checking its documentation or source code
- [x] T006 If `vrender-components` does not support percentage strings, create a fallback plan to calculate pager width and subtract it from `rect.width`

---

### Phase 3: User Story 1 - Legend Layout with Pager (Priority: P1)

**Goal**: Fix legend item `maxWidth` to exclude pager width from calculation

**Independent Test Criteria**: Create a chart with a legend containing long text items that trigger pagination. Set `maxWidth` to a percentage. Verify that the item width is calculated based on the space *excluding* the pager.

**Acceptance Scenarios**:
1. **Given** a chart with a discrete legend containing many items that trigger the pager,
   **When** the legend items have `maxWidth` configured as a percentage (e.g., '50%'),
   **Then** the calculated maximum width of each item should be relative to the legend content width excluding the pager width.

2. **Given** a legend with a pager,
   **When** the available width changes (e.g., container resize),
   **Then** the item `maxWidth` should recalculate based on the new effective width (total - pager).

**Tasks**:
- [x] T007 [US1] Modify `getLegendAttributes` in `packages/vchart/src/component/legend/discrete/util.ts` to stop resolving percentage `maxWidth` to pixels
- [x] T008 [US1] Remove the percentage resolution logic for `item.maxWidth` (lines 72-74 in util.ts)
- [ ] T009 [US1] Add a comment explaining that percentage `maxWidth` is now passed directly to `vrender-components` for proper layout calculation
- [x] T010 [US1] Create a unit test in `packages/vchart/__tests__/unit/component/legend/discrete/legend.test.ts` to verify that percentage `maxWidth` is passed as a string
- [x] T011 [US1] Create a visual regression test case to verify that legend items do not overlap the pager when `maxWidth` is set to a percentage
- [ ] T012 [US1] Run existing tests to ensure no regressions: `rush test` in the `packages/vchart` directory

---

### Phase 4: Polish & Cross-Cutting Concerns

**Goal**: Ensure code quality, documentation, and compliance with project standards

**Independent Test Criteria**: All linting passes, code is formatted, and documentation is updated

**Tasks**:
- [x] T013 Run ESLint to check for code quality issues: `npm run eslint` in `packages/vchart`
- [ ] T014 Fix any ESLint errors or warnings
- [x] T015 Run Prettier to format the code: `npm run prettier` in `packages/vchart`
- [ ] T016 Update the type definitions in `packages/vchart-types/types/component/legend/discrete/interface.d.ts` if needed to reflect the change in `maxWidth` handling
- [x] T017 Update the documentation in `docs/assets/option/zh/component/legend-discrete.md` and `docs/assets/option/en/component/legend-discrete.md` to clarify that `maxWidth` percentage is relative to the content area (excluding pager)
- [x] T018 Create an example in the documentation showing the proper usage of `maxWidth` with a pager

---

## Summary

**Total Task Count**: 18 tasks

**Task Count per User Story**:
- US1 (Legend Layout with Pager): 6 tasks (T007-T012)

**Parallel Opportunities Identified**:
- Phase 3 (US1): All tasks are sequential due to the single-file modification nature

**Independent Test Criteria for Each Story**:
- US1: Create a chart with a legend containing long text items that trigger pagination. Set `maxWidth` to a percentage. Verify that the item width is calculated based on the space *excluding* the pager.

**Suggested MVP Scope**:
- Implement User Story 1 (Legend Layout with Pager) - this is the complete feature scope and delivers the primary value.

**Format Validation**:
- ✅ All tasks follow the checklist format (checkbox, ID, labels, file paths)
- ✅ All tasks have clear file paths
- ✅ All user story phase tasks have the [US1] label
- ✅ Setup and Polish phases do not have story labels
