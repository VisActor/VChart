# Skills 概述与迁移规范

## 目标
- 将现有 .trae/jobs 中的任务流标准化为跨 IDE 可复用的 Skills，保留 Solo 可运行性，并提供工具适配（gh/REST、git/shell、rush/jest）。

## 结构
- 每个技能以 `.skill.yaml` 描述：id、version、description、domain、runner、dependencies、env、parameters、inputs、outputs、success_criteria、steps。
- 步骤支持 command、tool、composite 类型，具备 guards、dryRun、continueOnError 与 uses 映射（gh-cli、github-rest、git-cli、rush-cli、jest-cli）。

## 适配层
- gh-cli 与 github-rest 双路；git-cli 基于系统 Shell；rush-cli 与 jest-cli 可替换为 npm/yarn。

## 输出
- 报告与中间产物默认写入 `.trae/output/**`，可通过参数覆盖。

## 示例调用
- 提交并推送：`skill: git.commit-push-smart { pushAfterCommit: true, commitMessageStrategy: 'auto' }`
- 创建 PR：`skill: github.create-pr-from-file { title: 'feat: add legend', mode: 'auto' }`
- 采集差异：`skill: vcs.diff-collect { sinceBranch: 'develop' }`
- 单测生成：`skill: test.autogen-from-diff { project: '@visactor/vchart' }`

## 环境前置
- gh-cli 或 GITHUB_TOKEN；git 已安装；rush/jest（或 npm/yarn 替代）。
- 未满足前置时按技能中的 guards 与回退策略处理。
