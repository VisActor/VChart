## 概述
- 技能：release.changelog-rush-smart（生成 Rush 变更条目与富消息）
- 作用：采集差异与提交、自动判定 bump 类型、构建消息并运行 rush change

## 参数
- sinceBranch（string，默认 develop）
- message（string，默认 ''）
- bumpType（enum: auto|major|minor|patch，默认 auto）
- notCommit（boolean，默认 true）
- githubToken（string，默认 ''）：用于聚合 Issue 标题

## 输出
- rush_change_entries、computed_bump_type、final_message

## 成功标准
- rush_changes_generated、commitlint_passed

## 失败案例与指引
- commitlint 不通过：调整 message 或按提交主题自动生成
- GitHub 标题聚合失败：检查 token、组织 SSO 与仓库权限

## 示例调用
- skill: release.changelog-rush-smart { sinceBranch: 'develop', bumpType: 'auto' }

## 失败返回示例
- commitlint 不通过：
  - 返回：`✖ subject may not be empty [subject-empty]`
- rush change 失败：
  - 返回：`Error: rush change ...`（权限/路径问题）

## 修复步骤
- 按规范修订 `message` 或使用自动生成；必要时在 `common/autoinstallers/lint/commitlint.config.js` 验证规则
- 确认 Rush 环境与仓库结构；在仓库根目录运行，确保有 `common/changes/`
