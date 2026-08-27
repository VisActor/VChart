# Research: Area Enlargement Implementation

**Date**: 2026-02-02
**Feature**: Area Enlargement Line Chart
**Status**: Completed

## Decisions

### 1. Implementation Strategy: Custom Scale Class

**Decision**: Implement a new `LinearIntervalScale` class within VChart (`packages/vchart/src/scale/linear-interval-scale.ts`) instead of modifying `@visactor/vscale`.

**Rationale**:
- `@visactor/vscale` is an external dependency. Modifying it requires a separate release cycle and might not be feasible if I don't have write access or if it's a shared library.
- A custom scale in VChart allows rapid iteration and specific logic for this feature.
- The scale will implement the necessary interface to be used by `CartesianLinearAxis`.

**Alternatives Considered**:
- **Modify `LinearAxisMixin`**: Implement the mapping logic directly in the axis.
    - *Pros*: No new scale class.
    - *Cons*: Axis logic is already complex. Coupling scale logic into axis makes it harder to reuse (e.g., for legends or other components).
- **Subclass `LinearScale`**:
    - *Pros*: Inherit existing methods.
    - *Cons*: `LinearScale` might have private members or strict behavior that is hard to override for piecewise logic. Composition (implementing interface and delegating if needed) is safer.

### 2. Configuration API

**Decision**: Add `customDistribution` (or similar) to the scale spec.

**Schema**:
```typescript
interface ILinearIntervalScaleSpec extends ILinearScaleSpec {
  type: 'linear-interval'; // or keep 'linear' and check for distribution? Better to use explicit type.
  intervals: {
    domain: [number, number]; // Sub-domain
    range: [number, number];  // Proportion of the visual range (0-1)
  }[];
}
```

**Rationale**: Explicit mapping of domain intervals to range proportions gives full control.

### 3. Axis Integration

**Decision**: Update `CartesianLinearAxis` to support `linear-interval` scale type.

**Rationale**: The axis component checks for `type`. We need to register the new scale and ensure the axis accepts it.

## Open Questions

- **Ticks Generation**: `LinearScale.ticks()` returns uniformly spaced ticks. `LinearIntervalScale.ticks()` needs to return ticks that are appropriate for each interval.
    - *Solution*: The scale will iterate over intervals and generate ticks for each, then combine them.
