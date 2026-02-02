# Implementation Plan: Area Enlargement Line Chart

**Branch**: `003-area-enlargement` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-area-enlargement/spec.md`

## Summary

Implement Area Enlargement (non-uniform linear axis) by leveraging the native piecewise domain/range capability of `LinearScale` (in `@visactor/vscale`). We will allow users to define `customDistribution` in the axis spec, which will be converted into multi-segment domain and range arrays for the scale.

## Technical Context

**Language/Version**: TypeScript
**Primary Dependencies**: `@visactor/vscale` (LinearScale)
**Target Platform**: Web/Mobile (VChart standard)
**Performance Goals**: Negligible impact.
**Constraints**: Must work within existing VChart axis architecture.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Quality First**: Comprehensive unit tests.
- [x] **UX Driven**: Simple configuration.
- [x] **SDD**: Following the Spec-Plan-Task process.
- [x] **Monorepo**: Changes localized to `packages/vchart`.
- [x] **TypeScript**: Strict typing.

## Project Structure

### Documentation (this feature)

```text
specs/003-area-enlargement/
├── plan.md              # This file
├── research.md          # Implementation decisions
├── data-model.md        # Scale Spec definitions
└── tasks.md             # Implementation tasks
```

### Source Code (packages/vchart)

```text
packages/vchart/src/
├── component/
│   └── axis/
│       ├── cartesian/
│       │   └── linear-axis.ts        # Update: Calculate piecewise range
│       ├── mixin/
│       │   └── linear-axis-mixin.ts  # Update: Calculate piecewise domain
│       └── interface/
│           └── spec.ts               # Update: Add customDistribution to spec
└── typings/
    └── scale.ts                      # Update: Add IIntervalRatio
```

**Structure Decision**: No new scale class. Modify existing Axis components to utilize `LinearScale`'s piecewise capabilities.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Piecewise Domain/Range logic in Axis | To support non-uniform scaling | Creating a custom scale class was rejected as LinearScale already supports this. |

## Phase 1: Design

### Data Model

See `data-model.md` for `customDistribution` definition.
