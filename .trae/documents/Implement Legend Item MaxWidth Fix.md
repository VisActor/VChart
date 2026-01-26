# Implementation Plan: Legend Item MaxWidth Fix

## 1. Summary

The `maxWidth` of discrete legend items is currently calculated based on the total container width, ignoring the pager when it's present. This leads to items overlapping the pager. The fix involves updating the attribute transformation logic to **not** resolve percentage `maxWidth` values in VChart, but instead pass them as strings to `@visactor/vrender-components`, which correctly handles layout relative to the content area (excluding the pager).

## 2. Technical Implementation

### Core Logic

* **File**: `packages/vchart/src/component/legend/discrete/util.ts`

* **Function**: `getLegendAttributes`

* **Change**: Remove the logic that calculates `item.maxWidth` if it is a percentage string. Let the string pass through to the component attributes.

### Data Model

* **Input**: `item.maxWidth` in `IDiscreteLegendSpec` can be a number or a percentage string (e.g., `'50%'`).

* **Output**: `maxWidth` in `DiscreteLegendAttrs` passed to `vrender-components` will now support string type (percentage).

### Testing

* **Unit Tests**: Add a test case in `packages/vchart/__tests__/unit/component/legend/discrete/legend.test.ts` (or create if missing) to verify that `getLegendAttributes` returns the percentage string for `maxWidth` instead of a calculated number.

## 3. Verification Plan

* **Visual Verification**: Create a chart with a discrete legend that triggers pagination. Set `maxWidth` to `'50%'` (or similar). Verify that items do not overlap the pager.

* **Automated Tests**: Unit tests to ensure the attribute is passed correctly.

## 4. Next Steps

* Create tasks using `speckit.tasks`.

* Implement changes in `util.ts`.

* Verify with unit tests and manual check.

