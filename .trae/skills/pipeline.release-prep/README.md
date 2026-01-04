## 概述
- 技能：pipeline.release-prep（发布准备编排）
- 作用：单步/串行执行 Autotest→Changelog→Commit→PR

## 参数
- baseBranch、lang、labels、topic、message、bumpType、notCommit、head、commitAllowEmpty、pushAfterCommit、commitMessageStrategy、flowStep、autoNext

## 输出
- autotest_report、rush_change_entries、commit_message、pushed_branch、pr_url、next_step_hint

## 成功标准
- flow_step_completed

## 失败案例与指引
- 任一步骤失败：依据该子技能 README 的排查指引；串行模式会在失败处停止

## 示例调用
- 单步：skill: pipeline.release-prep { flowStep: 1 }
- 串行：skill: pipeline.release-prep { autoNext: true }

## 失败返回示例
- 任一步骤失败时：
  - 返回：子技能的错误信息，编排在该步骤停止
  - 示例：`[step-3-commit] push rejected` / `[step-2-changelog] commitlint failed`

## 修复步骤
- 依据错误源查看对应技能 README 并按指引修复
- 使用 dry-run 脚本定位问题：
  - `./.trae/scripts/dry-run-release-prep.sh` 展示流程
  - 逐步运行各子脚本验证环境与凭据
