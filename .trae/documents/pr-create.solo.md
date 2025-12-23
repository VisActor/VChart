# PR 创建 Job（Solo 使用说明）

- 入口文件：`./.trae/jobs/pr-create.md`
- 作用：依据仓库 PR 模版生成正文并创建 PR

## 参数
- `base`：默认 `develop`
- `head`：可选；未提供时自动推导当前分支
- `title`：必填；PR 标题
- `lang`：`zh|en`，默认 `zh`
- `labels`：可选标签数组
- `draft`：是否草稿，默认 `false`
- `useGhCli`：是否使用 `gh` 创建，默认 `true`
- `mode`：`auto|gh|rest|browser`（默认 `auto`，优先浏览器免安装）
- `localBodyFile`：是否生成本地可复制正文文件（默认 `false`）
- `openBrowser`：是否自动打开 compare URL（默认 `true`）
- `commitBeforeCreate`：创建 PR 前是否自动提交未提交变更（默认 `false`）
- `commitMessage`：自动提交的 commit 消息（默认 `chore: auto commit before pr`）
- `commitAllowEmpty`：是否允许空提交（默认 `false`）
- `pushAfterCommit`：提交后是否自动推送当前分支（默认 `true`）
- `commitMessageStrategy`：提交信息生成策略（`auto|topic|manual`，默认 `auto`）
  - `auto`：按变更内容自动判定类型（`docs|test|chore`）、作用域（包名或顶层目录），主题取 `message` 首行或自动摘要
  - `topic`：主题优先使用 `title`/外层 `topic`
  - `manual`：使用 `commitMessage`

## 前置（登录/令牌）
- 优先方案：使用 GitHub CLI（`gh`）并已登录 → 不需要额外令牌
- 备选方案：无 `gh` 时提供 `GITHUB_TOKEN`（参见 `./.trae/github-token.local.md`）
- 兜底方案：生成浏览器 compare URL，使用你浏览器的登录态手动创建 PR

## 使用（Solo）
- 在聊天中发起：“执行 PR Job（.trae/jobs/pr-create.md）”，并传：
  - `title: '[Auto] feature-legend'`
  - （可选）`head: chore/trae-feature-legend-20251222-1030`
  - （可选）`mode: auto|gh|rest|browser`（默认 `auto`）
  - （可选）`localBodyFile: true|false`（默认 `false`）
  - （可选）`openBrowser: true|false`（默认 `true`）
  - （可选）`commitBeforeCreate: true`、`commitMessage: 'chore: auto commit before pr'`、`pushAfterCommit: true`
  - （可选）`commitMessageStrategy: auto`

## 正文准备
- 若 `message` 已包含摘要与关联信息，可直接作为 body
- 若需要补充，请先人工完善 body 文本，再执行创建（不生成临时文件）

## 输出
- `pr_url`：创建的 PR 链接（`gh/rest`）
- `compare_url`：浏览器 compare 页面（`browser`）
- `generated_title`：建议标题（便于复制）
- `generated_body_preview`：建议正文（便于复制）

## 人工检查
- 提交前检查标题、关联链接与 Changelog 摘要是否完整
