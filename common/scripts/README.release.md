# 发布脚本维护

## 构建产物生命周期

Rush 将内部依赖链接到本地 workspace。整批发布完成前，每个包的 `esm`、`cjs`、`build` 必须保持可用：后续包的 `prepack` 可能仍需要这些产物及类型声明。

不要在单包 `postpublish` 中清理构建目录。CI 工作区在任务结束后回收；本地需要清理时，在整批操作完成后显式执行 `npm run clear --prefix packages/vchart`。

StatPlots 的 `prepack` 调用标准构建，生成 Schema 和 standalone 校验器，普通 `npm pack` 也依赖这个入口，不应为绕过发布错误而移除。

安装 Rush 依赖后，使用 Node.js 22 在仓库根目录执行：

```sh
node --test common/scripts/release-artifact-lifecycle.test.cjs
```

该回归在临时 workspace 中复制两个包的实际入口和生命周期脚本，用最小类型依赖代替完整图表构建：先证明编译可用，再执行 VChart `npm publish --dry-run` 和 StatPlots `npm pack`，检查后续 `prepack` 能继续编译，并确认 VChart 产物未被删除。registry 固定为本地不可用端口，测试不会上传 npm，也不会删除当前工作区产物。Release CI 在首次发布前执行此回归。

## 部分发布恢复

Release CI 对 `rush.json` 中全部 `shouldPublish` 包检查目标版本。全部缺失时正常发布，全部存在时跳过发布；部分存在时停止并列出已有和缺失的包。网络或认证错误应单独排查，不能据此认定版本缺失。

修复代码后直接重跑旧 run 会使用旧提交；从修复后的分支启动新 run，仍会被部分发布检查拦截。应先完成一次受控恢复，再回到正常流程：

1. 记录失败 run 的 SHA、目标版本和已发布包清单。恢复检出必须基于该 SHA，只合入发布流程修复；确认已发布包对应的源码、依赖和构建配置没有变化。
2. 按原 run 的版本准备步骤将所有发布包设置为相同目标版本，并在干净的 Node.js 22 环境安装、重建原流程中的所有包；不要复用失败后被清理过的目录。
3. 在具备发布权限的受控环境中，运行相同的 `node common/scripts/install-run-rush.js publish --publish --include-all --tag latest`。当前固定的 Rush 5.148.0 会逐包查询版本并跳过已有版本，仅补发缺失包；不要加 `--force`。hotfix 和预发布应使用原流程中的 tag。
4. 重新核对每个发布包的目标版本及内部依赖版本均存在，再从恢复分支运行 Release CI。全部存在时会跳过上传，继续更新锁文件、提交版本文件和创建 release PR。

这里的恢复需要维护者核对版本内容；正常 CI 不自动放行部分发布，也不把线上发布作为本地验证的一部分。
