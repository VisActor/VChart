# Feature Specification: Area Enlargement Line Chart

**Feature Branch**: `003-area-enlargement`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "实现这个线性区间可以分配的需求 https://github.com/VisActor/VChart/issues/4413"

## User Scenarios & Testing

### User Story 1 - Focus on Specific Data Range (Priority: P1)

As a data analyst, I want to expand the visual space of a specific data range (e.g., 7-9) on the Y-axis while keeping the rest of the axis (0-6, 9-10) visible but compressed, so that I can analyze the subtle fluctuations in the important range without losing the global context.

**Why this priority**: This is the core requirement of the feature. Users need to highlight specific data intervals.

**Independent Test**:
- Create a line chart with data in range 0-10.
- Configure the axis to expand the 7-9 range.
- Verify that the visual height of 7-9 is significantly larger than 0-6 and 9-10.

**Acceptance Scenarios**:

1. **Given** a line chart with Y-axis domain [0, 10], **When** I configure the scale to allocate 50% of the range to [7, 9], **Then** the visual segment for [7, 9] occupies half the axis height.
2. **Given** the same chart, **When** I render it, **Then** the axis ticks are correctly positioned (ticks in 7-9 are more spaced out visually than in 0-6).

---

### User Story 2 - Multiple Intervals (Priority: P2)

As a user, I want to define multiple custom intervals with different visual weights, so that I can handle complex distribution requirements.

**Why this priority**: Provides flexibility for more complex data patterns.

**Independent Test**: Configure 3+ intervals with different weights and verify rendering.

**Acceptance Scenarios**:

1. **Given** a chart with domain [0, 100], **When** I define 3 intervals with ratio 1:2:1, **Then** the axis is divided visually according to these ratios.

---

### Edge Cases

- **Domain Mismatch**: What happens if the defined intervals do not cover the entire domain? (Assumption: The scale should auto-fill or throw a warning, or the intervals define the whole domain).
- **Overlapping Intervals**: How does the system handle overlapping interval definitions? (Assumption: Should be disallowed or priority defined).
- **Zero Range**: What if an interval has 0 weight? (Assumption: It should be hidden or have minimal visibility).

## Requirements

### Functional Requirements

- **FR-001**: The system MUST support a new scale capability (or new scale type) to map continuous domain intervals to specific range proportions.
- **FR-002**: Users MUST be able to define the distribution of the domain via a configuration (e.g., `linearDistribution` or similar) in the axis/scale spec.
- **FR-003**: The scale MUST strictly respect the configured mapping for coordinate conversion (data -> position).
- **FR-004**: The scale MUST correctly support `invert` (position -> data) for interaction (tooltip, etc.).
- **FR-005**: Axis ticks generation MUST adapt to the non-uniform scale (ticks should be generated based on the value, not just visual spacing, or adapted to show more density in expanded areas).

### Key Entities

- **LinearIntervalScale**: A new or extended scale class that handles the piecewise linear mapping.
- **ScaleSpec**: The configuration interface extending the standard linear scale spec.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can configure a chart where a 20% domain interval (e.g., 7-9 in 0-10) occupies at least 50% of the visual range.
- **SC-002**: Tooltip interaction works correctly (hovering over the expanded area shows correct data values).
- **SC-003**: Ticks are rendered without overlapping and reflect the scale distortion.
