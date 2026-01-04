## 概述
- 技能：github.create-pr-from-file（使用本地或指定正文文件创建 PR）
- 作用：从文件读取 PR 正文，使用 gh 或 REST 创建 PR

## 参数
- base（string，默认 develop）：目标基线分支
- head（string，默认 ''）：来源分支；为空自动推导当前分支
- title（string，必填）：PR 标题
- labels（array，默认 []）：标签列表
- draft（boolean，默认 false）：是否草稿
- mode（enum: auto|gh|rest，默认 auto）：创建方式
- localBodyFile（boolean，默认 true）：是否使用默认正文路径
- bodyFile（string，默认 ./.trae/output/pr.body.local.md）：正文文件路径
- commitBeforeCreate（boolean，默认 false）：创建前是否自动提交
- commitMessage/commitAllowEmpty/pushAfterCommit/commitMessageStrategy：提交相关配置

## 输出
- pr_url：创建成功后的 PR 链接

## 成功标准
- pr_created：接口或 CLI 返回成功，拿到链接

## 失败案例与指引
- 正文为空或文件不存在：先执行 PR 正文生成技能或提供有效 bodyFile
- REST 403：参考 GitHub Token 文档，检查 Fine‑grained 权限与组织 SSO 授权
  - 文档参考：[github-token-local.md](file:///Users/bytedance/Documents/GitHub/VChart/.trae/documents/github-token-local.md)
- gh 未登录或权限不足：参考 GitHub CLI 文档，完成登录与 SSO 授权
  - 文档参考：[github-gh-local.md](file:///Users/bytedance/Documents/GitHub/VChart/.trae/documents/github-gh-local.md)

## 示例调用
- skill: github.create-pr-from-file { title: 'feat: add legend', mode: 'auto' }

## 失败返回示例
- 正文为空或文件不存在：
  - 返回：`PR 正文为空或文件不存在`
  - 日志示例：`[ERROR] body file not found: ./.trae/output/pr.body.local.md`
- REST 403（权限不足/未授权）：
  - 返回：HTTP 403，`Resource not accessible by personal access token`
- gh 未登录：
  - 返回：`gh: Not authenticated`

## 修复步骤
- 先执行 PR 正文生成技能或提供有效 `bodyFile`
- 使用 Fine‑grained `GITHUB_TOKEN` 并完成组织 SSO 授权（参考 token 文档）；或登录 `gh` 并授权（参考 gh 文档）
- 重新运行 dry-run：`./.trae/scripts/dry-run-create-pr.sh` 确认通道与正文文件
