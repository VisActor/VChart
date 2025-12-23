# Changelog（Rush 智能变更日志）Solo 使用说明

- 入口文件：`./.trae/jobs/changelog-rush-smart.md`
- 作用：对齐并增强 `change-all.ts`，生成 Rush 变更条目（`common/changes/**`）

## 参数
- `sinceBranch`：默认 `develop`
- `message`：可选；若为空自动生成富摘要
- `bumpType`：`auto|major|minor|patch`，默认 `auto`
- `notCommit`：是否跳过 `git commit`，默认 `true`
- `githubToken`：可选，聚合 Issue 标题时需要

## 使用（Solo）
- 在聊天中发起：“执行 Changelog Job（.trae/jobs/changelog-rush-smart.md）”，可附加：
  - `message: 'docs: chore(trae): add auto-flow'`
  - `bumpType: patch`

## 输出
- `rush_change_entries`：新增的变更条目路径集合
- `computed_bump_type`：自动判定的 bump 类型
- `final_message`：最终用于 `rush change` 的消息

## 人工检查
- 复核 `common/changes/**` 的内容（包名、类型、comment），必要时重新执行并覆盖 `message/bumpType`
