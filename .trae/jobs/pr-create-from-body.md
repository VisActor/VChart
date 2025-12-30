---
job: pr-create-from-body
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
  mode: auto
  localBodyFile: true
  bodyFile: ''
  commitBeforeCreate: false
  commitMessage: ''
  commitAllowEmpty: false
  pushAfterCommit: true
  commitMessageStrategy: auto
required_parameters:
  - title
inputs:
  autotestReport: .trae/output/autotest.report.local.md
outputs:
  - pr_url
success_criteria:
  - pr_created
---

# 使用本地/提供的正文创建 PR

## 参数检查

- 必填参数：`title`
- 正文来源仅支持文件：`bodyFile` → 默认本地 `./.trae/output/pr.body.local.md`（当 `localBodyFile==true`）

## 步骤

1. 前置与正文确定

- 推导 `head`：`git rev-parse --abbrev-ref HEAD`
- 确认正文来源：读取 `bodyFile` 或默认文件；若均不可用或正文为空，则失败并提示先执行正文生成 Job
- 使用正文时按“原样传递”，不进行包裹、注释或追加任何提示文本

2. 可选自动提交与推送

- 检查工作树：`git status --porcelain`
- 当 `commitBeforeCreate == true` 且存在未提交变更：按 `commitMessageStrategy` 生成提交信息，执行提交；当 `pushAfterCommit == true` 推送当前分支

3. 创建 PR（模式）

- `auto`：优先 `GITHUB_TOKEN` 的 REST；其次 `gh`（本机已安装并登录）；否则失败并提示令牌或 CLI 不可用
- `gh`：`gh pr create --base {{base}} --title "{{title}}" --head {{head}} {{#labels}}--label {{labels}}{{/labels}} {{#draft}}--draft{{/draft}}`；正文优先 `--body-file {{bodyFile}}`，若不支持则读取文件内容传 `--body "..."`
- `rest`：`POST /repos/{owner}/{repo}/pulls`，body 使用正文文本
  

4. 输出

- 成功：输出 `pr_url`
- 失败：输出错误信息，不展示 compare URL
