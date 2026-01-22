# 使用说明：pr-create-from-body

本技能用于将在本地准备好的 Pull Request 正文文件发布到 GitHub，完成 PR 的创建。

## 何时使用

- **发布的最后一步**: 当你已经生成并审查了 PR 正文后，使用此技能来完成最后的创建步骤。
- **手动创建**: 如果你手动编写了一个 `.md` 文件作为 PR 正文，也可以使用此技能来创建 PR。

## 示例对话

**场景一: 使用默认正文文件创建 PR**

> **你**: “PR 正文已经准备好了，现在请帮我用 'feat: add new chart type' 这个标题创建一个 PR。”
>
> **Agent**: (执行技能) “好的。正在读取 `./.trae/output/pr.body.local.md` 的内容... Pull Request 已创建：https://github.com/VisActor/VChart/pull/123”

**场景二: 创建一个草稿 PR 并添加标签**

> **你**: “执行 `pr-create-from-body`，标题是 'WIP: refactor data processor'，设为草稿模式，并加上 'refactor' 和 'WIP' 标签。”
>
> **Agent**: (执行技能) “已成功创建一个草稿 Pull Request，并添加了指定标签。链接是: ...”

## 关键参数

- `title`: **(必填)** Pull Request 的标题。
- `base`: PR 的目标分支，默认为 `develop`。
- `head`: PR 的源分支。如果留空，将自动使用当前分支。
- `bodyFile`: 包含 PR 正文的本地文件路径，默认为 `./.trae/output/pr.body.local.md`。
- `draft`: 是否将 PR 创建为草稿状态，默认为 `false`。

## 注意事项

- **凭证**: 执行前，必须确保 `gh` CLI 已安装并登录。请参阅本技能目录下的 `docs/GH_CLI.md`。
- **分支推送**: 在创建 PR 之前，请务必确保你的本地分支 (`head`) 已经推送到 GitHub 远程仓库，否则 GitHub 无法找到该分支。
- **正文文件**: 确认 `bodyFile` 指向的文件存在且内容正确。
- **常见失败的排查清单**：
  - 使用 `gh auth status` 检查 CLI 登录状态以及是否已为目标组织完成 SSO 授权；
  - 在仓库根目录运行 `git remote -v` 与 `gh repo view`，确认当前目录映射到 GitHub 上的 `VisActor/VChart` 仓库；
  - 确认分支已推送（`git push -u origin <your-branch>`），并确保不存在重复的 `head→base` 打开 PR
  - 若环境中存在 `GITHUB_TOKEN` 导致使用 Token 认证，请改用本地凭证：`env -u GITHUB_TOKEN gh auth login` 后重试

## Quick Actions（一键命令示例）

### gh CLI

在 VChart 仓库根目录执行：

```bash
# 登录（如尚未登录）
gh auth login

# 使用本地正文文件创建 PR
env -u GITHUB_TOKEN gh pr create \
  -B develop \
  -H <your-branch> \
  -t "<your-title>" \
  -F ./.trae/output/pr.body.local.md \
  --label changelog \
  --label test
  # 可选：更多参数
  # --draft
  # --assignee your-username
  # --reviewer reviewer-1 --reviewer reviewer-2
```
