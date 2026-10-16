# 发布期间保留 workspace 构建产物

用户在确认 Release CI #409 的根因后要求修复发布脚本。

## 问题与设计

VChart 发布成功后通过 `postpublish` 删除 `esm`、`cjs`、`build`。随后 StatPlots 的 `prepack` 调用标准构建，workspace 依赖仍指向本地 VChart，因类型入口已删除而失败。

移除 VChart 的 `postpublish` 清理钩子，保留显式 `clear` 命令。CI runner 会在任务结束后回收工作区，不新增延迟清理步骤。保留 StatPlots 的 `prepack`，确保普通 `npm pack` 仍生成 Schema 和校验器。相比调整发布顺序或删除 `prepack`，此方案直接修复依赖产物生命周期，不依赖包名顺序，也不削弱独立打包契约。

部分发布检查继续拒绝自动补发，避免把不同提交构建的包混入同一个版本。为已有部分发布补充受控恢复说明，本次不执行 npm 发布。

## 验收

- Node.js 22 下，在临时 workspace 中执行 VChart 的实际 npm 发布生命周期（dry-run），随后通过 StatPlots 的实际 `prepack` 入口执行依赖类型编译和打包，检查构建入口仍可用。
- 临时恢复旧清理钩子时，回归必须因缺失依赖而失败。
- 在 release workflow 上传第一个包之前执行回归；既有 workflow 校验通过。
- 本次不改渲染代码，不需要视觉回归；不创建 PR，不触发线上发布。
