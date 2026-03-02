# 优化坐标轴 Breaks 和 CustomDistribution 逻辑

## Why
目前的 `breaks` 和 `customDistribution` 是两套独立的逻辑，虽然都用于控制坐标轴的分布，但缺乏统一性。`customDistribution` 功能更通用，应该能够包含 `breaks` 的场景。通过将 `breaks` 转化为 `customDistribution`，可以简化代码逻辑，并明确两者的优先级关系。

## What Changes
1.  **优先级调整**：明确 `customDistribution` 的优先级高于 `breaks`。当用户配置了 `customDistribution` 时，忽略 `breaks` 配置。
2.  **统一实现**：不再独立处理 `breaks` 的逻辑，而是将其转换为 `customDistribution` 的配置（`domain` 和 `ratio`），复用 `customDistribution` 的处理流程。
3.  **代码重构**：
    -   在 `linear-axis-mixin.ts` 的 `computeLinearDomain` 方法中，如果存在 `breaks` 且无 `customDistribution`，则调用 `breakData` 计算分段，并将结果转换为 `customDistribution` 格式。
    -   在 `linear-axis.ts` 的 `getNewScaleRange` 方法中，移除独立的 `breaks` 处理逻辑，完全依赖 `customDistribution`。

## Impact
-   **Affected Specs**: `IAxis` 接口虽然不变，但在运行时 `breaks` 的表现将通过 `customDistribution` 实现。
-   **Affected Code**:
    -   `packages/vchart/src/component/axis/mixin/linear-axis-mixin.ts`
    -   `packages/vchart/src/component/axis/cartesian/linear-axis.ts`
-   **Breaking Changes**: 无。对于仅使用 `breaks` 的用户，表现应保持一致。对于同时配置了 `breaks` 和 `customDistribution` 的用户，现在明确以 `customDistribution` 为准（此前行为可能未定义或混合）。

## ADDED Requirements
### Requirement: CustomDistribution Priority
系统 SHALL 优先使用 `customDistribution` 配置。

#### Scenario: Both Configured
- **WHEN** 用户同时配置了 `breaks` 和 `customDistribution`
- **THEN** 系统忽略 `breaks` 配置，仅应用 `customDistribution`。

### Requirement: Breaks as CustomDistribution
系统 SHALL 将 `breaks` 配置转换为 `customDistribution` 配置。

#### Scenario: Only Breaks Configured
- **WHEN** 用户仅配置了 `breaks`
- **THEN** 系统计算断点分段，生成对应的 `domain` 和 `ratio`，并应用 `customDistribution` 逻辑。

## MODIFIED Requirements
### Requirement: Linear Domain Computation
修改 `computeLinearDomain` 方法，整合 `breaks` 到 `customDistribution` 的转换逻辑。

### Requirement: Scale Range Computation
修改 `getNewScaleRange` 方法，移除对 `breaks` 的独立处理。
