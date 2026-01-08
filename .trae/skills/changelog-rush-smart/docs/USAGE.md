# 使用说明：changelog-rush-smart

本技能用于根据 Git 提交记录为 Rush monorepo 项目智能生成变更日志。

## 何时使用

- **PR 前**: 在发起 Pull Request 之前，使用此技能为你的变更生成标准的 `changelog` 条目。
- **发布准备**: 作为 `auto-flow` 编排的一部分，在 `auto-test` 之后自动执行，确保版本历史的完整性。

## 示例对话

**场景一: 自动生成**

> **你**: “请为我最近的提交生成 changelog。”
>
> **Agent**: (执行技能) “变更日志已生成。`bumpType` 被自动判断为 `patch`。文件已创建于 `common/changes/` 目录。”

**场景二: 手动指定类型和消息**

> **你**: “执行 `changelog-rush-smart`，`bumpType` 设为 `minor`，并使用消息 '新增图表系列，支持交互式图例'。”
>
> **Agent**: (使用指定参数执行) “好的，已使用 `minor` 类型和你的自定义消息生成了变更日志。”

## 关键参数

- `sinceBranch`: 定义比较的基准分支，默认为 `develop`。
- `bumpType`: 版本变更类型，可以是 `auto`, `major`, `minor`, `patch`。`auto` 会基于提交信息自动推断。
- `message`: 手动指定的变更摘要。如果留空，将根据提交记录自动生成。
- `githubToken`: （可选）提供 GitHub 个人访问令牌，以便自动拉取并聚合关联 Issue 的标题。

## 命令示例

```bash
# 在 VChart 仓库根目录，基于 develop...HEAD 的变更批量生成 changelog 条目
rush change --bulk
```

在交互过程中选择合适的变更类型（major/minor/patch）并填写简明的 message，生成的文件会位于 `common/changes/**`。

## 注意事项

- 自动生成的消息质量高度依赖于规范、清晰的 Git 提交历史。
- 本技能仅生成 `common/changes/**` 下的文件，不执行 `rush version` 或 `rush publish`。
- 如果需要自动关联 Issue 标题，请确保 `GITHUB_TOKEN` 已在环境中正确配置。
- 如果 `common/changes/**` 中已经存在覆盖当前提交的条目（例如之前已经为某次修复创建过记录），可以只复核这些文件，不必重复生成新的条目。
