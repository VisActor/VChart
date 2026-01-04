# 工具适配与回退策略

## 映射
- gh-cli: 使用 GitHub CLI 创建 PR、管理 Issue 等。
- github-rest: 使用 REST API（读取环境变量 GITHUB_TOKEN）。
- git-cli: 执行 rev-parse、status、add/commit/push、diff 等。
- rush-cli: 执行测试与覆盖率；无 rush 时回退 npm/yarn。
- jest-cli: 测试运行器；可由框架插件替换。

## 回退
- PR 创建：优先 gh-cli；不可用则使用 github-rest；均不可用则返回明确错误。
- 覆盖率运行：无 rush 时改用 npm/yarn 脚本。
- 差异采集：无 git 时直接失败并返回环境提示。

