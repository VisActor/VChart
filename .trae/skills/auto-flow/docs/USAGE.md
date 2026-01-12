# 使用说明：auto-flow

本技能将创建 Pull Request 的所有准备工作（测试、变更日志、提交、生成正文、创建 PR）串联成一个标准化的五步流程。

## 何时使用

- **发布准备**: 当你完成一个功能或修复，准备发起一个完整的、高质量的 Pull Request 时，使用此技能可以确保所有检查项都已完成。
- **标准化贡献**: 团队成员可以使用此流程来确保所有贡献都遵循相同的质量标准。

## 流程与人工检查点

本技能是一个带有“门禁”的流水线，每一步完成后都会暂停，等待你的确认：

1.  **自动测试**: 技能首先为你的代码变更生成并运行测试，并将结果写入 `./.trae/output/autotest.report.local.md`（即使没有新增测试也会包含“无新增自动化测试 (No new tests generated)” 说明）。
    *   **你需要**: 打开该报告，检查覆盖率和测试结果是否符合预期。

2.  **生成变更日志**: 接着，它会为你的提交创建 `changelog` 文件。
    *   **你需要**: 检查 `common/changes/` 目录下生成的文件内容是否准确。

3.  **智能提交**: 然后，所有变更会被打包成一个规范的 Git 提交并推送。
    *   **你需要**: 确认自动生成的提交信息是正确的。

4.  **生成 PR 正文**: 技能会自动填充 PR 模板，从 `./.trae/output/autotest.report.local.md` 和 `common/changes` 中汇总信息，并将正文写入 `./.trae/output/pr.body.local.md`。
    *   **你需要**: 审阅生成的 PR 正文，可选择在本地修改 `.md` 文件。

5.  **创建 PR**: 最后，使用准备好的正文创建 PR。
    *   **你需要**: 访问返回的 PR 链接，做最终确认；如失败，优先检查 `gh auth status`、`git remote -v` 与分支是否已推送。

## 示例对话

> **你**: “启动 `auto-flow` 流程，为我的新功能做发布准备。”
>
> **Agent**: (执行第一步) “第一步：测试已完成，报告位于 `.../autotest.report.local.md`。请检查后告诉我是否继续。”
>
> **你**: (检查后) “继续。”
>
> **Agent**: (执行第二步) “第二步：变更日志已生成。请检查 `common/changes/` 目录。确认无误后，请告诉我是否继续。”
>
> **你**: “继续。”
>
> *... (Agent 会继续执行后续步骤，并在每一步后请求确认)*

## 关键参数

- `baseBranch`: PR 的目标分支，默认为 `develop`。
- `topic`: 用于生成 PR 标题，建议提供。
- `message`: 用于 `changelog` 和 `commit` 的自定义消息。

## 注意事项

- **凭证**: 确保 `gh` CLI 已安装并通过 `gh auth status` 登录成功（本流程的 PR 创建为 gh-only，不再回退 REST）。
- **顺序固定**: 本技能的五个步骤是固定的，不能跳过或重排。
- **失败中断**: 流程中任何一步失败都会导致整个流程中断。

## 故障排查与 Quick Actions（PR 创建失败时）

当流程执行到第 5 步“创建 PR”时，如因权限或认证问题失败，可在终端直接使用 `gh pr create` 完成创建：

### gh CLI

```bash
gh auth login

gh pr create \
  -B develop \
  -H <your-branch> \
  -t "<your-title>" \
  -F ./.trae/output/pr.body.local.md \
  --label changelog \
  --label test
```
> 提示：如仍失败，检查 `gh auth status`、`gh repo view`、`git remote -v` 与 `git push -u origin <branch>` 是否正常；详见 [GH_CLI.md](file:///Users/bytedance/Documents/GitHub/VChart/.trae/skills/pr-create-from-body/docs/GH_CLI.md) 的常见问题与处理。
