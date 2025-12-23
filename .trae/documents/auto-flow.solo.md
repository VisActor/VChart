# Auto Flow（串行编排）Solo 使用说明

- 入口文件：`./.trae/jobs/auto-flow.md`
- 流程：分支预检查 → 自动化测试 → Rush 变更日志 → 创建 PR

## 参数
- `baseBranch`：默认 `develop`
- `lang`：`zh|en`，默认 `zh`
- `labels`：默认 `[changelog, test]`
- `topic`：可选；用于 PR 标题优化（未提供时用当前分支名）
- `message`：可选；作为 PR body 摘要
- `bumpType`：默认 `auto`
- `notCommit`：默认 `true`
- `head`：可选；未提供时自动推导当前分支

## 前置
- 若需自动创建 PR 或聚合 Issue 标题，请先设置 `GITHUB_TOKEN`（参考 `./.trae/github-token.local.md`）

## 使用（Solo）
- 在聊天中发起：“执行 Auto Flow（.trae/jobs/auto-flow.md）”，可附加：
  - `topic: feature-legend`
  - `message: 'docs: chore(trae): add auto-flow'`
  - `mode: browser`（默认以浏览器创建 PR，输出可复制内容与 compare URL）
  - （可选）`openBrowser: true`（自动打开浏览器）

## 输出
- `autotest_report`：`./.trae/jobs/autotest.report.local.md`
- `rush_change_entries`：`common/changes/**`
- `pr_url`：PR 链接（若已创建）

## 人工检查
- 单测后检查报告与覆盖率摘要
- 变更日志后检查 `common/changes/**`
- PR 前检查标题与正文信息；如需补充 body，请人工完善后再创建
