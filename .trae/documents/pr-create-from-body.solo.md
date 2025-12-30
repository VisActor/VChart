# 使用正文创建 PR Job（Solo 使用说明）

- 入口文件：`./.trae/jobs/pr-create-from-body.md`
- 作用：读取经过人工确认的正文（仅本地文件），创建 GitHub PR（支持 REST/gh）

## 参数
- `base`：默认 `develop`
- `head`：可选；未提供时自动推导当前分支
- `title`：必填；PR 标题
- `lang`：`zh|en`，默认 `zh`
- `labels`：可选标签数组
- `draft`：是否草稿，默认 `false`
- `useGhCli`：是否使用 `gh` 创建，默认 `true`
- `mode`：`auto|rest|gh`（默认 `auto`，优先 REST）
- `localBodyFile`：是否从默认路径读取正文（默认 `true`）
- `bodyFile`：正文文件路径（优先使用）
- `commitBeforeCreate`：创建前是否自动提交未提交变更（默认 `false`）
- `commitMessage`：自动提交的 commit 消息（默认空）
- `commitAllowEmpty`：是否允许空提交（默认 `false`）
- `pushAfterCommit`：提交后是否自动推送当前分支（默认 `true`）
- `commitMessageStrategy`：提交信息生成策略（`auto|topic|manual`，默认 `auto`）

## 前置（登录/令牌）
- 优先方案：提供 `GITHUB_TOKEN`（参见 `./.trae/documents/github-token-local.md`）
- 备选方案：本机已登录 GitHub CLI（`gh`）（参见 `./.trae/documents/github-gh-local.md`）

## 使用（Solo）
- 在聊天中发起：“执行 PR Create Job（.trae/jobs/pr-create-from-body.md）”，参数示例：
  - `title: 'feat(legend): add auto layout'`
  - `base: develop`
  - （可选）`head: chore/trae-feature-legend-20251222-1030`
  - `mode: auto`
  - `localBodyFile: true` 或 `bodyFile: './.trae/output/pr.body.local.md'`
  - （可选）`labels: ['feature', 'legend']`
  - （可选）`draft: false`
  - （可选）`commitBeforeCreate: true`、`commitMessageStrategy: auto`

## 输出
- `pr_url`：创建的 PR 链接（`rest/gh`）

## 人工检查
- 提交前确认 `title`、`head` 与正文是否与预期一致
