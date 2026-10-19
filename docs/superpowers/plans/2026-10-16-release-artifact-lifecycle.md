# 发布构建产物生命周期修复实施计划

> 在当前会话内执行并逐项验证，沿用用户已经确认的故障分析和修复方向。

**Goal:** VChart 发布后，后续包的构建仍可解析本地 workspace 依赖。

**Architecture:** 删除单包发布后的自动产物清理；保留标准构建与打包入口。用临时 workspace 的真实 npm 生命周期回归覆盖依赖解析失败，并接入发布前验证。

**Tech Stack:** Node.js 22、npm、TypeScript、GitHub Actions。

## 约束

- 保留 StatPlots `prepack` 和显式 `clear`。
- 保留现有部分发布拦截。
- 不执行真实发布，不修改工作区构建产物。

## 实施与验证

- [x] 新增 `common/scripts/release-artifact-lifecycle.test.cjs`：复制两个包的 manifest 到临时目录，以最小类型依赖隔离本次问题；VChart `npm publish --dry-run` 后，StatPlots `npm pack` 的 `prepack` 必须成功。
- [x] 在修复前运行该回归，确认清理导致类型入口丢失。
- [x] 删除 `packages/vchart/package.json` 中的 `postpublish`。
- [x] 在 `.github/workflows/release.yml` 的 Rush 安装后执行回归；在既有 `verify-release-workflows.js` 中约束该验证位于发布前。
- [x] 编写 `common/scripts/README.release.md`：说明生命周期契约、验证命令与部分发布恢复边界。
- [x] Node.js 22 下运行回归、workflow 检查和必要的实际 StatPlots 编译；审查 diff，记录结果。

## 验证记录

- Node.js 22.23.3 + npm 10.9.9：修复前回归因后续打包的 TS2307 失败；修复后通过。
- Node.js 22.23.3 + npm 11.17.0：回归通过；仅在独立测试进程中重新注入旧 `postpublish`，回归按预期因 TS2307 失败，未改动工作区文件。
- 实际 `npm run compile --prefix packages/vchart-statplots`：Schema 和 standalone 校验器生成、`tsc --noEmit` 均通过。
- `verify-release-workflows.js` 通过；本地通过 `NODE_PATH=common/temp/node_modules/.pnpm/node_modules` 使用已安装的 js-yaml，未安装新依赖。
- `git diff --check` 通过；未修改渲染实现，未运行视觉回归或触发线上发布。
