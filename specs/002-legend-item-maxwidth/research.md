# Research: Legend Item MaxWidth with Pager

## Problem
When a discrete legend has a pager, the available width for legend items is reduced by the pager's width. However, currently, the `maxWidth` of legend items (when specified as a percentage) is calculated based on the *total* legend width (`rect.width`), ignoring the pager. This causes items to potentially overlap the pager or exceed the visual bounds.

## Analysis
The calculation happens in `packages/vchart/src/component/legend/discrete/util.ts`:
```typescript
if (isPercent(item.maxWidth)) {
  item.maxWidth = (Number(item.maxWidth.substring(0, item.maxWidth.length - 1)) * rect.width) / 100;
}
```
Here `rect.width` is the full width allocated to the legend component.

## Solution Options

### Option 1: Pass Percentage to Underlying Component (Preferred)
If `@visactor/vrender-components` supports percentage `maxWidth` for legend items, we should pass the string directly (e.g., "50%") instead of resolving it to pixels in VChart. The component can then resolve it relative to the *content* width (excluding pager).

**Pros**:
- Cleanest solution.
- Dynamic adaptation if pager appears/disappears.

**Cons**:
- Depends on `vrender-components` support.

### Option 2: Subtract Pager Width
Estimate or calculate pager width and subtract it from `rect.width` before resolving percentage.

**Pros**:
- Works if component requires pixel values.

**Cons**:
- Pager width is not easily available in `util.ts`.
- Pager visibility is dynamic (depends on layout overflow), creating a circular dependency.

## Decision
We will attempt **Option 1**. We will modify `getLegendAttributes` to stop resolving percentage `maxWidth`.

## Verification
We need to verify if `vrender-components` handles percentage strings for `item.maxWidth`.
If not, we might need to update `vrender-components` or fallback to Option 2 (with complexity).

## Fallback Plan
If percentage strings are not supported, compute `availableWidth = rect.width - pagerWidth` in the legend layout stage and resolve `item.maxWidth` against `availableWidth`, ensuring pager width is excluded.
