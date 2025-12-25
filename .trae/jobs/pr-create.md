---
job: create-pr
intent: github-pr
version: v1
domain: github
runner: trae-solo
parameters:
  base: develop
  head: ''
  title: ''
  lang: zh
  labels: []
  draft: false
  useGhCli: true
  mode: browser # auto|gh|rest|browser（交互默认 browser ）
  localBodyFile: true
  openBrowser: true
  commitBeforeCreate: false
  commitMessage: ''
  commitAllowEmpty: false
  pushAfterCommit: true
  commitMessageStrategy: auto # auto|topic|manual
  interactive: true
required_parameters:
  - title
inputs:
  autotestReport: .trae/output/autotest.report.local.md
  rushChangesDir: common/changes
  bumpType: ''
  message: ''
outputs:
  - pr_url
  - compare_url
  - generated_title
  - generated_body_preview
success_criteria:
  - pr_created
---

# PR Job（根据模版创建 Pull Request）

## 参数检查

- 必填参数：`title`
- 分支参数 `head` 可选：若未提供，将在执行阶段通过 `git rev-parse --abbrev-ref HEAD` 推导当前分支

## 步骤（交互默认）

1. 提交未提交的变更并推送（可选）

- 获取 `head`：若未提供，通过 `git rev-parse --abbrev-ref HEAD` 推导
- 检查工作树：`git status --porcelain`
- 若存在未提交变更且 `commitBeforeCreate == true`：
  - 运行 `git add --all`
  - 生成提交信息（按 `commitMessageStrategy`）：
    - `auto`：
      - 类型判定：包含 `docs/` → `docs`；包含 `__tests__`/`*.test.*` → `test`；否则 → `chore`
      - 作用域：变更路径为 `packages/<name>/...` 时取 `<name>`；否则取顶层目录（如 `docs`、`tools`、`common`、`.trae`）
      - 主题：若提供 `message` 则使用其首行摘要；否则生成 `sync changes before PR (<N> files)` 并附加关键作用域
      - 结果示例：`chore(vchart,tools): sync changes before PR (5 files)`
    - `topic`：使用 `title` 或外层 `topic` 作为主题，类型与作用域同上
    - `manual`：使用显式 `commitMessage`
  - 运行 `git commit {{#commitAllowEmpty}}--allow-empty{{/commitAllowEmpty}} -m "{{<auto_generated_message>}}"`
  - 若 `pushAfterCommit == true`：运行 `git push -u origin {{head}}`
- 人工检查点：
  - 若存在未提交变更但未开启自动提交，请先人工完成提交与推送再继续创建 PR

2. 选择 PR 模版

- 当 `{{lang}} == zh`：使用 `.github/PULL_REQUEST_TEMPLATE/pr_cn.md`
- 否则使用 `.github/PULL_REQUEST_TEMPLATE.md`

3. 准备正文

- 若已提供完整 `message`（摘要）与必要信息（关联链接等），可直接使用作为 PR body
- 若需要补充人工内容：提示用户完善 body 文本后再继续（不生成临时文件）

- 生成可复制内容：
- `generated_title = [Auto] {{title || (topic || head)}}`
- 生成完整 PR 正文预览（Markdown 代码块），基于 `.github/PULL_REQUEST_TEMPLATE/pr_cn.md` 自动填充：
  - 勾选项：`{{branch_type_checks}}`（如：新功能、Workflow 等）
  - 关联：`{{issue_links}}`、`{{related_pr_links}}`、`{{bugserver_ids}}`
  - 背景与方案：`{{background_solution}}`（从 `message` 与上下文生成）
  - Changelog 表：`{{changelog_en}}` 与 `{{changelog_zh}}`（解析 `common/changes/**`）
  - 自测勾选项：`{{self_check_items}}`
  - Summary 与 Walkthrough：`{{summary_text}}`、`{{walkthrough_text}}`（包含分支、模板来源、测试摘要）
- 代码块示例结构：

  ```markdown
  ### 🤔 这个分支是...

  - [x] 新功能
  - [x] Workflow

  ### 🔗 相关 issue 链接

  {{issue_links}}

  ### 🔗 相关的 PR 链接

  {{related_pr_links}}

  ### 🐞 Bugserver 用例 id

  {{bugserver_ids}}

  ### 💡 问题的背景&解决方案

  {{background_solution}}

  ### 📝 Changelog

  | Language   | Changelog        |
  | ---------- | ---------------- |
  | 🇺🇸 English | {{changelog_en}} |
  | 🇨🇳 Chinese | {{changelog_zh}} |

  ### ☑️ 自测

  {{self_check_items}}

  ---

  ### 🚀 Summary

  {{summary_text}}

  ### 🔍 Walkthrough

  {{walkthrough_text}}
  ```

- 若 `localBodyFile=true`：以完整代码块形式写入 `./.trae/output/pr.body.local.md`（被忽略提交）
- 当 `interactive==true`：强制 `mode=browser` 并写入本地正文，暂停等待人工在页面完成提交

4. 人工检查点

- 若 body 需要补充，请人工完成后继续（不生成临时文件）

5. 创建 PR

- 模式选择：

  - `auto`：优先使用 `gh`（若已安装并登录）；其次使用 `GITHUB_TOKEN` 的 REST；最后提供浏览器 URL 手动创建
  - `gh`：使用 GitHub CLI 创建（需本机已登录）
  - `rest`：使用 `GITHUB_TOKEN` 调用 REST API 创建
  - `browser`：生成 compare URL，打开浏览器页面手动确认

- 检测与执行：
  - 当 `interactive==true`：跳过 `gh` 与 REST，直接生成 `compare_url`，并打开浏览器；输出 `generated_title` 与本地正文预览供复制

6. 结果

- 返回 `pr_url`，并在成功标准中标记为 `pr_created`
- 在 `browser` 模式：返回 `compare_url`、`generated_title` 与完整的 `generated_body_preview`
  （其中 `generated_body_preview` 为包含所有模板栏目且已自动填充的 Markdown 代码块）

## 额外提示

- 自动创建 PR 有三种方式：
  - 本机已登录 `gh`：无需额外令牌（SSH 仅用于 git 操作，API 权限由 `gh` 登录提供）
  - 本机无 `gh`：提供 `GITHUB_TOKEN` 用 REST API 创建
  - 两者都不可用：生成 compare URL，使用浏览器登录后手动创建
