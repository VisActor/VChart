# 发布脚本维护

## 构建产物生命周期

Rush 将内部依赖链接到本地 workspace。整批发布完成前，每个包的 `esm`、`cjs`、`build` 必须保持可用：后续包的 `prepack` 可能仍需要这些产物及类型声明。

不要在单包 `postpublish` 中清理构建目录。CI 工作区在任务结束后回收；本地需要清理时，在整批操作完成后显式执行 `npm run clear --prefix packages/vchart`。

StatPlots 的 `prepack` 调用标准构建，生成 Schema 和 standalone 校验器，普通 `npm pack` 也依赖这个入口，不应为绕过发布错误而移除。

安装 Rush 依赖后，使用 Node.js 22 在仓库根目录执行：

```sh
node --test common/scripts/release-artifact-lifecycle.test.cjs
node --test common/scripts/check-npm-release.test.cjs
```

该回归在临时 workspace 中复制两个包的实际入口和生命周期脚本，用最小类型依赖代替完整图表构建：先证明编译可用，再执行 VChart `npm publish --dry-run` 和 StatPlots `npm pack`，检查后续 `prepack` 能继续编译，并确认 VChart 产物未被删除。registry 固定为本地不可用端口，测试不会上传 npm，也不会删除当前工作区产物。Release CI 在首次发布前执行此回归。

## 部分发布恢复

Release CI 通过统一脚本 `check-npm-release.js` 检查 `rush.json` 中全部 `shouldPublish` 包，先校验各包本地版本与目标版本一致。全部缺失时正常发布，全部存在时跳过发布；部分存在时默认停止并列出已有和缺失的包。仅 npm 明确返回 E404 才视为缺失；网络、认证、限流和无效响应均直接终止检查。

`workflow_dispatch` 提供布尔选项 `resume_partial_publish`，默认关闭。只有手动事件并显式启用该选项，才允许部分发布继续；自动 push 即使设置同名环境变量也不放行。修复代码后直接重跑旧 run 会使用旧提交，应使用包含修复的新提交启动手动恢复：

1. 记录失败 run 的 SHA、目标版本和已发布包清单。恢复分支必须基于该 SHA，只合入发布流程修复；确认已发布包对应的源码、依赖和构建配置没有变化。
2. 推送恢复分支后，在 Release CI 的 Run workflow 中选择该 `release/*`、`hotfix/*` 或 `pre-release/*` 分支，显式勾选 `resume_partial_publish`。例如恢复本次版本可运行：

   ```sh
   gh workflow run release.yml --ref release/2.2.0 -F resume_partial_publish=true
   ```

3. Workflow 沿用版本准备和干净构建步骤，运行现有 `rush publish --publish --include-all`。当前固定的 Rush 5.148.0 会逐包查询版本并跳过已有版本，仅补发缺失包；不使用 `--force`，tag 沿用原 stable/hotfix/预发布流程。
4. 发布成功后继续既有版本文件提交与 release PR 流程。若发布途中再次失败，检查失败原因后按相同方式恢复；全部版本已经存在时会跳过上传。

恢复输入代表维护者已经核对版本内容，并不自动证明已发布包与当前源码一致。日常 push 和默认手动运行继续保留部分发布拦截；本地回归只执行查询替身，不上传 npm。
